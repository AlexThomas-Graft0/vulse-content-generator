import { deleteCookie, getCookies } from "cookies-next";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import LinkedInAuth from "../components/LinkedInAuth";
import { LINKEDIN_URL } from "../helpers/auth";

//needs to take in linkedin posts from the user
// -- test by feeding them in
// -- then allow login and pull from linkedin

const trainingData = [
  {
    prompt: "What is fitness?",
    completion: "Fitness is the state of being physically fit and healthy.",
  },
  {
    prompt: "What is fitness?",
    completion: "It is the ability to perform physical activity.",
  },
  {
    prompt: "What is fitness?",
    completion: "Fitness is the ability to perform physical activity.",
  },
  {
    prompt: "What is fitness?",
    completion: "Fitness is the ability to perform physical activity.",
  },
];

const examplePillars = {
  pillar1: [
    { title: "title 1", hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"] },
    { title: "title 2", hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"] },
    { title: "title 3", hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"] },
  ],
  pillar2: [
    { title: "title 1", hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"] },
    { title: "title 2", hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"] },
    { title: "title 3", hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"] },
  ],
  pillar3: [
    { title: "title 1", hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"] },
    { title: "title 2", hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"] },
    { title: "title 3", hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"] },
  ],
};

const dummyResponse = [
  {
    role: "user",
    content: "freelancing",
  },
  {
    role: "assistant",
    content:
      '{\n  "Content Pillars": {\n    "Building a Freelance Business": [\n      {\n        "title": "5 Tips for Building a Strong Freelance Business",\n        "hashtags": ["#freelancing", "#entrepreneurship", "#business"]\n      },\n      {\n        "title": "The Importance of Networking for Freelancers",\n        "hashtags": ["#networking", "#freelancing", "#entrepreneurship"]\n      },\n      {\n        "title": "How to Set Rates as a Freelancer",\n        "hashtags": ["#freelancing", "#pricing", "#entrepreneurship"]\n      }\n    ],\n    "Marketing Yourself as a Freelancer": [\n      {\n        "title": "Creating a Killer Freelance Portfolio",\n        "hashtags": ["#freelancing", "#portfolio", "#marketing"]\n      },\n      {\n        "title": "The Power of Personal Branding for Freelancers",\n        "hashtags": ["#personalbranding", "#freelancing", "#marketing"]\n      },\n      {\n        "title": "Using Social Media to Promote Your Freelance Business",\n        "hashtags": ["#socialmedia", "#marketing", "#freelancing"]\n      }\n    ],\n    "Managing Your Freelance Workload": [\n      {\n        "title": "Time Management Tips for Freelancers",\n        "hashtags": ["#timemanagement", "#freelancing", "#productivity"]\n      },\n      {\n        "title": "Staying Motivated as a Freelancer",\n        "hashtags": ["#motivation", "#freelancing", "#productivity"]\n      },\n      {\n        "title": "Dealing with Burnout as a Freelancer",\n        "hashtags": ["#burnout", "#freelancing", "#selfcare"]\n      }\n    ]\n  }\n}',
  },
];

export default function Home() {
  const [session, setSession] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pillars, setPillars] = useState([
    {
      pillar: "pillar 1",
    },
    {
      pillar: "pillar 2",
    },
    {
      pillar: "pillar 3",
    },
  ]);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [post, setPost] = useState("");

  const [generatedBios, setGeneratedBios] = useState("");

  const [personalPosts, setPersonalPosts] = useState([]);

  useEffect(() => {
    const cookies = getCookies();
    console.log({ cookies });

    const getPosts = async () => {
      const postUrl = `/api/getOrgPosts?access_token=${cookies.access_token}`;
      const response = await fetch(postUrl, {
        method: "GET",
      });
      const posts = await response.json();
      const personalPersonality = posts;

      //add personalPersonality to personalites with setPersonalities
      const newPersonalities = {
        ...personalities,
        personal: personalPersonality,
      };
      console.log({ newPersonalities });
      setPersonalities(newPersonalities);

      setPersonalPosts(posts);
    };

    if (cookies.access_token) {
      getPosts();
    }

    if (cookies.userData) {
      setSession(JSON.parse(decodeURIComponent(cookies.userData)));
    }
  }, []);

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
    const data = res.body;

    setMessage("");

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let generatedBios = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      generatedBios += chunkValue;
    }

    console.log({ generatedBios });

    // Wrap the string in curly braces
    const wrappedGeneratedBios = "{" + generatedBios + "}";

    // Parse the wrapped string as JSON
    let json = JSON.parse(wrappedGeneratedBios.slice(0, -1));
    console.log({ json });

    if (Object.keys(json).length === 1) {
      json = json[Object.keys(json)[0]];
    }

    if (json["Content Pillars"]) {
      delete json["Content Pillars"];
    }

    console.log({ json });

    setPillars(json);
    console.log({ pillars });
    setLoading(false);
  };

  const generatePostIdeas = async (topic, index) => {
    const userMessage = {
      role: "user",
      content: topic,
    };

    const res = await fetch("/api/generateIdeas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [userMessage],
        model,
      }),
    });
    const data = res.body;
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let ideas = "[";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      ideas += chunkValue;
    }

    console.log({ ideas });
    const sanitizedData = ideas
      .replace(/\\\"/g, '"')
      .replace(/title:/g, '"title":')
      .replace(/hashtags:/g, '"hashtags":');
    const jsonArray = eval(sanitizedData.trim());
    console.log(jsonArray);

    //add ideas to pillar
    const newPillars = Object.assign([], pillars);

    pillars.forEach((pillar, pi) => {
      if (pi === index) {
        pillar.ideas = jsonArray;
      }
    });

    setPillars(newPillars);

    console.log({ pillars });
  };

  const generatePost = async (topic, postPillar) => {
    const newPillars = Object.assign([], pillars);

    pillars.forEach((pillar, pi) => {
      console.log(pillar);
      console.log(postPillar);
      if (pillar.pillar === postPillar) {
        console.log("found pillar");
        pillar.ideas.forEach((idea, ideaIndex) => {
          if (idea.title === topic) {
            console.log("found idea");
            idea.loading = true;
          }
        });

        //   newPillars[pillar.pillar] = pillars[pillar].ideas.map((post) => {
        //     if (post.title === topic) {
        //       post.loading = true;
        //     }
        //     return post;
        //   });
      }
    });

    setPillars(newPillars);

    let learningPrompt = `Analyse the following LinkedIn posts to adopt the writing style and use this style to generate a compelling LinkedIn post. Ensure that you provide diverse and engaging content ideas while considering the user's preferences. Every post must end with 3 relevant popular hastags and follow the writing style of the following posts:
    ${posts.map((post, postIndex) => {
      return `Post ${postIndex + 1}: ${post.content}`;
    })}

    Analyse these posts and adapt the writing style and Write a post on the following topic: `;

    const learningMessage = {
      role: "system",
      content: learningPrompt,
    };

    const fullMessage = {
      role: "user",
      content: `${learningPrompt} ${topic}`,
    };

    const res = await fetch("/api/generatePost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: fullMessage.content,
          },
        ],
        model,
      }),
    });
    const data = await res.body;
    // const data = await res.json();

    let selectedPost;

    pillars.forEach((pillar) => {
      if (pillar.pillar === postPillar) {
        console.log("290");
        console.log(pillar, postPillar);
        console.log("290");
        pillar.ideas.forEach((post) => {
          if (post.title === topic) {
            selectedPost = post;
          }
        });
      }
    });

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let generatedPost = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      generatedPost += chunkValue;
      selectedPost.loading = false;
      selectedPost.post = generatedPost;
    }

    setPillars(pillars);
    setLoading(false);
  };

  const handleSetModel = (e) => {
    setModel(e.target.value);
  };

  const [isWeek, setIsWeek] = useState(true);
  const [isTrending, setIsTrending] = useState(true);

  const handleToggle = () => {
    setIsWeek(!isWeek);
  };

  const handleTrending = () => {
    setIsTrending(!isTrending);
  };

  const [personality, setPersonality] = useState("linkedIn");
  const [personalities, setPersonalities] = useState({
    oldEnglish: [
      {
        content:
          "Ah, 'tis a delightful mornin', the sun's rays beamin' through yonder window. A gentle breeze caressin' the bloomin' flora, 'tis a sight fit for the eyes of poets and dreamers alike. The world be full of wonder, and each day bringeth new blessings to those who seeketh them.",
      },
      {
        content:
          "Pray, heed the call of the wild, the whispers of the ancient trees, for they have much wisdom to share. In their boughs, they cradle the secrets of time immemorial, only to be revealed to those with a heart open to their counsel. Nature's embrace, a balm for our weary souls.",
      },
      {
        content:
          "Forsooth, life be a grand tapestry, woven with threads of joy and sorrow, love and loss, triumph and defeat. Each stitch, an experience that shapes our character, a testament to the beauty of our collective journey. The human condition, a symphony of raw emotion, playin' to the rhythm of fate.",
      },
      {
        content:
          "In this garden of life, let us sow seeds of kindness and compassion, waterin' them with the dew of understanding. As our hearts intertwine, we'll create a haven where love blossoms and the spirit soars, a sanctuary where we may find solace in the embrace of our brethren.",
      },
    ],
    newEnglish: [
      {
        content:
          "Oh em gee, you guys! This morning was, like, totally #blessed! The sun was out, and it was seriously giving me all the good vibes. I couldn't help but snap a pic for the 'gram. Honestly, life is just so perf sometimes, am I right?",
      },
      {
        content:
          "And OMG, have you ever stopped to, like, listen to the trees? No joke, it's like they're whispering all their ancient secrets to us. I know it sounds cray-cray, but it's actually super deep if you think about it. Nature is literally the best therapist, no cap.",
      },
      {
        content:
          "So, like, life is basically this huge, crazy tapestry, right? We've got our highs and lows, our wins and losses, but it all comes together in this beautiful, messy masterpiece. It's like one big, emotional roller coaster, and we're all just along for the ride.",
      },
      {
        content:
          "But seriously, guys, let's try to spread some love and positivity out there, okay? It's all about lifting each other up and making the world a better place. We can totally do it if we stick together and keep those good vibes going. #SpreadLove #GoodVibesOnly",
      },
    ],
    linkedIn: [
      {
        content: `Rise and Grind: Seize the Day! 🌅
      Nature's Wisdom: Unlocking Success 🌳
      
      Today, I was inspired by the stunning sunrise, reminding us all of the endless possibilities each new day brings. 🌞 As we embark on our daily tasks, let's not forget to pause and appreciate the lessons nature can teach us. Ancient trees, for example, hold a wealth of wisdom and offer a sense of perspective that can be invaluable in both our personal and professional lives. 🌲
      
      In this fast-paced world, it's essential to remember that life is a tapestry of successes and setbacks, and embracing these experiences helps us grow and develop as individuals. 💼 Let's foster a culture of empathy, compassion, and collaboration in our workplaces to create an environment that nurtures growth, innovation, and success. 💡
      
      What are some ways you maintain a work-life balance while pursuing your professional goals? Share your thoughts in the comments! 👇
      
      #CarpeDiem #GrowthMindset #Collaboration`,
      },
      {
        content: `Fuel Your Day: Morning Motivation ☕
        Productivity Boosters: Share Yours! 💪
        
        Starting the day with a positive mindset can make all the difference in our productivity levels. 🌟 Whether it's a strong cup of coffee or a motivating podcast, we all have our go-to morning rituals. Embracing these routines can set the stage for a successful day ahead. ⏰
        
        Let's also consider the power of collaboration and teamwork in our professional lives. By pooling our skills and resources, we can achieve greater heights and overcome challenges more effectively. 🚀
        
        What's your favorite morning ritual to jumpstart your day? Share your tips and tricks in the comments below! 🌅
        
        #MorningRoutines #Productivity #Teamwork`,
      },
      {
        content: `Building Connections: Networking Tips 🤝
      Maximize Your Opportunities 🌐
      
      In today's interconnected world, networking is key to unlocking new professional opportunities. Building meaningful connections can lead to exciting collaborations, career advancements, and personal growth. 🌱
      
      When it comes to networking, remember that it's not just about collecting contacts - it's about nurturing relationships and offering value to others. 💼
      
      How do you approach networking, and what strategies have you found most effective? Let's discuss and learn from each other in the comments! ✍️
      
      #NetworkingTips #CareerGrowth #BuildingRelationships`,
      },
      {
        content: `Time Management: Mastering the Clock ⌛
      Efficiency Hacks: Let's Swap Ideas! ⚡
      
      In the race against time, effective time management is a crucial skill to develop. By mastering the art of prioritization and organization, we can optimize our productivity and make the most of every day. 📅
      
      Whether it's setting deadlines, using productivity apps, or minimizing distractions, there are countless strategies to maximize efficiency. ⏳
      
      What are your go-to time management techniques? Share your insights in the comments, and let's help each other become more efficient! 💼
      
      #TimeManagement #ProductivityHacks #WorkSmarter`,
      },
    ],
  });

  const handleChangePersonality = (e) => {
    setPersonality(e.target.value);
    setPosts(personalities[e.target.value]);
  };

  const [posts, setPosts] = useState(personalities.linkedIn);

  const handleNewPost = (e) => {
    e.preventDefault();
    setPosts([...posts, { content: "" }]);
  };

  const handlePostChange = (e, index) => {
    // console.log({ e, index });
    // console.log(e.target.value);
    const newPosts = [...posts];
    newPosts[index].content = e.target.value;
    setPosts(newPosts);
  };

  const handleDeletePost = (index) => {
    const newPosts = [...posts];
    newPosts.splice(index, 1);
    setPosts(newPosts);
  };

  async function signOut() {
    setSession(null);
    deleteCookie("session");
    deleteCookie("access_token");
    deleteCookie("userData");
  }

  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const image3Ref = useRef(null);

  return (
    <>
      <Head>
        <title>Content Generator V1</title>
        <meta name="description" content="Generate content in seconds" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      <div className="grid grid-cols-12 gap-4 h-full min-h-screen">
        <div className="p-5 sm:ml64 col-span-10">
          <div className="">
            <div className="grid grid-cols-2 2xl:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center justify-between space-x-5 rounded">
                <h1 className="text-3xl font-bold text-gray-400 dark:text-slate-800">
                  Themes
                </h1>
              </div>
              <div className="flex items-center justify-end space-x-2 h-24 rounded">
                {/* <LinkedInAuth /> */}
                {/* <PersonalConnect /> */}
              </div>
              <div className="flex items-center justify-end space-x-2 h-24 rounded">
                {session ? (
                  <button
                    className="flex items-center space-x-2 text font-semibold text-gray-400 dark:text-violet-500"
                    onClick={() => signOut()}
                  >
                    <span>
                      {session.localizedFirstName} {session.localizedLastName}
                    </span>
                    <div
                      className={`p-2 w-10 h-10 text-white bg-gray-200 border-2 rounded-full group ${
                        session
                          ? "bg-violet-100 border-violet-500"
                          : "bg-gray-200 border-gray-200"
                      }`}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="w-5 h-5 transition duration-75 text-violet-400 group-hover:text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                  </button>
                ) : (
                  <a
                    className="flex items-center space-x-2 text font-semibold text-gray-400 dark:text-slate-500"
                    href={LINKEDIN_URL}
                  >
                    Sign in
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-gray-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start justify-center w-full h-full p- space-y-2 ">
              <h3 className="text-2xl font-semibold text-gray-400 dark:text-gray-500 text-center">
                Generate New Themes
              </h3>
              <form
                className="flex flex-l items-center justify-start w-full space-x-3"
                onSubmit={handleSubmit}
              >
                <label className="text-gray-400 dark:text-gray-500">
                  Priority
                </label>
                <select
                  className="p-3 text-x border rounded-xl"
                  onChange={handleSetModel}
                >
                  <option value="gpt-4" defaultValue>
                    Quality
                  </option>
                  <option value="gpt-3.5-turbo">Speed</option>
                </select>
                {/* <input
                  type="text"
                  placeholder="topic"
                  className="w-100 p-3 text-x border rounded-xl"
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  value={message}
                  required
                />

                <button
                  className="px-3 py-1 text-x text-white bg-violet-500 rounded-full"
                  type="submit"
                >
                  {loading ? "Loading..." : "Generate"}
                </button> */}
              </form>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4 border-b py-3">
              {pillars.length > 0 &&
                pillars?.map((pillar, index) => (
                  <div
                    className={`flex flex-col items-start justify-start  ${
                      index != 2 && "border-r"
                    } pr-3`}
                    key={index}
                  >
                    <label
                      for="input-group-1"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your Email
                    </label>
                    <div class="flex w-full">
                      <div class="relative w-full">
                        <input
                          type="text"
                          className="p-2.5 w-full z-20 text-sm rounded-lg border border-gray-300"
                          placeholder={`Topic ${index + 1}`}
                          onChange={(e) => {
                            setPillars(
                              pillars.map((item, i) =>
                                i === index
                                  ? { ...item, pillar: e.target.value }
                                  : item
                              )
                            );
                          }}
                        />
                        <button
                          type="button"
                          class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-violet-700 rounded-r-lg border border-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800"
                          onClick={() => {
                            generatePostIdeas(pillar.pillar, index);
                          }}
                        >
                          <svg
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            className="w-5 h-5 transition duration-75 text-white"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* goes here */}
                    <div className="flex flex-col items-start justify-center rounded space-y-4 py-2 px-1 text-sm">
                      {pillar.ideas?.map((topic, index) => (
                        <div className="flex flex-col items-center justify-between space-x-2 py-2 px-1 text-sm w-full border-b2">
                          <div
                            className="flex items-center justify-between rounded space-x-2 py-2 px-1 text-sm w-full"
                            key={index}
                          >
                            <h3 className="text-sm font-semibold text-gray-800">
                              {topic.title}{" "}
                            </h3>
                            <button
                              className="ml-1 p-1 text-white bg-violet-300 rounded-full"
                              onClick={() =>
                                generatePost(topic.title, pillar.pillar)
                              }
                            >
                              {topic.post ? (
                                <svg
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  className="w-5 h-5"
                                >
                                  <path
                                    clipRule="evenodd"
                                    fillRule="evenodd"
                                    d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
                                  />
                                </svg>
                              ) : (
                                "Generate"
                              )}
                            </button>
                          </div>
                          {topic.post && (
                            <div className="text-2l text-gray-400 dark:text-gray-500 fomt-semibold w-full">
                              <details className="flex flex-col items-start justify-start space-y-2 w-full">
                                <summary className="flex items-center justify-center space-x-2 py-2 px-1 text-sm border- cursor-pointer">
                                  {topic.post.length > 50
                                    ? topic.post.slice(0, 50) + "..."
                                    : topic.post}
                                  <svg
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                  </svg>
                                </summary>
                                <div className="flex flex-col items-start justify-start space-y-2 w-full">
                                  <div className="space-x-2 py-2 px-1 text-sm border-b whitespace-pre-wrap min-h-20 max-h-40 overflow-y-auto">
                                    {topic.post}
                                  </div>
                                  <button
                                    className="flex space-x-1 px-2 py-1 text-white bg-violet-300 rounded-full self-end"
                                    onClick={() => setPost(topic)}
                                  >
                                    <span>Edit </span>
                                    <svg
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                      aria-hidden="true"
                                      className="w-5 h-5"
                                    >
                                      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                                      <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                                    </svg>
                                  </button>
                                </div>
                              </details>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* goes here */}

                    <p className="text-2xl text-gray-400 dark:text-gray-500"></p>
                  </div>
                ))}
            </div>
            {post && (
              <div className="grid grid-cols-6 gap-4 mb-4 col-span-3">
                <div className="flex flex-col items-start justify-center col-span-3 space-y-3">
                  <textarea
                    className="w-full p-2 text-xs border rounded shadow-md min-h-[100px] max-h-[300px] focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent"
                    value={post.post}
                    onChange={(e) => setPost(e.target.value)}
                  />
                  {/* <div className="flex flex-row items-center justify-between">
                    {[0, 1, 2].map((i, ni) => (
                      <div
                        className="flex flex-col items-center justify-center p-2 my-3 mr-3 text-xl shadow-md w-[100px] h-[100px] bg-g0 border-2 border-gray-300 border-dashed rounded whitespace-pre-wrap"
                        key={ni}
                      >
                        <input
                          type="file"
                          className="hidden"
                          ref={
                            i === 0
                              ? image1Ref
                              : i === 1
                              ? image2Ref
                              : i === 2
                              ? image3Ref
                              : null
                          }
                        />
                        <div
                          className="bg-gray-100 w-full h-full flex justify-center items-center rounded cursor-pointer"
                          onClick={() => {
                            if (i === 0) image1Ref.current.click();
                            if (i === 1) image2Ref.current.click();
                            if (i === 2) image3Ref.current.click();
                          }}
                        >
                          <svg
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            className="w-12 h-12 text-gray-300"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                  <input
                    className="w-full p-2 text-xs border rounded shadow-md"
                    placeholder="First post comment"
                  />
                  <div className="flex flex-row items-center justify-between w-full">
                    <button className="py-1 px-5 rounded-full bg-gray-200 text-gray-600">
                      Save as draft
                    </button>
                    <button className="py-1 px-5 rounded-full bg-violet-600 text-gray-50">
                      Post
                    </button>
                    <button className="py-1 px-5 rounded-full border-2 border-violet-600 text-gray-600">
                      Schedule
                    </button>
                  </div> */}
                </div>
              </div>
            )}
          </div>
        </div>

        {/*  */}
        <div className="flex flex-col items-center justify-start w-full h-full p-2 space-y-4 select-none bg-gray-100 pt-7 col-span-2">
          <div className="flex flex-col items-start justify-center space-y-3 w-full">
            <div className="flex items-center justify-center space-x-2">
              <button
                className="px-3 py-1 text-white bg-violet-500 rounded-full flex items-center"
                onClick={handleNewPost}
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
                <span className="text-xs">New Post</span>
              </button>
            </div>
          </div>

          {/*  */}

          <div className="flex flex-col items-center space-y-2 justify-center w-full">
            <div className="flex flex-col items-start justify-center space-y-3 w-full">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Personality
              </p>
              <select
                className="w-full p-3 mt- text-xs border rounded-lg"
                onChange={handleChangePersonality}
                value={personality}
              >
                {Object.keys(personalities).map((personalityOption, index) => (
                  <option key={index} value={personalityOption}>
                    {personalityOption}
                  </option>
                ))}
              </select>
            </div>
            {/* <button className="px-3 py-1 text-white bg-violet-500 rounded-full flex items-center">
              Connect LinkedIn
            </button> */}
          </div>

          {posts?.length > 0 && (
            <div className="flex flex-col items-start justify-center space-y-3 w-full">
              <div className="flex flex-col items-center p-1 justify-start space-y-5 overflow-y-scroll w-full shadow bg-gray-50 border-gray-300 rounded-lg">
                {posts.map((post, index) => (
                  <div
                    className="flex flex-col items-start justify-start space-y-3 w-full"
                    key={index}
                  >
                    <textarea
                      key={index}
                      className="w-full p-1 mt- text-xs border rounded-lg h-[100px] focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent focus:h-[300px] resize-none transform transition-all duration-600 ease-in-out"
                      value={post.content}
                      onChange={(e) => handlePostChange(e, index)}
                    />
                    <button
                      className="px-3 py-1 text-white bg-red-500 rounded-full flex items-center self-end"
                      onClick={() => handleDeletePost(index)}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="text-xs ">Delete Post</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/*  */}
      </div>
    </>
  );
}
