---
title: "AI Legal Document Verification With Langchain.js"
layout: post
excerpt: "My company has an Acceptable Use Policy all customers must follow. Despite our best efforts, we continue to have signups who violate the AUP. I wanted to build a solution to ensure no company could slip by us. It saves our customer service team an uncomfortable conversation and gives my superiors a sense of calm, knowing nobody is getting by."
---

![legal](https://jesselangford-cdn.s3.amazonaws.com/images/legal.jpg)

My company has an Acceptable Use Policy all customers must follow. Despite our best efforts, we continue to have signups who violate the AUP. I wanted to build a solution to ensure no company could slip by us. It saves our customer service team an uncomfortable conversation and gives my superiors a sense of calm, knowing nobody is getting by.

Some violative industries are:

- Adult products and services
- Tobacco
- Gambling
- Firearms

## Getting Started

I aimed to build a small Node, TypeScript, and express API capable of taking inputs and returning AI-generated answers for specific business logic scenarios. The AI-generated responses will be generated using [Langchain](https://js.langchain.com/docs/get_started/introduction).

## AUP Document Storage

Before I can check websites against our AUP, I need to process the file so it can be used in AI queries. I loaded the PDF into a Pinecone vector store for easy access.

```javascript
import { PineconeClient } from "@pinecone-database/pinecone";
import { Router } from "express";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "langchain/vectorstores/pinecone";

const router = Router();

router.post("/local", async (req, res, next) => {
  try {
    const directoryLoader = new DirectoryLoader("dir", {
      ".pdf": (path) => new PDFLoader(path),
      ".json": (path) => new JSONLoader(path),
    });
    const loadedDocs = await directoryLoader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 0,
    });

    const pinecone = new PineconeClient();

    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? "",
      apiKey: process.env.PINECONE_API_KEY ?? "",
    });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME ?? "");
    const docs = await textSplitter.splitDocuments(loadedDocs);
    const embeddings = new OpenAIEmbeddings();
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: pineconeIndex,
      namespace: process.env.PINECONE_INDEX_NAMESPACE,
    });
  } catch (error) {
    next(error);
  }
});
```

Once the document is processed, I can create the endpoint responsible for the check. Below is the finished version of the endpoint. The rest of the article will go through the code step by step.

```javascript
import axios from "axios";
import { Router } from "express";
import { RetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { WebBrowser } from "langchain/tools/webbrowser";
import { getPineconeVectorStore } from "../utils";

const router = Router();

router.post("/get-profile", async (req: any, res: any, next: any) => {
  try {
    const url = req.body.url;

    await axios.get(url);

    const vectorStore = await getPineconeVectorStore(
      process.env.PINECONE_INDEX_NAME ?? "",
      process.env.PINECONE_INDEX_NAMESPACE
    );

    const model = new OpenAI({
      temperature: 0,
      modelName: "gpt-3.5-turbo",
    });

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

    const urlResponse = await chain.call({
      query: ` Are there any direct or indirect references to prohibited products and services in the following string: "${url}".`,
    });

    if (urlResponse.text.includes("Yes")) {
      res
        .send({ aupVerdict: urlResponse.text, summary: "No summary needed." })
        .status(200);
      return;
    }

    const embeddings = new OpenAIEmbeddings();
    const browser = new WebBrowser({ model, embeddings });

    const summary = await browser.call(
      `${url},
      Give a three sentence summary of the products or services offered on the website.
      `
    );

    const response = await chain.call({
      query: ` Are there any direct or indirect references to prohibited products and services in the following website summary: "${summary}".`,
    });

    res.send({ aupVerdict: response.text, summary: summary.text });
  } catch (error) {
    next(error);
  }
});

export default router;
```

Inside the function, I’ll start by ensuring the provided URL leads to a valid website.

```javascript
await axios.get(url);
```

After the validity check, I need to define the variables needed for Langchain.

```javascript
const vectorStore = await getPineconeVectorStore(
  process.env.PINECONE_INDEX_NAME ?? "",
  process.env.PINECONE_INDEX_NAMESPACE
);

const model = new OpenAI({
  temperature: 0,
  modelName: "gpt-3.5-turbo",
});

const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
```

The chain variable is defined by Langchain [here](https://js.langchain.com/docs/modules/chains/popular/vector_db_qa).

getPineconeVectorStore is a helper function defined below:

```javascript
import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export async function getPineconeClient() {
  const pinecone = new PineconeClient();

  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT ?? "",
    apiKey: process.env.PINECONE_API_KEY ?? "",
  });

  return pinecone;
}

export async function getPineconeVectorStore(name: string, namespace?: string) {
  const pinecone = new PineconeClient();

  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT ?? "",
    apiKey: process.env.PINECONE_API_KEY ?? "",
  });

  const pineconeClient = await getPineconeClient();
  const index = pineconeClient.Index(name);

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({}),
    {
      pineconeIndex: index,
      namespace,
    }
  );

  return vectorStore;
}
```

Once all my variables are in place, I can do my first AI query. I start with checking the URL text because it’s an easy way to weed out obvious offenders before using heavier resources. For example, if a customer signs up with a company website: xxxstripclub.com or crazygunseller.com, we don’t need to scrape their website to be reasonably sure of an AUP violation.

```javascript
const urlResponse = await chain.call({
  query: ` Are there any direct or indirect references to prohibited products and services in the following string: "${url}".`,
});

if (urlResponse.text.includes("Yes")) {
  res
    .send({ aupVerdict: urlResponse.text, summary: "No summary needed" })
    .status(200);
  return;
}
```

The chain is using the AUP file held in Pinecone as context for the question. If the verdict contains Yes, I immediately return the response and exit the function.

## Example

```bash
URL: https://www.crazygundealer.com/

Response:
{
    "aupVerdict": "Yes, there is a direct reference to a prohibited product in
    the string \"https://www.crazygundealer.com/\". The website contains the
    word \"gun\" which is mentioned as a prohibited product in the context.",

    "summary": "No summary needed"
}
```

Once the first check passes, I can use the [Langchain Browser Tool](https://js.langchain.com/docs/integrations/tools/webbrowser) to get a summary of the content for the given URL.

```javascript
const embeddings = new OpenAIEmbeddings();
const browser = new WebBrowser({ model, embeddings });

const summary = await browser.call(
  `${url},
    Give a three sentence summary of the products or services offered on the website.
  `
);
```

## Example

```bash
URL: http://www.houndstownusa.com/

Response:

The website offers dog daycare, boarding, and pet spa services.
They pride themselves on providing a fully interactive and engaging
environment for dogs, with no breed discrimination and well-trained staff.
They also emphasize the natural pack environment and transparency with no
hidden fees.
```

Once I have the summary, I can prompt Pinecone to see if anything in the summary violates the stored AUP.

```javascript
const response = await chain.call({
  query: ` Are there any direct or indirect references to prohibited products and services in the following website summary: "${summary}".`,
});

res.send({ aupVerdict: response.text, summary: summary.text });
```

The response and summary are then returned from the function and passed back into the response body.

```json
{
    "aupVerdict": "No, there are no direct or indirect references to
      prohib ited products and services in the website summary provided.",
    "summary": "The website offers dog daycare, boarding,
      and pet spa services. They pride themselves on providing a
      fully interactive and engaging environment for dogs, with no
      breed discrimination and well-trained staff. They also emphasize
      the natural pack environment and transparency with no hidden fees.",
}
```

## Wrapping Up

I hope the above example gave insight into using Langchain to automate a mundane task like legal document verification.
