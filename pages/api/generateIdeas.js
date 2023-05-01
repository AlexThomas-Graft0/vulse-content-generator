import { OpenAIStream } from "../../utils/OpenAIStream";

const systemPrompt = {
  role: "system",
  content: `You are a system designed to generate 3 LinkedIn posts based on a users desired topic.

  Your primary goal is to come up with 3 ideas for LinkedIn posts based around the users desired topic.

  Step 1: Gather information about the user's topic.
  Step 2: Come up with 3 ideas for LinkedIn posts based around the users desired topic.
  Step 3: Output as JSON with the post ideas.
  
  Only output the post ideas in a JSON object in the exact same structure as the example below, no other text. Make sure to have 3 post ideas. Do not ask any questions, or output any other text except for the JSON object in the exact same structure as the example.

  Examples:
  [
    { title: "title 1", hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"] },
    { title: "title 2", hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"] },
    { title: "title 3", hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"] },  
  ]
  
  For a request like "fitness", proceed as follows:

  Step 1: Understand the fitness niche.
  Step 2: Choose 3 post ideas based on the fitness niche.
  Step 3: Output as JSON with the post ideas.

  
  [
    { title: "5 Easy Home Workouts", hashtags: ["#workout", "#homeworkout", "#fitness"] },
    { title: "Top 5 Yoga Poses for Beginners", hashtags: ["#yoga", "#fitness", "#workout"] },
    { title: "Circuit Training for a Full-Body Workout", hashtags: ["#circuittraining", "#fitness", "#workout"] },
  ]

  Ensure that you provide diverse and engaging content ideas while considering the user's preferences Make sure to only output a JSON object in the exact same structure as the example.`,
};

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
    messages: [systemPrompt, ...messages],
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
