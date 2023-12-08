---
title: "Finding A Company's Primary Color From Their Favicon With Node.js"
layout: post
excerpt: "How to find the most common color in a given image with Node.js."
thumbnail: "https://s3.amazonaws.com/jesselangford.dev/images/color-wheel.jpg"
---

![Color Wheel](https://s3.amazonaws.com/jesselangford.dev/images/color-wheel.jpg)

A while ago, I was tasked with developing creative ways to enhance our customers' experience. One of the immediate targets I had was to find how to obtain a company's primary color from their website.

Much of our product involves company color, logo, and other branding customization. My goal was first to obtain a company's primary color and automatically apply it to their new designs. A pleasant surprise and delight feature.

The feature is built into an existing codebase. I have split everything for the article into a standalone Node.js application. I am assuming a basic knowledge of Node.js Express and Yarn.

## Getting Started

To get started, I created a blank Node.js application.

```bash
mkdir company-color
cd company-color
yarn init
```

Once the base is there, I add the four packages needed to run everything.

```bash
yarn add sharp colorthief axios express
```

[Sharp]("https://www.npmjs.com/package/sharp") is a high-performance image processor for Node. [Color Thief]("https://www.npmjs.com/package/colorthief") enables me to get a color palette from an image using just Javascript. [Axios]("https://www.npmjs.com/package/axios") is a promise-based HTTP client.

Below is the complete example project. I'll spend the rest of the article going through each section.

```javascript
import axios from "axios";
import { getColor } from "colorthief";
import express from "express";
import sharp from "sharp";

const app = express();
app.use(express.json());

app.post("/get-color", async (req, res) => {
  try {
    const pngBuffer = await axios.get(
      `https://www.google.com/s2/favicons?domain=${req.body.url}`,
      { responseType: "arraybuffer" }
    );

    const jpegBuffer = await sharp(pngBuffer.data)
      .toFormat("jpeg")
      .removeAlpha()
      .flatten({ background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .jpeg()
      .toBuffer();

    const base64Image = jpegBuffer.toString("base64");

    const dominantColor = await getColor(
      `data:image/jpeg;base64,${base64Image}`
    );

    res.send({ color: rgbToHex(dominantColor) });
  } catch (error) {
    console.log("Error: ", error);
  }
});

app.listen(process.env.PORT || 3030, () => {
  console.log(`Example app listening on port ${process.env.PORT || 3030}`);
});

function rgbToHex(rgbArray: number[]) {
  const [red, green, blue] = rgbArray;

  const hexRed = red.toString(16).padStart(2, "0");
  const hexGreen = green.toString(16).padStart(2, "0");
  const hexBlue = blue.toString(16).padStart(2, "0");

  return `#${hexRed}${hexGreen}${hexBlue}`;
}
```

The first part requests the Google Favicon API.

```javascript
const pngBuffer = await axios.get(
  `https://www.google.com/s2/favicons?domain=${req.body.url}`,
  { responseType: "arraybuffer" }
);
```

The URL https://www.google.com/s2/favicons is used by Google's services to retrieve websites' favicons.

The favicons API returns a PNG file. If I do not supply the { responseType: "arraybuffer" } in the request, my response will be a raw PNG file:

```text
�PNG
IHD(-S6PLTEu��i��������u��t��q��GpLu��u��������^�������񋶫������`8~�
tRNS��������;��IDAT�U���D�X�����٪M��@m�(�Bۅ ���^M5�lv�q�;Ej��,
B�~���� ��0���Bd#<bt�t�@F�����ͮl�.O:o$�q��8'�A�9N_��j���wP�����?0��IEND�B`�
```

With the { resonseType: "arraybuffer" } I get a Buffer type instead:

```text
<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 00 10 00 00 00 10 08 03 00 00 00 28 2d 0f 53 00 00 00 36 50 4c 54 45 75 a9 9c 69 a3 95 d4 e3 df ... 236 more bytes>
```

Buffer is a built-in object in Node.js that provides a way to work with binary data directly. It is primarily used to handle raw binary data, such as images, audio files, and other types of data that are not text-based.

Color-thief works best with JPEG files, so I use the sharp library to convert from PNG to JPEG.

```javascript
const jpegBuffer = await sharp(pngBuffer.data)
  .toFormat("jpeg")
  .removeAlpha()
  .flatten({ background: { r: 255, g: 255, b: 255, alpha: 0 } })
  .jpeg()
  .toBuffer();
```

By default, the new image will have a black background. This makes determining the primary color of the logo difficult. The two methods removeAlpha() and flatten() make the background color of the newly created JPEG transparent.

As an example, take https://mui.com/

Their favicon is: ![MuiWhite](https://s3.amazonaws.com/jesselangford.dev/images/mui-white.png)

Without the transparency methods, the returned JPEG looks like this: ![MuiBlack](https://s3.amazonaws.com/jesselangford.dev/images/mui-back.jpeg)

The black background will influence the outcome of color-thief in the next step. When I add the two methods, I get this: ![MuiWhite](https://s3.amazonaws.com/jesselangford.dev/images/mui-white.png)

Next, I convert the new JPEG into base64. This saves me from having to save the JPEG response to a local file to be used with color-thief.

```javascript
const base64Image = jpegBuffer.toString("base64");
```

Once I have the base64, I can pass the data to color-thief

```javascript
const dominantColor = await getColor(`data:image/jpeg;base64,${base64Image}`);
```

DominantColor is an RGB array. The final step is to convert the returned color into a hex color.

```javascript
res.send({ color: rgbToHex(dominantColor) });
```

## Final Thoughts

I had a good time building this feature. I never knew Google had a favicon search URL or had ever played around with the sharp library. I hope reading this piece can give you some ideas for improving your customer journey.
