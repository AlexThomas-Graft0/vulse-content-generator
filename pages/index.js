import { deleteCookie, getCookies } from "cookies-next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import languages from "../consts/languages";
import tones from "../consts/tones";
import { LINKEDIN_URL } from "../helpers/auth";

export default function Home() {
  //main object to store all data
  const [themes, setThemes] = useState([
    {
      theme: "theme 1",
      loading: false,
    },
    {
      theme: "theme 2",
      loading: false,
    },
    {
      theme: "theme 3",
      loading: false,
    },
  ]);

  //editable in sidebar
  const [session, setSession] = useState(null); //user session from linkedin
  const [sidebarOpen, setSidebarOpen] = useState(false); //show sidebar
  const [model, setModel] = useState("gpt-4"); //model to use for gpt - speed(gpt-3.5-turbo)/quality(gpt-4)
  const [profiles, setProfiles] = useState({
    new: [{ content: "" }],
  }); //profiles fetched from linkedin - awaiting partner scope permissions 'r_member_social'
  const [profile, setProfile] = useState("new");
  const blankProfile = [{ content: "" }];
  const [posts, setPosts] = useState(blankProfile); //posts fetched from linkedin - awaiting partner scope permissions 'r_member_social'
  const [post, setPost] = useState(""); //selected generated post to edit in textarea
  const [tone, setTone] = useState("professional"); //tone to select from
  const [language, setLanguage] = useState("English"); //language to select from
  const [headline, setHeadline] = useState("Professional"); //user headline from linkedin
  const [sector, setSector] = useState("Web development"); //sector to select from - awaiting partner scope permissions 'r_member_social'
  const [bio, setBio] = useState("I am a digital handyman"); //user bio from linkedin - awaiting partner scope permissions 'r_member_social'

  //identity that takes headline from user profile
  const [promptIdentity, setPromptIdentity] = useState(
    `You are a ${headline} writing posts for your company profile on the social media platform: LinkedIn`
  );
  //set as state var to allow for user rule editing in future
  const [promptRules, setPromptRules] =
    useState(`The post MUST follow these rules:
  - The post should have a short opening sentence not more than 350 characters.
  - The opening sentence must be followed by a line break.
  - The post should be no more than 3000 characters.
  - Separate each sentence with a line break.
  - The post should be written in the third person.
  - The post should be written in the present tense.
  - There should be no more than 3 hashtags, these should be relevant to the post copy.
  - Hashtags should be at the end of the post`);
  const [promptTone, setPromptTone] = useState(`Posts should be ${tone}.`);
  const [promptLanguage, setPromptLanguage] = useState(
    `The language should be ${language}.`
  );
  const [promptHeadline, setPromptHeadline] = useState(
    `The users LinkedIn headline is: ${headline}.`
  );
  const [promptExample, setPromptExample] =
    useState(`An example of a previous post by the user is:
  -------
  ${
    posts
      ? posts
          ?.map((post, postIndex) => `Post ${postIndex}: ${post.content}`)
          .join("\n")
      : ""
  }
  -------`);
  const [promptStyle, setPromptStyle] = useState(
    `The style of the new post should be similar to the example.`
  );
  const [promptSubject, setPromptSubject] = useState(
    `The subject of the post is: ${Object.keys(themes)[0]}.`
  );

  const joinedPrompt = `${promptIdentity}
${promptRules}
${promptTone}
${promptLanguage}
${promptHeadline}
${promptExample}
${promptStyle}
${promptSubject}`;
  console.log({ joinedPrompt });

  const [vulsePrompt, setVulsePrompt] = useState(``);

  const handleChangeTone = (e) => {
    setTone(e.target.value);
  };

  const handleChangeLanguage = (e) => {
    setLanguage(e.target.value);
  };

  const handleChangeHeadline = (e) => {
    setHeadline(e.target.value);
  };

  const handleChangePrompt = (e) => {
    setVulsePrompt(e.target.value);
  };

  useEffect(() => {
    console.log("here");
    console.log({ headline, tone, language });
    // The users LinkedIn profile description is: {description}. <-- stripped out because we can't get bio
    // The user works in the {sector} industry. <-- stripped out because we can't get job history
    setVulsePrompt(`You are a ${headline} writing posts for your personal profile on the social media platform: LinkedIn
    The post MUST follow these rules:
    - The post should have a short opening sentence not more than 350 characters.
    - The opening sentence must be followed by a line break.
    - The post should be no more than 3000 characters.
    - Separate each sentence with a line break.
    - The post should be written in the third person.
    - The post should be written in the present tense.
    - There should be no more than 3 hashtags, these should be relevant to the post copy.
    - Hashtags should be at the end of the post
    Posts should be ${tone}.
    The language should be ${language}.

    The users LinkedIn headline is: ${headline}.

    An example of a previous post by the user is:
    -------
    ${posts ? posts?.map((post) => post.content).join("\n") : ""}
    -------

    The style of the new post should be similar to the example.
    The subject of the post is: ${Object.keys(themes)[0]}.`);
  }, [tone, headline, language, posts]); //if there are any changes, update the vulse prompt

  useEffect(() => {
    const cookies = getCookies();

    const getPosts = async () => {
      const postUrl = `/api/getOrgPosts?access_token=${cookies.access_token}`;
      const response = await fetch(postUrl, {
        method: "GET",
      });
      const posts = await response.json();
      const personalProfile = posts;

      const newProfiles = {
        ...profiles,
        personal: personalProfile,
      };
      console.log({ newProfiles });

      setProfiles(newProfiles);
      setProfile("personal");
      setPosts(posts);
    };

    if (cookies.access_token) {
      getPosts();
    }

    if (cookies.userData) {
      setSession(JSON.parse(decodeURIComponent(cookies.userData)));
      setHeadline(
        JSON.parse(decodeURIComponent(cookies.userData)).localizedHeadline
      );
    }
  }, []);

  //function that generates the main 3 ideas for a topic
  const generatePostIdeas = async (topic, index) => {
    const loadingThemes = [...themes]; //create copy of themes
    loadingThemes[index].loading = true; //set loading to true for theme to render loading spinner
    setThemes(loadingThemes); //update state

    const userMessage = {
      //structure of a message to be consumed by GPT
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

    const data = res.body; //res.body as a readable stream
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    //TODO look into fixing this v
    let ideas = "[";

    while (!done) {
      //wait for response to finish streaming
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
    console.log({ sanitizedData });

    const jsonArray = eval(sanitizedData.trim());
    console.log(jsonArray);

    //add ideas to theme
    const newThemes = Object.assign([], themes);

    themes.forEach((theme, pi) => {
      if (pi === index) {
        theme.ideas = jsonArray;
      }
    });

    newThemes[index].loading = false;
    setThemes(newThemes);

    console.log({ themes });
  };

  const generatePost = async (topic, postPillar) => {
    const newVulsePrompt = `You are a ${headline} writing posts for your personal profile on the social media platform: LinkedIn
    The post MUST follow these rules:
    - The post should have a short opening sentence not more than 350 characters.
    - The opening sentence must be followed by a line break.
    - The post should be no more than 3000 characters.
    - Separate each sentence with a line break.
    - The post should be written in the first person.
    - The post should be written in the present tense.
    - There should be no more than 3 hashtags, these should be relevant to the post copy.
    - Hashtags should be at the end of the post
    Posts should be ${tone}.
    The language should be ${language}.
    
    The users LinkedIn headline is: ${headline}.
    
    An example of a previous post by the user is:
    ------- 
    ${posts ? posts?.map((post) => post.content).join("\n") : ""}
    -------
  
    The style of the new post should be similar to the example.
    The subject of the post is: ${topic}.`;

    console.log({ newVulsePrompt });

    const newThemes = Object.assign([], themes);

    themes.forEach((theme, pi) => {
      // console.log(theme);
      // console.log(postPillar);
      if (theme.theme === postPillar) {
        console.log("found theme");
        theme.ideas.forEach((idea, ideaIndex) => {
          if (idea.title === topic) {
            console.log("found idea");
            idea.loading = true;
          }
        });
      }
    });

    setThemes(newThemes);

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
      content: `${topic}`,
    };

    const res = await fetch("/api/generatePost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          learningMessage,
          {
            role: "user",
            content: fullMessage.content,
          },
        ],
        model,
      }),
    });
    const data = await res.body;
    let selectedPost;

    themes.forEach((theme) => {
      if (theme.theme === postPillar) {
        console.log(theme, postPillar);
        theme.ideas.forEach((post) => {
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

    setThemes(themes);
  };

  const handleChangeProfile = (e) => {
    2;
    setProfile(e.target.value);
    setPosts(profiles[e.target.value]);
  };

  const handleNewPost = (e) => {
    e.preventDefault();
    setPosts([...posts, { content: "" }]);
  };

  const handlePostChange = (e, index) => {
    const newPosts = [...posts];
    newPosts[index].content = e.target.value;
    setPosts(newPosts);
  };

  const handleDeletePost = (index) => {
    if (posts[index].content.length === 0) {
      const newPosts = [...posts];
      newPosts.splice(index, 1);
      setPosts(newPosts);
    } else {
      if (confirm("Are you sure you want to delete this post?")) {
        const newPosts = [...posts];
        newPosts.splice(index, 1);
        setPosts(newPosts);
      }
    }
  };

  async function signOut() {
    setSession(null);
    deleteCookie("session");
    deleteCookie("access_token");
    deleteCookie("userData");
  }

  function handleSetModel(e) {
    if (e.target.checked) {
      setModel("gpt-4");
    } else {
      setModel("gpt-3.5-turbo");
    }
  }

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
        className="z-20 inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={() => setSidebarOpen(!sidebarOpen)}
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
        <div className="p-5 sm:ml64 col-span-12 lg:col-span-10">
          <div className="">
            <div className="grid grid-cols-2 2xl:grid-cols-3 gap-4 mb-">
              <div className="flex items-center justify-between space-x-5 rounded">
                <h1 className="text-3xl font-bold text-gray-400 dark:text-slate-800">
                  Themes
                </h1>
              </div>
            </div>
            <span className="text-gray-600">
              Please enter themes below to generate content
            </span>
            <div className="grid grid-cold-1 lg:grid-cols-3 gap-4 mb-4 border-b py-3">
              {themes.length > 0 &&
                themes?.map((theme, index) => (
                  <div
                    className={`flex flex-col items-start justify-start ${
                      index != 2 && "border-r"
                    } pr-3`}
                    key={index}
                  >
                    <label
                      htmlFor="input-group-1"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your Email
                    </label>
                    <div className="flex w-full">
                      <div className="relative w-full">
                        <input
                          type="text"
                          className="p-2.5 w-full z-20 text-sm rounded-lg border border-gray-300"
                          placeholder={`Theme ${index + 1}`}
                          onChange={(e) => {
                            setThemes(
                              themes.map((item, i) =>
                                i === index
                                  ? { ...item, theme: e.target.value }
                                  : item
                              )
                            );
                          }}
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-vulsePurple rounded-r-lg border border-vulsePurple hover:bg-violet-800 focus:ring- focus:outline-none focus:ring-violet-300 dark:bg-vulsePurple dark:hover:bg-vulsePurple dark:focus:ring-vulsePurple"
                          onClick={async () => {
                            await generatePostIdeas(theme.theme, index);
                          }}
                        >
                          {theme.loading ? (
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              ></path>
                            </svg>
                          ) : (
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
                          )}
                        </button>
                      </div>
                    </div>

                    {/* goes here */}
                    <div className="flex flex-col items-start justify-center rounded space-y-4 py-2 px-1 text-sm">
                      {theme.ideas?.map((topic, index) => (
                        <div className="flex flex-col items-center justify-between space-x-2 py-2 px-1 text-sm w-full border-b2">
                          <div
                            className="flex items-center justify-between rounded space-x-2 py-2 px-1 text-sm w-full"
                            key={index}
                          >
                            <h3 className="text-sm font-semibold text-gray-800">
                              {topic.title}{" "}
                            </h3>
                            <button
                              className={`ml-1 p-1 text-white bg-vulsePurple rounded-full ${
                                topic.loading && "animate-spin"
                              }`}
                              onClick={() =>
                                generatePost(topic.title, theme.theme)
                              }
                            >
                              {topic.post || topic.loading ? (
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
                                <summary className="flex items-center justify-start font-semibold space-x-2 py-2 px-1 text-sm border- cursor-pointer">
                                  {topic.post.length > 60
                                    ? topic.post.slice(0, 60) + "..."
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
                                    className="flex space-x-1 px-2 py-1 text-white bg-vulsePurple rounded-full self-end"
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
            {/* if user has selected a post to edit */}
            {post && (
              <div className="grid grid-cols-6 gap-4 mb-4 col-span-3">
                <div className="flex flex-col items-start justify-center col-span-6 space-y-3">
                  <textarea
                    className="w-full p-2 text-xs border rounded shadow-md min-h-[200px] max-h-[500px] focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent"
                    value={post.post}
                    onChange={(e) => setPost(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={` top-0 left-0 lg:flex flex-col items-start justify-start w-full h-full p-2 space-y-4 select-none bg-gray-100 pt-7 col-span-12 transition-all duration-300 ease-in-out ${
            sidebarOpen ? "absolute" : "hidden lg:flex lg:col-span-2"
          }`}
        >
          <div
            className={`flex items-center justify-end w-full h-10 space-x-2 rounded ${
              !sidebarOpen && "hidden"
            }`}
          >
            <span
              className="flex items-center justify-center w-6 h-6 rounded-full cursor-pointer hover:bg-gray-300"
              onClick={() => setSidebarOpen(!sidebarOpen)}
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
            </span>
          </div>
          {session ? (
            <button
              className="flex w-full justify-start items-center space-x-2 text font-semibold text-gray-400 dark:text-vulsePurple"
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
                  className="w-5 h-5 transition duration-75 text-vulsePurple group-hover:text-gray-500"
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
              className="flex items-center space-x-1 text font-semibold text-gray-400 dark:text-slate-500 border-2 bg-slate-100 rounded-full px-2 py-1 hover:bg-slate-200 hover:text-slate-300"
              href={LINKEDIN_URL} //dynamically load different env var whether pesronal or company LinkedIn
            >
              <span className="text-gray-400 dark:text-slate-500">
                Connect LinkedIn
              </span>
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
          <div className="flex flex-col items-start justify-center space-y-3 w-full">
            <h3 className="text-sm text-gray-400 dark:text-gray-500 font-semibold">
              Priority
            </h3>

            <div className="flex items-center">
              <span
                className={`text-sm font-medium ${
                  model === "gpt-3.5-turbo"
                    ? "text-vulsePurple"
                    : "text-gray-400"
                }`}
              >
                Speed
              </span>
              <label className="relative inline-flex items-center cursor-pointer mx-2">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  onChange={handleSetModel}
                  checked={model === "gpt-4"}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:bor2er-gray-600 peer-checked:bg-vulsePurple"></div>
              </label>
              <span
                className={`text-sm font-medium ${
                  model === "gpt-4" ? "text-vulsePurple" : "text-gray-400"
                }`}
              >
                Quality
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-2 justify-center w-full">
            <div className="flex flex-col items-start justify-center space-y-3 w-full mt-5">
              <h3 className="text-sm text-gray-400 dark:text-gray-500 font-semibold">
                Profiles
              </h3>
              <select
                className="w-full p-3 mt- text-xs border rounded-lg"
                onChange={handleChangeProfile}
                value={profile}
              >
                {Object.keys(profiles).map((profileOption, index) => (
                  <option key={index} value={profileOption}>
                    {profileOption}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-start space-x-2 self-start">
            <button
              className="px-3 py-1 text-white bg-violet-500 rounded flex items-center"
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
          {posts?.length > 0 && (
            <div className="flex flex-col items-start justify-center space-y-3 w-full">
              <div className="flex flex-col items-center p-1 justify-start space-y-5 w-full shadow bg-gray-50 border-gray-300 rounded-lg">
                {posts.map((post, index) => (
                  <div
                    className="flex flex-col items-start justify-start space-y- w-full"
                    key={index}
                  >
                    <div className="self-end relative">
                      <button
                        className="z-20 absolute -top-2 -right-2 p-1 bg-red-300 rounded-full shadow text-white hover:bg-red-500"
                        onClick={() => handleDeletePost(index)}
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <textarea
                      key={index}
                      className="w-full p-1 mt- text-xs border rounded-lg h-[75px] focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent focus:h-[200px] resize-none transform transition-all duration-600 ease-in-out"
                      value={post.content}
                      onChange={(e) => handlePostChange(e, index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col items-start justify-center space-y-3 w-full pb-10">
            <h3 className="text-sm text-gray-400 dark:text-gray-500 font-semibold mt-5">
              Modify Prompt
            </h3>
            <div className="flex flex-col items-start justify-center space-y-3 w-full">
              <label className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                Tone
              </label>
              <select
                className="w-full p-3 mt- text-xs border rounded-lg"
                onChange={handleChangeTone}
                value={tone}
              >
                {tones.map((toneOption, index) => (
                  <option key={index} value={toneOption}>
                    {toneOption}
                  </option>
                ))}
              </select>

              <label className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                Language
              </label>
              <select
                className="w-full p-3 mt- text-xs border rounded-lg"
                onChange={handleChangeLanguage}
                value={language}
              >
                {languages.map((languageOption, index) => (
                  <option key={index} value={languageOption}>
                    {languageOption}
                  </option>
                ))}
              </select>

              <label className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                Headline
              </label>
              <input
                className="w-full p-3 mt- text-xs border rounded-lg"
                value={headline}
                onChange={handleChangeHeadline}
              />

              <label className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                Prompt
              </label>
              <textarea
                className="w-full p-3 mt- text-xs border rounded-lg h-[500px] focus:outline-none focus:ring-2 focus:ring-vulsePurple focus:border-transparent focus:h-[300px] resize-none transform transition-all duration-600 ease-in-out"
                value={vulsePrompt}
                onChange={handleChangePrompt}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
