import { OpenAIStream } from "../../utils/OpenAIStream";
import { createParser } from "eventsource-parser";

import puppeteer from "puppeteer";
import dotenv from "dotenv";
import pLimit from "p-limit";
import fs from "fs";
import { Configuration, OpenAIApi } from "openai";
dotenv.config();

// OpenAI API setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function crawlPage(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote",
      "--single-process",
    ],
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.isNavigationRequest()) {
      request.continue();
    } else {
      request.abort();
    }
  });
  await page.goto(url);

  const websiteContent = await page.evaluate(() => {
    return document.querySelector("body").innerText.trim();
  });

  if (websiteContent.length > 8000) {
    console.log("Website content is too long, skipping");
    await browser.close();
    return null;
  }

  await browser.close();

  const messages = [
    {
      role: "system",
      content:
        "Summarize the key points from the text on this page and return them. Do not return any other text.",
    },
    {
      role: "user",
      content: websiteContent,
    },
  ];

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: messages,
      temperature: 0.7,
      top_p: 1,
      n: 1,
      stream: false,
    });

    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content.trim();
    }
  } catch (error) {
    console.error("Error crawling page:", error);
  }
}

async function generateSearchQuery() {
  const messages = [
    {
      role: "system",
      content:
        "You are a search bot, you must take the users desired topic and generate a search query. Only return 1 single query, no other text.",
    },
    {
      role: "user",
      content: searchPrompt,
    },
  ];

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      top_p: 1,
      n: 1,
      stream: false,
      max_tokens: 64,
    });

    if (response.data.choices && response.data.choices.length > 0) {
      console.log("Choices:", response.data.choices);
      return response.data.choices[0].message.content.trim();
    }
  } catch (error) {
    console.error("Error generating search query:");
  }
}

async function searchWeb(query) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.isNavigationRequest()) {
        request.continue();
      } else {
        request.abort();
      }
    });

    await page.goto(
      `https://www.google.com/search?q=${encodeURIComponent(query)}`
    );

    const results = await page.evaluate(() =>
      Array.from(document.querySelectorAll("div.g"))
        .map((div) => div.querySelector(".yuRUbf a")?.href)
        .filter(Boolean)
    );
    await browser.close();
    const summarisedData = [];
    for (const link of results) {
      const summary = await crawlPage(link);
      if (!summary) {
        console.log("No summary found, skipping");
        continue;
      } else {
        summarisedData.push(summary);
      }
    }

    console.log("getting here at least");
    return summarisedData;
  } catch (error) {
    console.error("Error searching the web:", error);
  }

  console.log("hitting here");
  return [];
}

// const systemPrompt = {
//   role: "system",
//   content: `You are a system designed to generate a LinkedIn post for users based on their desired topic in the users writing style.`,
// };

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

async function POST(req) {
  const { messages, model, webSearch } = await req.body;

  if (!messages) {
    return new Response("Missing messages", { status: 400 });
  }

  let pretrainingMessage = null;

  if (webSearch) {
    console.log("Web search is true");
    const queryString = `Everything there is to know about ${
      messages[messages.length - 1].content
    }`;

    const summaries = await searchWeb(queryString);

    pretrainingMessage = {
      role: "system",
      content: `The following summaries are the latest information on ${queryString}. ${
        summaries?.join(" ") || "No summaries found"
      }`,
    };
  }
  const finalMessages = [
    pretrainingMessage ? pretrainingMessage : null,
    ...messages,
  ].filter(Boolean);

  console.log("Final messages:", finalMessages);

  const payload = {
    model: model || "gpt-3.5-turbo",
    messages: finalMessages,
    temperature: 0.6,
    top_p: 1,
    n: 1,
    stream: true,
  };

  console.log({ payload });
  const stream = await OpenAIStream(payload);
  return new Response(stream);
}

export default POST;
