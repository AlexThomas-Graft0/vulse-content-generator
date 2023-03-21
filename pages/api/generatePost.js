const systemPrompt = {
  role: "system",
  content: `Generate a compelling LinkedIn post for your audience. Ensure that you provide diverse and engaging content ideas while considering the user's preferences. Write a post on the following topic: `,
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

    let messages = [systemPrompt, ...req.body.messages];

    console.log({ messages });

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-4",
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
