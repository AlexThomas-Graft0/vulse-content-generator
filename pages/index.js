import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [pillars, setPillars] = useState([]);
  const [topics, setTopics] = useState([]);
  const [scheduledContent, setScheduledContent] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [model, setModel] = useState("gpt-3.5-turbo");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setMessages([
      {
        role: "user",
        content: message,
      },
    ]);

    const res = await fetch("/api/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        model,
      }),
    });
    const data = await res.json();
    setMessage("");

    // setMessages(data.messages);
    const example = JSON.parse(data.messages[1].content);
    console.log({ example });
    // const example = [
    //   { idea: "5 Easy Home Workouts", pillar: "Workouts" },
    //   { idea: "The Benefits of Stretching", pillar: "Stretching" },
    //   {
    //     idea: "Nutrition Tips for Muscle Growth",
    //     pillar: "Nutrition",
    //   },
    //   { idea: "The Importance of Rest Days", pillar: "Recovery" },
    //   { idea: "Top 5 Yoga Poses for Beginners", pillar: "Workouts" },
    //   { idea: "How to Improve Flexibility", pillar: "Stretching" },
    //   {
    //     idea: "The Role of Hydration in Fitness",
    //     pillar: "Nutrition",
    //   },
    //   {
    //     idea: "Effective Sleep Habits for Recovery",
    //     pillar: "Recovery",
    //   },
    //   {
    //     idea: "Circuit Training for a Full-Body Workout",
    //     pillar: "Workouts",
    //   },
    //   {
    //     idea: "Incorporating Dynamic Stretching into Your Routine",
    //     pillar: "Stretching",
    //   },
    //   {
    //     idea: "Understanding Macronutrients and Micronutrients",
    //     pillar: "Nutrition",
    //   },
    //   { idea: "How to Recover from a Workout", pillar: "Recovery" },
    // ];

    // const csv = example.split("\n").map((line) => line.split(","));

    // const csvJSON = csv.map((line, lineIndex) => {
    //   if (lineIndex === 0) return;
    //   return {
    //     day: line[0],
    //     date: line[1],
    //     pillar: line[2],
    //     topic: line[3],
    //   };
    // });

    // console.log({ csv });
    // console.log({ csvJSON });

    // csvJSON.shift();

    setScheduledContent(example);

    // const dataStructure = {
    //   pillar: [ideas for pillar],
    // }

    const pillars = example.reduce((acc, idea) => {
      if (!acc[idea.pillar]) {
        acc[idea.pillar] = [];
      }
      acc[idea.pillar].push(idea.idea);
      return acc;
    }, {});

    setPillars(pillars);
    setLoading(false);
  };

  //enter idea - ask for pillars - wait for response - ask to generate topics around pillars - wait for response - generate content - ask to schedule content - wait for response - schedule content
  const generatePost = async (topic) => {
    const res = await fetch("/api/generatePost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: topic,
          },
        ],
        model,
      }),
    });
    const data = await res.json();
    console.log({ data });
    return data.messages[1].content;
  };

  //onchange of dropdown
  const handleSetModel = (e) => {
    setModel(e.target.value);
  };

  return (
    <>
      <Head>
        <title>Content Generator V1</title>
        <meta name="description" content="Generate content in seconds" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-start min-h-screen py-10">
        <h1 className="text-6xl font-bold">Content Generator</h1>
        <p className="mt-3 text-2xl">Generate content in seconds</p>
        <form
          className="flex flex-col items-center justify-center w-1/2 mt-4"
          onSubmit={handleSubmit}
        >
          <textarea
            type="text"
            placeholder="Idea"
            className="w-full p-3 mt-4 text-xl border rounded-xl"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            value={message}
            required
          />

          {/* //input */}

          {/* select dropdown to chagne model */}
          <select
            className="p-3 mt-4 text-xl border rounded-xl"
            onChange={handleSetModel}
          >
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo" selected>
              GPT-3.5-Turbo
            </option>
          </select>
          {/* select dropdown to chagne model */}

          {/* button */}
          <button
            className="p-3 mt-4 text-xl text-white bg-blue-500 rounded-xl"
            type="submit"
          >
            Generate
          </button>
          {/* button */}
        </form>
        <div className="flex flex-wrap items-center justify-around mt-6 sm:w-full">
          <div className="p-6 mt-6 text-left border rounded-xl sm:w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                <p className="mt-3 text-xl">Loading...</p>
              </div>
            ) : (
              <div className="mt-6">
                <div className="flex items-start justify-center">
                  {Object.keys(pillars).map((pillar, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-start justify-center p-3 m-3 text-xl border rounded-xl whitespace-pre-wrap w-96 shadow-md"
                    >
                      <h3 className="text-2xl font-bold">{pillar}</h3>
                      <p className="mt-3 text-gray-500 text-sm my-2">
                        Below you will find 3 idea for each pillar. You can use
                        these ideas to generate content around your pillars and
                        schedule it for your calendar.
                      </p>
                      <div className="flex flex-col items-start justify-center">
                        {pillars[pillar]?.map((idea, index) => (
                          <div
                            key={index}
                            className="p-3 my-3 text-xl rounded-xl whitespace-pre-wrap w-full"
                          >
                            <hr className="my-5" />
                            <div className="flex flex-row items-center justify-between w-100">
                              <div className="flex flex-col items-start justify-center">
                                <h3 className="text-xl font-bold">{idea}</h3>
                                <p className="mt-3 text-gray-500 text-sm my-2">
                                  {idea}
                                </p>
                              </div>
                              <div className="flex flex-col items-end justify-center">
                                <button
                                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                  onClick={() => generatePost(idea)}
                                >
                                  Generate Post
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
