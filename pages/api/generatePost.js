// content: `Analyse the following LinkedInPosts and generate a compelling LinkedIn post. Ensure that you provide diverse and engaging content ideas while considering the user's preferences. Every post must end with 3 relevant and popular hastags. `,
const systemPrompt = {
  role: "system",
  content: `You are a system designed to generate a 3 LinkedIn posts based on 3 different content pillars for users based on their desired topic in the users writing style.`,
};

const messageStructure = {
  role: "user",
  message: "Hello, how are you?",
};

const generatePost = async (req, res) => {
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

    console.log("req.body.messages");
    console.log(req.body.messages);
    console.log("req.body.messages");

    let messages = [systemPrompt, ...req.body.messages];

    console.log({ messages });
    console.log({ model });

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

export { generatePost };

export default generatePost;
