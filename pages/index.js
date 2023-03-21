import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pillars, setPillars] = useState([]);
  const [model, setModel] = useState("gpt-3.5-turbo");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

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

    let json = JSON.parse(data.messages[1].content);

    if (Object.keys(json).length === 1) {
      json = json[Object.keys(json)[0]];
    }

    setPillars(json);

    setLoading(false);
  };

  const generatePost = async (topic, postPillar) => {
    const newPillars = Object.keys(pillars).map((pillar) => {
      if (pillar === postPillar) {
        pillars[pillar].map((post) => {
          if (post.title === topic) {
            post.loading = true;
          }
          return post;
        });
      }
      return pillars[pillar];
    });

    setPillars(newPillars);

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
    setLoading(false);

    const updatedPillars = Object.keys(pillars).map((pillar) => {
      if (pillar === postPillar) {
        pillars[pillar].map((post) => {
          if (post.title === topic) {
            post.loading = false;
            post.post = data.messages[1].content;
          }
          return post;
        });
      }
      return pillars[pillar];
    });
    setPillars(updatedPillars);
  };

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
      <main className="flex flex-col items-center justify-start min-h-screen py-10 pr-4">
        <h1 className="text-6xl font-bold">Content Generator</h1>
        <p className="mt-3 text-2xl">Generate content in seconds</p>
        <form
          className="flex flex-l items-center justify-center w-1/2 mt-4 space-x-3"
          onSubmit={handleSubmit}
        >
          <select
            className="p-3 mt-4 text-xl border rounded-xl"
            onChange={handleSetModel}
          >
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo" selected>
              GPT-3.5-Turbo
            </option>
          </select>
          <input
            type="text"
            placeholder="topic"
            className="w-full p-3 mt-4 text-xl border rounded-xl"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            value={message}
            required
          />

          <button
            className="p-3 mt-4 text-xl text-white bg-blue-500 rounded-xl"
            type="submit"
          >
            Generate
          </button>
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
                        Below you will find 3 topic for {pillar.toLowerCase()}.
                        You can generate content for each topic by clicking the
                        button next to it.
                      </p>
                      <div className="flex flex-col items-start justify-center">
                        {pillars[pillar]?.map((topic, index) => (
                          <div
                            key={index}
                            className="p-3 my-3 text-xl rounded-xl whitespace-pre-wrap w-full"
                          >
                            <hr className="my-5" />
                            <div className="flex flex-row items-center justify-between w-100">
                              <div className="flex flex-col items-start justify-center">
                                <h3 className="text-xl font-bold pr-4">
                                  {topic.title}
                                </h3>
                                <p className="mt-3 text-gray-500 text-sm my-2">
                                  {/* {topic.title} */}
                                </p>
                              </div>
                              <div className="flex flex-col items-end justify-center">
                                <button
                                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                  onClick={() =>
                                    generatePost(topic.title, pillar)
                                  }
                                >
                                  Generate Post
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-col items-start justify-center">
                              {topic.loading ? (
                                <div className="flex flex-col items-center justify-center">
                                  <div className="w-12 h-12 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                                  <p className="mt-3 text-xl">Loading...</p>
                                </div>
                              ) : (
                                topic.post && (
                                  <details className="flex flex-col items-start justify-center">
                                    {topic.post}
                                    <summary className="mt-3 text-gray-500 text-sm my-2 cursor-pointer">
                                      view
                                    </summary>
                                  </details>
                                )
                              )}
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
