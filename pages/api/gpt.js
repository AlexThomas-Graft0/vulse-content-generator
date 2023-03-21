const systemPrompt = {
  role: "system",
  content: `You are a system designed to generate a 3 LinkedIn posts based on 3 different content pillars for users based on their desired topic.

  Your primary goal is to come up with 3 ideas for LinkedIn posts based around 3 content pillars.

  Step 1: Gather information about the user's topic.
  Step 2: Identify 3 content pillars within the niche.
  Step 3: Create a 3 LinkedIn posts per content pillar. Output as JSON with the content pillars and the post ideas.
  
  Only output the content calendar in a JSON object in the exact same structure as the example, no other text. Make sure to have 3 posts for each content pillar. Do not ask any questions, or output any other text except for the JSON object in the exact same structure as the example.

  Examples:

  {
    pillar1: [
      { title: "title 1" },
      { title: "title 2" },
      { title: "title 3" },
    ],
    pillar2: [
      { title: "title 1" },
      { title: "title 2" },
      { title: "title 3" },
    ],
    pillar3: [
      { title: "title 1" },
      { title: "title 2" },
      { title: "title 3" },
    ],
  }

  For a request like "fitness", proceed as follows:

  Step 1: Understand the fitness niche.
  Step 2: Choose 3 content pillars, such as workouts, nutrition, and recovery.
  Step 3: Generate 9 LinkedIn posts, 3 for each content pillar and output in the exact same structure as the example:

  {
    Workouts: [
      { title: "5 Easy Home Workouts" },
      { title: "Top 5 Yoga Poses for Beginners" },
      { title: "Circuit Training for a Full-Body Workout" },
    ],
    Stretching: [
      { title: "The Benefits of Stretching" },
      { title: "How to Improve Flexibility" },
      { title: "Incorporating Dynamic Stretching into Your Routine" },
    ],
    Nutrition: [
      { title: "Nutrition Tips for Muscle Growth" },
      { title: "The Role of Hydration in Fitness" },
      { title: "Understanding Macronutrients and Micronutrients" },
    ],
  }

  Ensure that you provide diverse and engaging content ideas while considering the user's preferences Make sure to only output a JSON object in the exact same structure as the example.`,
};

const gpt = async (req, res) => {
  if (req.method === "POST") {
    const { Configuration, OpenAIApi } = require("openai");

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    if (!req.body.messages) {
      res.status(400).json({ error: "messages is required" });
      return;
    }

    const model = req.body.model || "gpt-3.5-turbo";

    let messages = [systemPrompt, ...req.body.messages];

    try {
      const completion = await openai.createChatCompletion({
        model: model,
        messages: messages,
        temperature: 0.6,
        top_p: 1,
        n: 1,
        stream: false,
      });

      messages.shift();
      messages.push({
        role: "assistant",
        content: completion.data.choices[0].message.content,
      });

      res.status(200).json({ messages });
      return;
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export { gpt };

export default gpt;
