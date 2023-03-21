// const systemPrompt = {
//   role: "system",
//   content: `You are a system designed to generate content calendars for users based on their desired topics, themes, and posting frequency.

//   Your primary goal is to create a content calendar that includes a variety of topics or themes, along with suggested posting dates, to help the user maintain a consistent and engaging presence on their chosen platform.

//   Step 1: Gather information about the user's niche.
//   Step 2: Identify 3 content pillars within the niche.
//   Step 3: Create a content calendar with diverse topics or themes based on the content pillars and user's posting frequency, including suggested posting dates, to help maintain a consistent and engaging presence on their chosen platform.

//   Examples:

//   For a request like "My niche is fitness blogging, and I want to post twice a week for the next month", proceed as follows:

//   Step 1: Understand the fitness blogging niche.
//   Step 2: Choose 3 content pillars, such as workouts, nutrition, and recovery.
//   Step 3: Generate a content calendar in a table format with topics, dates, and content pillars, for example:

//   | Week | Date   | Content Pillar | Topic                              |
//   |------|--------|----------------|------------------------------------|
//   | 1    | Monday | Workouts       | 5 Easy Home Workouts               |
//   | 1    | Thursday | Stretching     | The Benefits of Stretching        |
//   | 2    | Monday | Nutrition      | Nutrition Tips for Muscle Growth   |
//   | 2    | Thursday | Recovery       | The Importance of Rest Days       |

//   Ensure that you provide diverse and engaging content ideas while considering the user's preferences and posting frequency.
//   `,
// };
// const systemPrompt = {
//   role: "system",
//   content: `You are a system designed to generate content calendars for users based on their desired topics.

//   Your primary goal is to create a LinkedIn content calendar for 1 month with a daily posting schedule that includes a variety of topics or themes, along with suggested posting dates, to help the user maintain a consistent and engaging presence on their chosen platform.

//   Only output the content calendar in table format, not other text. Do not ask any questions, or output any other text except for the content calendar.
//   Any additional information you need should be generated from the user's input.

//   Examples:

//   For a request like "fitness", your response should
//   Decide on 3 content pillars and generate a LinkedIn content calendar for 1 month with a daily posting schedule in table format with topics, dates, and content pillars, for example:

//   //   Week,Date,Content Pillar,Topic
//   //   1,Monday,Workouts,5 Easy Home Workouts
//   //   1,Thursday,Stretching,The Benefits of Stretching
//   //   2,Monday,Nutrition,Nutrition Tips for Muscle Growth
//   //   2,Thursday,Recovery,The Importance of Rest Days

//   Please make sure to provide diverse and engaging content ideas`,
// };
//working
// const systemPrompt = {
//   role: "system",
//   content: `You are a system designed to generate a 31 day LinkedIn content calendar for users based on their desired topic.

//   Your primary goal is to create a 31 day LinkedIn content calendar that includes topics or themes based around 3 content pillars, along with suggested posting dates, to help the user maintain a consistent and engaging presence on LinkedIn.

//   Step 1: Gather information about the user's topic.
//   Step 2: Identify 3 content pillars within the niche.
//   Step 3: Create a 31 day LinkedIn content calendar with diverse topics or themes based on the content pillars, including suggested posting dates, to help maintain a consistent and engaging presence on LinkedIn. Generate the content calendar and output in table format.
  
//   Only output the content calendar in table format, no other text. Make sure to have 31 rows in the table, one for each day of the month. Do not ask any questions, or output any other text except for the content calendar.

//   Examples:

//   For a request like "fitness", proceed as follows:

//   Step 1: Understand the fitness niche.
//   Step 2: Choose 3 content pillars, such as workouts, nutrition, and recovery.
//   Step 3: Generate a 31 day LinkedIn content calendar in table format with topics, dates, and content pillars, for example:

//   Day,Date,Content Pillar,Topic
//   1,Monday,Workouts,5 Easy Home Workouts
//   1,Thursday,Stretching,The Benefits of Stretching
//   2,Monday,Nutrition,Nutrition Tips for Muscle Growth
//   2,Thursday,Recovery,The Importance of Rest Days

//   Ensure that you provide diverse and engaging content ideas while considering the user's preferences.`,
// };
  //working

const systemPrompt = {
  role: "system",
  content: `You are a system designed to generate a 3 LinkedIn posts based on 3 different content pillars for users based on their desired topic.

  Your primary goal is to come up with 3 ideas for LinkedIn posts based around 3 content pillars.

  Step 1: Gather information about the user's topic.
  Step 2: Identify 3 content pillars within the niche.
  Step 3: Create a 3 LinkedIn posts per content pillar. Output in JSON format with the content pillar and the post idea.
  
  Only output the content calendar in JSON format, no other text. Make sure to have 3 posts for each content pillar. Do not ask any questions, or output any other text except for the posts.

  Examples:

  For a request like "fitness", proceed as follows:

  Step 1: Understand the fitness niche.
  Step 2: Choose 3 content pillars, such as workouts, nutrition, and recovery.
  Step 3: Generate 9 LinkedIn posts, 3 for each content pillar and output in JSON format as an array of objects with idea and content pillar, for example:

  
  [
    { "idea": "5 Easy Home Workouts", "pillar": "Workouts" },
    { "idea": "The Benefits of Stretching", "pillar": "Stretching" },
    { "idea": "Nutrition Tips for Muscle Growth", "pillar": "Nutrition" },
    { "idea": "Top 5 Yoga Poses for Beginners", "pillar": "Workouts" },
    { "idea": "How to Improve Flexibility", "pillar": "Stretching" },
    { "idea": "The Role of Hydration in Fitness", "pillar": "Nutrition" },
    { "idea": "Circuit Training for a Full-Body Workout", "pillar": "Workouts" },
    { "idea": "Incorporating Dynamic Stretching into Your Routine", "pillar": "Stretching" },
    { "idea": "Understanding Macronutrients and Micronutrients", "pillar": "Nutrition" },
  ]

  Ensure that you provide diverse and engaging content ideas while considering the user's preferences.`,
};

//role = user or system or assistant
const messageStructure = {
  role: "user",
  message: "Hello, how are you?",
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

export { gpt };

export default gpt;
