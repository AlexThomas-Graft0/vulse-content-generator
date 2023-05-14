import { OpenAIStream } from "../../utils/OpenAIStream";

// const systemPrompt = {
//   role: "system",
//   content: `You are a system designed to generate a LinkedIn post for users based on their desired topic in the users writing style.`,
// };

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

async function POST(req) {
  const { messages, model } = await req.json();

  if (!messages) {
    return new Response("No messages in the request", { status: 400 });
  }

  const payload = {
    model: model || "gpt-3.5-turbo",
    messages: [...messages],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}

export default POST;
