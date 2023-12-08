---
title: "AI-Generated Usernames With Node.js And Langchain"
layout: post
excerpt: "A simple tool using Langchain to generate usernames for a given company name."
thumbnail: "https://s3.amazonaws.com/jesselangford.dev/images/ai-username.jpeg"
---

![AI Usernames](https://s3.amazonaws.com/jesselangford.dev/images/ai-username.jpeg)

We require a username when users sign up for my company's product. The username must be unique in our system and cannot be changed after signup. It's all industry-standard stuff. Unfortunately, another standard part of usernames is how bad our users are at picking them. Many customers have come to us asking if they can change their usernames. The most common screw-up is someone creating a company account and using their name for the username. For example, Ted Smith creates an account for the Acme company with the username tedsmithacme. This becomes a problem when the account is shared, or Ted no longer works for the Acme company.

To reduce the number of bad usernames, I was tasked with using AI to generate suggested usernames for new accounts. I achieved it by taking the user's company name and including it in a prompt to Langchain to generate four username suggestions. Those usernames are then displayed to the customer in the signup form. They are free to select one of the provided names or go ahead with a name they choose. The end goal is fewer regrettable usernames.

## Getting Started

In a [previous article](/ai-legal-document-verification-with-langchainlanchain/)previous article, I wrote about building a Node.js + express API designed to serve endpoints with AI tools. The username generator was added as another endpoint to the API. This article assumes basic knowledge of Node.js and Express.

Below is the complete code example used. I'll go over it piece by piece after

```javascript
import { OpenAI } from "langchain/llms/openai";
import { Router } from "express";

const router = Router();

router.post("/suggest", async (req, res, next) => {

  try {
    const model = new OpenAI({
      temperature: 0,
      modelName: "gpt-3.5-turbo",
    });

    const response = await model.predict(
      `Please return 4 usernames for the company: ${req.body.companyName}.
       Ensure each username has no spaces, only lowercase characters, and
       is a minimum of 6 characters in length.`
    );
    res.send({ text: response });
  } catch (error) {
    console.log("Error: ", error);
    next(error);
}
```

The first step is creating a model object with the Langchain OpenAI class. I've only included the basics for configs. The model variable is a Language Model instance. You can read more about the methods here.

After instantiating the model, I can prompt it with my username request. Again, my prompt is basic and includes username validation to pass our backend checks. It must be one word, at least six characters long, and all lowercase.

Once I have the response, I return the data. Below are some example responses.

```bash
Company Name: Gold Shaw Farm

API Response:
{"text":"1. goldshawfarm\n2. shawfarmgold\n3. farmgoldshaw\n4. goldfarmshaw"}

Company Name: Woof Pack Dog Walking

API Response:
{"text":"1. woofpackdw\n2. dogwalkers\n3. woofpackwalk\n4. pawpatrol"}

Company Name: Shady Acres Retirement Home

API Response:
{ "text": "1. shadyacres\n 2. retirement\n3. homecare\n4. goldenage"}
```

Finally, I integrated the API call into our signup form. Once a user adds their company name, I take the name and request usernames from the API. Once the response is returned, the usernames must be pulled out of the text string. After that, the suggestions are presented to the end user.

![Gold Shaw Example](https://s3.amazonaws.com/jesselangford.dev/images/ai-username-example.png)

Small as it is, it's been a great value add for customers.

## Final Thoughts

When I began integrating AI into software, my assumption was only big and flashy integrations would provide value to customers. My experience has been the opposite. Targeted and seemingly mundane integrations have made a difference for customers and my team.
If you're struggling to develop an AI integration for your company, maybe try looking at some smaller ideas to get you started.
