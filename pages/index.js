import { deleteCookie, getCookies } from "cookies-next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import MenuButton from "../components/MenuButton";
import PostEdit from "../components/PostEdit";
import Theme from "../components/Theme";

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
  const [webSearch, setWebSearch] = useState(false); //search web for content
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
    `The subject of the post is: ${themes[0].theme}.`
  );

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

  useEffect(() => {
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
    The subject of the post is: ${themes[0].theme}.`); //set to curret post idea
  }, [tone, headline, language, posts, themes]); //if there are any changes, update the vulse prompt

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

    //TODO look into refactoring this
    let ideas = "[";

    while (!done) {
      //wait for response to finish streaming
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      ideas += chunkValue;
    }

    const sanitizedData = ideas
      .replace(/\\\"/g, '"')
      .replace(/title:/g, '"title":')
      .replace(/hashtags:/g, '"hashtags":');

    const jsonArray = eval(sanitizedData.trim());

    //add ideas to theme
    const newThemes = Object.assign([], themes);

    themes.forEach((theme, pi) => {
      if (pi === index) {
        theme.ideas = jsonArray;
        theme.loading = false;
      }
    });

    setThemes(newThemes);
  };

  const generatePost = async (topic, postPillar) => {
    const newThemes = Object.assign([], themes);

    themes.forEach((theme, pi) => {
      if (theme.theme === postPillar) {
        theme.ideas.forEach((idea, ideaIndex) => {
          if (idea.title === topic) {
            idea.loading = true;
          }
        });
      }
    });

    setThemes(newThemes);

    //old prompt
    let learningPrompt = `Analyse the following LinkedIn posts to adopt the writing style and use this style to generate a compelling LinkedIn post. Ensure that you provide diverse and engaging content ideas while considering the user's preferences. Every post must end with 3 relevant popular hastags and follow the writing style of the following posts:
    ${posts.map((post, postIndex) => {
      return `Post ${postIndex + 1}: ${post.content}`;
    })}

    Analyse these posts and adapt the writing style and Write a post on the following topic: `;

    const learningMessage = {
      role: "system",
      content: vulsePrompt,
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
        vulsePrompt,
        webSearch,
      }),
    });
    const data = await res.json();
    let selectedPost;

    themes.forEach((theme) => {
      if (theme.theme === postPillar) {
        theme.ideas.forEach((post) => {
          if (post.title === topic) {
            selectedPost = post;
          }
        });
      }
    });

    // const reader = data.getReader();
    // const decoder = new TextDecoder();

    // let done = false;
    // let generatedPost = "";

    // while (!done) {
    //   const { value, done: doneReading } = await reader.read();
    //   done = doneReading;
    //   const chunkValue = decoder.decode(value);
    //   console.log({ chunkValue });
    //   generatedPost += chunkValue;
    // }

    selectedPost.loading = false;
    selectedPost.post = data.message;

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

  function handleSetWebSearch(e) {
    if (e.target.checked) {
      setWebSearch(true);
    } else {
      setWebSearch(false);
    }
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

      <MenuButton />
      <div className="grid grid-cols-12 gap-4 h-full min-h-screen p-5">
        <div className="p-5 sm:ml64 col-span-12 lg:col-span-12">
          <div className="flex justify-between items-center mb-4">
            <div className="w-full">
              <h1 className="text-3xl font-bold text-gray-400 dark:text-slate-800">
                Themes
              </h1>
              <span className="text-gray-600">
                Please enter themes below to generate content
              </span>
            </div>
            <div className="flex items-start justify-center space-x-3">
              <div className="flex flex-col items-start justify-center space-y-3">
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
                    <div className="w-11 h-6 bg-vulsePurple rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:bor2er-gray-600 peer-checked:bg-vulsePurple"></div>
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
              <div className="flex flex-col items-start justify-center space-y-3">
                <h3 className="text-sm text-gray-400 dark:text-gray-500 font-semibold">
                  Web Browsing
                </h3>

                <div className="flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      webSearch ? "text-gray-400" : "text-vulsePurple"
                    }`}
                  >
                    Off
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer mx-2">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      onChange={handleSetWebSearch}
                      checked={webSearch}
                    />
                    <div className="w-11 h-6 bg-gray-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border dark:border-gray-300 peer-checked:bg-vulsePurple"></div>
                  </label>
                  <span
                    className={`text-sm font-medium ${
                      webSearch ? "text-vulsePurple" : "text-gray-400"
                    }`}
                  >
                    On
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 border-b py-3">
            {themes.length > 0 &&
              themes?.map((theme, index) => (
                <Theme
                  theme={theme}
                  index={index}
                  themes={themes}
                  setThemes={setThemes}
                  generatePost={generatePost}
                  generatePostIdeas={generatePostIdeas}
                  setPost={setPost}
                />
              ))}
          </div>
          {/* if user has selected a post to edit */}
          {post && <PostEdit post={post} setPost={setPost} />}
        </div>
      </div>
    </>
  );
}
