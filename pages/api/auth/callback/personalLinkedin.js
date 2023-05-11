import { getURLWithQueryParams } from "../../../../helpers/personalAuth";

const personalLinkedin = async (req, res) => {
  const LINKEDIN_URL = getURLWithQueryParams(
    "https://www.linkedin.com/oauth/v2/accessToken",
    {
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: process.env.PERSONAL_LINKEDIN_REDIRECT,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    }
  );
  let tok;
  let resp = await fetch(LINKEDIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (resp.ok) tok = await resp.json();

  let access_token = "";
  let expires_in = 5184000;

  if (tok) {
    access_token = tok.access_token;
    expires_in = tok.expires_in;
  }

  console.log("access_tokennn", access_token);

  const meDataUrl = "https://api.linkedin.com/v2/me";
  const meDataResponse = await fetch(meDataUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });
  const userData = await meDataResponse.json();
  console.log({ userData });
  const vanityName = userData.vanityName;

  

  // const url = `https://fresh-linkedin-profile-data.p.rapidapi.com/get-profile-posts?linkedin_url=https%3A%2F%2Fwww.linkedin.com%2Fin%2F${vanityName}%2F1`;
  // const options = {
  //   method: "GET",
  //   headers: {
  //     "X-RapidAPI-Key": "45846aa565mshc6b0830f56f2d81p13888cjsn796c02cc1797",
  //     "X-RapidAPI-Host": "fresh-linkedin-profile-data.p.rapidapi.com",
  //   },
  // };

  // try {
  //   const response = await fetch(url, options);
  //   const result = await response.json();
  //   console.log(result.count);
  // } catch (error) {
  //   console.error(error);
  // }

  //

  //redirect to home page
  res.setHeader(
    "Set-Cookie",
    `access_token=${access_token}; expires=${new Date(
      Date.now() + expires_in * 1000
    ).toUTCString()}; path=/; HttpOnly`
  );
  res.redirect("https://vulse-content-generator.vercel.app");

  //   // Set cookie
  res.setHeader(
    "Set-Cookie",
    `access_token=${access_token}; expires=${new Date(
      Date.now() + expires_in * 1000
    ).toUTCString()}; path=/; HttpOnly`
  );
  // console.log({ access_token });
  // const userInfoUrl = "https://api.linkedin.com/v2/me";
  // const response = await fetch(userInfoUrl, {
  //   method: "GET",
  //   headers: { Authorization: "Bearer " + access_token },
  // });
  // const userInfo = await response.json();

  // console.log(userInfo);
  // res.json(userInfo);

  //   // Redirect to home page
  //   res.redirect("http://localhost:3000");
};

export default personalLinkedin;

const personalPosts = {
  Message: "ok",
  data: [
    {
      num_appreciations: 1,
      num_comments: 35,
      num_empathy: 12,
      num_interests: 7,
      num_likes: 140,
      num_praises: 2,
      num_reposts: 2,
      text: "I run 3 SaaS products and a fast-growing YouTube channel.\nThis is a real screenshot of my busy entrepreneur calendar 👇 \n\nYep! It's empty 😁\n\nI have a packed todo-list - but I always make sure to keep my calendar as empty as possible.\n\nThis is probably the most high-impact productivity tip I can give you.\n\nManaging time is horrible!\nIt's a puzzle you need to solve. It's time-consuming in itself, and it steals a load of cognitive capacity from your budget.\n\nAnd it prevents you from being agile and flexible.\n\nThe good thing is, the cure is pretty simple:\nStart saying no to things that need to happen at a specific time or place.\n\nMeetings? Nope. Write an email.\nShould we jump on a call? Absolutely not. Write an email.\nDeadlines? Often enough, you don't really need them.\nTime-critical tasks? Try to avoid them.\n\nExecute your tasks and communicate in an async manner.\nIt's totally possible to arrange. I built my team around this core principle.\n\nAnd now your calendar is free for important things.\nFamily time. Going out. Catching up with old friends. Participating in fun events. Joining an occasional podcast, etc 😊",
      time: "1w",
      urn: "7056189942577737729",
    },
    {
      num_appreciations: 125,
      num_comments: 1040,
      num_empathy: 877,
      num_interests: 3834,
      num_likes: 37184,
      num_praises: 210,
      num_reposts: 4795,
      text: 'Data is so beautiful\n\nThis mesmerizing data visualization called "climate spiral" was made by climate scientist Ed Hawkins from the National Centre for Atmospheric Science, at the University of Reading\n\nCredit: NASA via S. Nouri\n#innovation #datascience #visualization #analytics',
      time: "1w",
      urn: "7056189469946748930",
    },
    {
      num_appreciations: 1,
      num_comments: 9,
      num_interests: 5,
      num_likes: 103,
      num_praises: 3,
      num_reposts: 2,
      text: '3 questions I ask myself every time I do something twice:\n\n→ Can I automate it?\nIf I can have Zapier or Axiom do it, no need to do it manually again.\n\n→ Can I delegate it?\nIf I can turn this task into a well-documented process, I can hire someone else to do it next time.\n\n→ Can I turn something from this into a "building block"?\nIt could be an npm package, a spreadsheet template, a piece of stock video, etc. Any reusable asset that might speed up the process next time.\n\nDo this for a year, and you\'ll become exponentially more productive ⚡ ',
      time: "1w",
      urn: "7056189260160221187",
    },
    {
      num_appreciations: 9,
      num_comments: 90,
      num_empathy: 42,
      num_interests: 8,
      num_likes: 902,
      num_praises: 61,
      num_reposts: 8,
      text: "I've built a small startup team of freelancers.\n\n→ We work remotely and async\n→ 95% of communication is written\n→ We never have meetings\n\nWe collaborate and work towards a shared goal - and mind our own business at the same time.\n\nYes, both can be true 👌\nAnd it's an excellent way of working together.",
      time: "1w",
      urn: "7055271947911225344",
    },
    {
      num_appreciations: 1,
      num_comments: 15,
      num_empathy: 15,
      num_interests: 30,
      num_likes: 294,
      num_praises: 10,
      num_reposts: 0,
      text: "Stop, stooop 🤯\nI can't handle so many insane updates all at once!",
      time: "1mo",
      urn: "7042509152933306368",
    },
    {
      num_appreciations: 1,
      num_comments: 15,
      num_empathy: 15,
      num_interests: 30,
      num_likes: 294,
      num_praises: 10,
      num_reposts: 0,
      text: "Stop, stooop 🤯\nI can't handle so many insane updates all at once!",
      time: "1mo",
      urn: "7042509196612751360",
    },
    {
      num_appreciations: 19,
      num_comments: 104,
      num_empathy: 266,
      num_interests: 304,
      num_likes: 5662,
      num_praises: 85,
      num_reposts: 354,
      text: "GPT-4 is about to launch 🚀\nAnd we're going to see something groundbreaking!\n\nAccording to early announcements, GPT-4 is going to be multimodal, which means both prompts and outputs can be:\n\n→ Text\n→ Images\n→ Videos\n→ Audio\n\nInstead of simply text → text as we know now.\n\nThis opens an exponential number of new capabilities!\n\nAnd new opportunities to build AI SaaS or enhance your current products using AI.",
      time: "1mo",
      urn: "7041482264756551680",
    },
    {
      num_appreciations: 19,
      num_comments: 104,
      num_empathy: 266,
      num_interests: 304,
      num_likes: 5662,
      num_praises: 85,
      num_reposts: 354,
      text: "GPT-4 is about to launch 🚀\nAnd we're going to see something groundbreaking!\n\nAccording to early announcements, GPT-4 is going to be multimodal, which means both prompts and outputs can be:\n\n→ Text\n→ Images\n→ Videos\n→ Audio\n\nInstead of simply text → text as we know now.\n\nThis opens an exponential number of new capabilities!\n\nAnd new opportunities to build AI SaaS or enhance your current products using AI.",
      time: "1mo",
      urn: "7041482291457478657",
    },
    {
      acticle_subtitle: "freelancerxcommunity.com • 1 min read",
      acticle_title: "Member Case Study: $0 to $2,000 /month",
      num_comments: 5,
      num_interests: 1,
      num_likes: 16,
      num_praises: 3,
      num_reposts: 0,
      text: "Congrats to Andy Walker from the Freelancer X Community who went from $0 to $2,000+ /month in a few months.\n\nI cover how he did it (and tips on how you can too) in this article 👇\n\nhttps://lnkd.in/encYVQzh\n",
      time: "1mo",
      urn: "7040779881852370944",
    },
    {
      num_appreciations: 2,
      num_comments: 2,
      num_empathy: 3,
      num_interests: 1,
      num_likes: 46,
      num_reposts: 1,
      text: "It doesn't matter if you're social media growth is focused on Twitter, TikTok, Instagram or Twitch.\n\nIt's important to be intentional about your content and branding.\n\nYou need to create value, and you need to do that by being honest and upfront with your audience.\n\nFocus on building a community that trusts and respects you, and the financial rewards will follow.\n\n",
      time: "2mo",
      urn: "7038801060651528192",
    },
    {
      num_appreciations: 7,
      num_comments: 15,
      num_empathy: 37,
      num_interests: 2,
      num_likes: 115,
      num_reposts: 1,
      text: 'Earlier today, my 9-year-old son said the following. \n \n"Dad, when you die, I\'m going to say that I had a good life with you." \n \nIt made me realize something. \n \nI will never have a goal that is more important than having my children say this about me.',
      time: "2mo",
      urn: "7036274137845104640",
    },
    {
      num_appreciations: 7,
      num_comments: 15,
      num_empathy: 37,
      num_interests: 2,
      num_likes: 115,
      num_reposts: 1,
      text: 'Earlier today, my 9-year-old son said the following. \n \n"Dad, when you die, I\'m going to say that I had a good life with you." \n \nIt made me realize something. \n \nI will never have a goal that is more important than having my children say this about me.',
      time: "2mo",
      urn: "7036273709157871616",
    },
    {
      num_comments: 0,
      num_likes: 13,
      num_reposts: 1,
      text: "Designers: Upgrade your skills with our #EditorX101 course. It's free! #webdesign #responsivedesign #createdoneditorx\n\nw/ Editor X\n\nhttps://lnkd.in/gfY5x5i9",
      time: "2mo",
      urn: "7036273666615083008",
    },
    {
      num_appreciations: 4,
      num_comments: 13,
      num_empathy: 11,
      num_interests: 2,
      num_likes: 103,
      num_praises: 8,
      num_reposts: 0,
      text: "I do 😊 I have a 2-month-old boy.\nAnd he is exactly as demanding and dependent on me as you would expect.\n\nInstead of coming up with excuses, how about spending that energy crushing it instead 💪",
      time: "2mo",
      urn: "7036273639402434562",
    },
    {
      num_appreciations: 4,
      num_comments: 13,
      num_empathy: 11,
      num_interests: 2,
      num_likes: 103,
      num_praises: 8,
      num_reposts: 0,
      text: "I do 😊 I have a 2-month-old boy.\nAnd he is exactly as demanding and dependent on me as you would expect.\n\nInstead of coming up with excuses, how about spending that energy crushing it instead 💪",
      time: "2mo",
      urn: "7036273217358954496",
    },
    {
      num_comments: 2,
      num_likes: 23,
      num_praises: 8,
      num_reposts: 0,
      text: "Some exciting news, my country borders guessing game - Bordle  - hit 100,000 views this morning!\n\nIf you haven't had the chance to play it yet, you can find it here ⬇️\nbordle.app\n\n🎈 Happy Friday! 🎈",
      time: "2mo",
      urn: "7032281473785188352",
    },
    {
      num_comments: 4,
      num_empathy: 2,
      num_interests: 1,
      num_likes: 10,
      num_reposts: 0,
      text: "Excited to share my latest venture into the world of AI web design! With the help of Midjourney, I've been diving into everything from full-page designs to generating individual assets. It's been a fascinating journey so far and I'm constantly amazed at the advancements in AI technology.\n\nWeb design has always been a passion of mine, but with the integration of AI, it has opened up a whole new world of possibilities. I've spent countless hours tinkering and experimenting with different tools, and I must say, the results are getting better with each iteration.\n\nAI is transforming industries across the board, but it's especially thrilling to see its impact on the field of web design. From automating repetitive tasks to generating creative and unique designs, AI is revolutionizing the way we approach web design.\n\nI would love to hear your thoughts on this exciting new development. What do you think about AI in web design? Let me know in the comments below! #AITransformation #WebDesign #Midjourney.",
      time: "2mo",
      urn: "7031920736743120896",
    },
    {
      acticle_subtitle: "editorx.com • 1 min read",
      acticle_title: "The ultimate guide to AI web design",
      num_comments: 2,
      num_empathy: 1,
      num_interests: 1,
      num_likes: 20,
      num_reposts: 1,
      text: "OpenAI’s #ChatGPT set the internet ablaze with conversations about the possibility of AI web design tools.\n\nWhat are the pros and cons of this emerging tech? \nHow can you integrate AI tools like Midjourney into your web design process?\n\n Nick Babich created a step-by-step guide with all the answers >>\n\n#webdesign #editorx #shapingdesign #ai #aidesign  ",
      time: "2mo",
      urn: "7031036598813122560",
    },
    {
      acticle_subtitle: "editorx.com • 1 min read",
      acticle_title: "The ultimate guide to AI web design",
      num_comments: 2,
      num_empathy: 1,
      num_interests: 1,
      num_likes: 20,
      num_reposts: 1,
      text: "OpenAI’s #ChatGPT set the internet ablaze with conversations about the possibility of AI web design tools.\n\nWhat are the pros and cons of this emerging tech? \nHow can you integrate AI tools like Midjourney into your web design process?\n\n Nick Babich created a step-by-step guide with all the answers >>\n\n#webdesign #editorx #shapingdesign #ai #aidesign  ",
      time: "2mo",
      urn: "7031036208902230016",
    },
    {
      acticle_subtitle: "paddle.com • 1 min read",
      acticle_title: "Selling SaaS Globally.",
      num_appreciations: 3,
      num_comments: 2,
      num_interests: 5,
      num_likes: 189,
      num_praises: 4,
      num_reposts: 3,
      text: "Wanna go global? You’ve got to think local.\n \nThat principle counts for every single department of your business, including:\n\nFinance, legal and operations ✅\nPeople and talent ✅\nProduct and support ✅\nSales and marketing ✅\n\nGet the lowdown for each team’s requirements 👇",
      time: "4mo",
      urn: "7030545805610483712",
    },
    {
      num_comments: 0,
      num_likes: 3,
      num_reposts: 0,
      text: "Some more fun experiments with Midjourney.\nOne of the biggest improvements I've noticed in designs after learning more about prompt engineering is the level of customization that is possible. With Midjourney, You can generate some great designs, and then add weights to parts of your promotps and use seed to specify which design to use as a base reference. This has made it very easy to keep the designs consistent and make minor tweaks to achieve the results you're looking for\n\nOne of the coolest things is that every site is completely bespoke and unique. AI is completely changing the game when it comes to creativity and innovation in web design.\n\nIt's an exciting time to be in this field, and I can't wait to see what the rest of this year holds! #WebDesign #AI #Midjourney",
      time: "2mo",
      urn: "7030514753185701888",
    },
    {
      num_appreciations: 1,
      num_comments: 15,
      num_empathy: 4,
      num_interests: 1,
      num_likes: 69,
      num_praises: 4,
      num_reposts: 0,
      text: "I'm one of the most undisciplined people I know.\nA true quitter.\n\nI'm also one of the most productive people I know.\n\nHow?\nI use joy and excitement to gamify my life!\n\n🔥 Intrinsic motivation is high-octane fuel.\n😓 Discipline is a muscle that fatigues easily.",
      time: "3mo",
      urn: "7030120869880320000",
    },
    {
      num_comments: 22,
      num_empathy: 7,
      num_interests: 1,
      num_likes: 135,
      num_praises: 3,
      num_reposts: 3,
      text: "Finally, ChatGPT Plus rolled out in Switzerland 🔥\n\nCan't wait to start using ChatGPT faster, and with fewer interruptions!\n\n→ No Code\n→ GitHub Copilot\n→ ChatGPT\n\nThe biggest assets of a tech solopreneur in 2023!",
      time: "2mo",
      urn: "7030111949350690816",
    },
    {
      num_comments: 22,
      num_empathy: 7,
      num_interests: 1,
      num_likes: 135,
      num_praises: 3,
      num_reposts: 3,
      text: "Finally, ChatGPT Plus rolled out in Switzerland 🔥\n\nCan't wait to start using ChatGPT faster, and with fewer interruptions!\n\n→ No Code\n→ GitHub Copilot\n→ ChatGPT\n\nThe biggest assets of a tech solopreneur in 2023!",
      time: "2mo",
      urn: "7030111964412411905",
    },
    {
      num_comments: 4,
      num_empathy: 2,
      num_interests: 1,
      num_likes: 10,
      num_reposts: 0,
      text: "Excited to share my latest venture into the world of AI web design! With the help of Midjourney, I've been diving into everything from full-page designs to generating individual assets. It's been a fascinating journey so far and I'm constantly amazed at the advancements in AI technology.\n\nWeb design has always been a passion of mine, but with the integration of AI, it has opened up a whole new world of possibilities. I've spent countless hours tinkering and experimenting with different tools, and I must say, the results are getting better with each iteration.\n\nAI is transforming industries across the board, but it's especially thrilling to see its impact on the field of web design. From automating repetitive tasks to generating creative and unique designs, AI is revolutionizing the way we approach web design.\n\nI would love to hear your thoughts on this exciting new development. What do you think about AI in web design? Let me know in the comments below! #AITransformation #WebDesign #Midjourney.",
      time: "2mo",
      urn: "7029774761337450499",
    },
    {
      num_comments: 4,
      num_empathy: 2,
      num_interests: 1,
      num_likes: 10,
      num_reposts: 0,
      text: "Excited to share my latest venture into the world of AI web design! With the help of Midjourney, I've been diving into everything from full-page designs to generating individual assets. It's been a fascinating journey so far and I'm constantly amazed at the advancements in AI technology.\n\nWeb design has always been a passion of mine, but with the integration of AI, it has opened up a whole new world of possibilities. I've spent countless hours tinkering and experimenting with different tools, and I must say, the results are getting better with each iteration.\n\nAI is transforming industries across the board, but it's especially thrilling to see its impact on the field of web design. From automating repetitive tasks to generating creative and unique designs, AI is revolutionizing the way we approach web design.\n\nI would love to hear your thoughts on this exciting new development. What do you think about AI in web design? Let me know in the comments below! #AITransformation #WebDesign #Midjourney.",
      time: "2mo",
      urn: "7029774704638849024",
    },
    {
      num_comments: 4,
      num_empathy: 2,
      num_interests: 1,
      num_likes: 10,
      num_reposts: 0,
      text: "Excited to share my latest venture into the world of AI web design! With the help of Midjourney, I've been diving into everything from full-page designs to generating individual assets. It's been a fascinating journey so far and I'm constantly amazed at the advancements in AI technology.\n\nWeb design has always been a passion of mine, but with the integration of AI, it has opened up a whole new world of possibilities. I've spent countless hours tinkering and experimenting with different tools, and I must say, the results are getting better with each iteration.\n\nAI is transforming industries across the board, but it's especially thrilling to see its impact on the field of web design. From automating repetitive tasks to generating creative and unique designs, AI is revolutionizing the way we approach web design.\n\nI would love to hear your thoughts on this exciting new development. What do you think about AI in web design? Let me know in the comments below! #AITransformation #WebDesign #Midjourney.",
      time: "2mo",
      urn: "7029765985641332737",
    },
    {
      num_comments: 4,
      num_empathy: 2,
      num_interests: 1,
      num_likes: 10,
      num_reposts: 0,
      text: "Excited to share my latest venture into the world of AI web design! With the help of Midjourney, I've been diving into everything from full-page designs to generating individual assets. It's been a fascinating journey so far and I'm constantly amazed at the advancements in AI technology.\n\nWeb design has always been a passion of mine, but with the integration of AI, it has opened up a whole new world of possibilities. I've spent countless hours tinkering and experimenting with different tools, and I must say, the results are getting better with each iteration.\n\nAI is transforming industries across the board, but it's especially thrilling to see its impact on the field of web design. From automating repetitive tasks to generating creative and unique designs, AI is revolutionizing the way we approach web design.\n\nI would love to hear your thoughts on this exciting new development. What do you think about AI in web design? Let me know in the comments below! #AITransformation #WebDesign #Midjourney.",
      time: "2mo",
      urn: "7029765328179994624",
    },
    {
      num_comments: 1,
      num_empathy: 1,
      num_interests: 1,
      num_likes: 26,
      num_praises: 1,
      num_reposts: 0,
      text: "We're now +22K tech entrepreneurs on the list.\n\nJoin us! And learn about:\n\n💸 SaaS & Tech startups\n🚀 Cool indie tools I discovered\n💡 A quick business idea\n\nLightweight, easy-read, small nuggets - directly to your inbox every other week.\n\nhttps://simonl.ink/TVoOA",
      time: "2mo",
      urn: "7029126408106835968",
    },
    {
      num_comments: 0,
      num_empathy: 3,
      num_likes: 14,
      num_reposts: 0,
      text: "Felt so good to get a few hours in this afternoon working on my personal site - which is (hopefully) going live early next week!",
      time: "3mo",
      urn: "7029123286445772800",
    },
    {
      num_comments: 1,
      num_likes: 4,
      num_reposts: 0,
      text: "Thoroughly enjoyed this, and I really agree with what matt says\n\nI think too much time is taken up in meetings, not just standups\n\nThe world needs to be more flexible and async. \n\nFollowing a schedule instead of being proactive is only adding pretend value ",
      time: "3mo",
      urn: "7027592898107842560",
    },
    {
      num_comments: 1,
      num_likes: 4,
      num_reposts: 0,
      text: "Thoroughly enjoyed this, and I really agree with what matt says\n\nI think too much time is taken up in meetings, not just standups\n\nThe world needs to be more flexible and async. \n\nFollowing a schedule instead of being proactive is only adding pretend value ",
      time: "3mo",
      urn: "7027585951715467264",
    },
    {
      num_appreciations: 6,
      num_comments: 262,
      num_empathy: 16,
      num_interests: 105,
      num_likes: 1061,
      num_praises: 58,
      num_reposts: 44,
      text: "£72,540.\n\nThat's the approximate annual cost of your daily standup.\n\nAssuming 6 developers on £75,000pa, you'll be lucky to get change from £100,000 to hire each developer after you've paid employers NI, pension contributions, and other benefits. Broken down to a day rate, that comes out at about £430 a day, or £54 an hour.\n\nWith a 23 minute unproductive context switch either side of a 15 minute standup meeting, you're going to be spending £54 per developer, per day (or £12,420 per developer per ~230-day working year) for that ritual.\n\nThis isn't about the cost of communication, which is wholly justified. Three quarters of that cost relate entirely to an avoidable and undesirable context switch.\n\nYour competitors are busy turning standup into a daily Slack message which a developer can drop in the 5 minutes before lunch, a time when they'll be naturally context switching anyway. \n\nAutomattic and Zapier have been doing it for years.\n\nEdit: Wow, 20k impressions. Thanks to everyone who agreed with me, and everyone who didn't. The best thing for our industry is open and honest discussions about how we handle remote-first.\n\nEdit 2: 80k impressions, this is officially my most viewed post. I'm looking for outside IR-35 contract work. Fully remote, polyglot on tech but most comfortable with NodeJS, Elixir, Clojure, PHP.\n\nZapier article on making stand up async: https://lnkd.in/ervhtPeu\n\n#change #engineering #softwaredevelopment #agile #asynchronouswork ",
      time: "3mo",
      urn: "7027585040830078976",
    },
    {
      num_appreciations: 6,
      num_comments: 262,
      num_empathy: 16,
      num_interests: 105,
      num_likes: 1061,
      num_praises: 58,
      num_reposts: 44,
      text: "£72,540.\n\nThat's the approximate annual cost of your daily standup.\n\nAssuming 6 developers on £75,000pa, you'll be lucky to get change from £100,000 to hire each developer after you've paid employers NI, pension contributions, and other benefits. Broken down to a day rate, that comes out at about £430 a day, or £54 an hour.\n\nWith a 23 minute unproductive context switch either side of a 15 minute standup meeting, you're going to be spending £54 per developer, per day (or £12,420 per developer per ~230-day working year) for that ritual.\n\nThis isn't about the cost of communication, which is wholly justified. Three quarters of that cost relate entirely to an avoidable and undesirable context switch.\n\nYour competitors are busy turning standup into a daily Slack message which a developer can drop in the 5 minutes before lunch, a time when they'll be naturally context switching anyway. \n\nAutomattic and Zapier have been doing it for years.\n\nEdit: Wow, 20k impressions. Thanks to everyone who agreed with me, and everyone who didn't. The best thing for our industry is open and honest discussions about how we handle remote-first.\n\nEdit 2: 80k impressions, this is officially my most viewed post. I'm looking for outside IR-35 contract work. Fully remote, polyglot on tech but most comfortable with NodeJS, Elixir, Clojure, PHP.\n\nZapier article on making stand up async: https://lnkd.in/ervhtPeu\n\n#change #engineering #softwaredevelopment #agile #asynchronouswork ",
      time: "3mo",
      urn: "7027584876136558592",
    },
    {
      num_appreciations: 6,
      num_comments: 262,
      num_empathy: 16,
      num_interests: 105,
      num_likes: 1061,
      num_praises: 58,
      num_reposts: 44,
      text: "£72,540.\n\nThat's the approximate annual cost of your daily standup.\n\nAssuming 6 developers on £75,000pa, you'll be lucky to get change from £100,000 to hire each developer after you've paid employers NI, pension contributions, and other benefits. Broken down to a day rate, that comes out at about £430 a day, or £54 an hour.\n\nWith a 23 minute unproductive context switch either side of a 15 minute standup meeting, you're going to be spending £54 per developer, per day (or £12,420 per developer per ~230-day working year) for that ritual.\n\nThis isn't about the cost of communication, which is wholly justified. Three quarters of that cost relate entirely to an avoidable and undesirable context switch.\n\nYour competitors are busy turning standup into a daily Slack message which a developer can drop in the 5 minutes before lunch, a time when they'll be naturally context switching anyway. \n\nAutomattic and Zapier have been doing it for years.\n\nEdit: Wow, 20k impressions. Thanks to everyone who agreed with me, and everyone who didn't. The best thing for our industry is open and honest discussions about how we handle remote-first.\n\nEdit 2: 80k impressions, this is officially my most viewed post. I'm looking for outside IR-35 contract work. Fully remote, polyglot on tech but most comfortable with NodeJS, Elixir, Clojure, PHP.\n\nZapier article on making stand up async: https://lnkd.in/ervhtPeu\n\n#change #engineering #softwaredevelopment #agile #asynchronouswork ",
      time: "3mo",
      urn: "7027584835451813888",
    },
    {
      num_appreciations: 6,
      num_comments: 262,
      num_empathy: 16,
      num_interests: 105,
      num_likes: 1061,
      num_praises: 58,
      num_reposts: 44,
      text: "£72,540.\n\nThat's the approximate annual cost of your daily standup.\n\nAssuming 6 developers on £75,000pa, you'll be lucky to get change from £100,000 to hire each developer after you've paid employers NI, pension contributions, and other benefits. Broken down to a day rate, that comes out at about £430 a day, or £54 an hour.\n\nWith a 23 minute unproductive context switch either side of a 15 minute standup meeting, you're going to be spending £54 per developer, per day (or £12,420 per developer per ~230-day working year) for that ritual.\n\nThis isn't about the cost of communication, which is wholly justified. Three quarters of that cost relate entirely to an avoidable and undesirable context switch.\n\nYour competitors are busy turning standup into a daily Slack message which a developer can drop in the 5 minutes before lunch, a time when they'll be naturally context switching anyway. \n\nAutomattic and Zapier have been doing it for years.\n\nEdit: Wow, 20k impressions. Thanks to everyone who agreed with me, and everyone who didn't. The best thing for our industry is open and honest discussions about how we handle remote-first.\n\nEdit 2: 80k impressions, this is officially my most viewed post. I'm looking for outside IR-35 contract work. Fully remote, polyglot on tech but most comfortable with NodeJS, Elixir, Clojure, PHP.\n\nZapier article on making stand up async: https://lnkd.in/ervhtPeu\n\n#change #engineering #softwaredevelopment #agile #asynchronouswork ",
      time: "3mo",
      urn: "7027584724348891137",
    },
    {
      num_appreciations: 6,
      num_comments: 262,
      num_empathy: 16,
      num_interests: 105,
      num_likes: 1061,
      num_praises: 58,
      num_reposts: 44,
      text: "£72,540.\n\nThat's the approximate annual cost of your daily standup.\n\nAssuming 6 developers on £75,000pa, you'll be lucky to get change from £100,000 to hire each developer after you've paid employers NI, pension contributions, and other benefits. Broken down to a day rate, that comes out at about £430 a day, or £54 an hour.\n\nWith a 23 minute unproductive context switch either side of a 15 minute standup meeting, you're going to be spending £54 per developer, per day (or £12,420 per developer per ~230-day working year) for that ritual.\n\nThis isn't about the cost of communication, which is wholly justified. Three quarters of that cost relate entirely to an avoidable and undesirable context switch.\n\nYour competitors are busy turning standup into a daily Slack message which a developer can drop in the 5 minutes before lunch, a time when they'll be naturally context switching anyway. \n\nAutomattic and Zapier have been doing it for years.\n\nEdit: Wow, 20k impressions. Thanks to everyone who agreed with me, and everyone who didn't. The best thing for our industry is open and honest discussions about how we handle remote-first.\n\nEdit 2: 80k impressions, this is officially my most viewed post. I'm looking for outside IR-35 contract work. Fully remote, polyglot on tech but most comfortable with NodeJS, Elixir, Clojure, PHP.\n\nZapier article on making stand up async: https://lnkd.in/ervhtPeu\n\n#change #engineering #softwaredevelopment #agile #asynchronouswork ",
      time: "3mo",
      urn: "7027584607319420928",
    },
    {
      num_appreciations: 6,
      num_comments: 262,
      num_empathy: 16,
      num_interests: 105,
      num_likes: 1061,
      num_praises: 58,
      num_reposts: 44,
      text: "£72,540.\n\nThat's the approximate annual cost of your daily standup.\n\nAssuming 6 developers on £75,000pa, you'll be lucky to get change from £100,000 to hire each developer after you've paid employers NI, pension contributions, and other benefits. Broken down to a day rate, that comes out at about £430 a day, or £54 an hour.\n\nWith a 23 minute unproductive context switch either side of a 15 minute standup meeting, you're going to be spending £54 per developer, per day (or £12,420 per developer per ~230-day working year) for that ritual.\n\nThis isn't about the cost of communication, which is wholly justified. Three quarters of that cost relate entirely to an avoidable and undesirable context switch.\n\nYour competitors are busy turning standup into a daily Slack message which a developer can drop in the 5 minutes before lunch, a time when they'll be naturally context switching anyway. \n\nAutomattic and Zapier have been doing it for years.\n\nEdit: Wow, 20k impressions. Thanks to everyone who agreed with me, and everyone who didn't. The best thing for our industry is open and honest discussions about how we handle remote-first.\n\nEdit 2: 80k impressions, this is officially my most viewed post. I'm looking for outside IR-35 contract work. Fully remote, polyglot on tech but most comfortable with NodeJS, Elixir, Clojure, PHP.\n\nZapier article on making stand up async: https://lnkd.in/ervhtPeu\n\n#change #engineering #softwaredevelopment #agile #asynchronouswork ",
      time: "3mo",
      urn: "7027584587799097344",
    },
    {
      num_appreciations: 6,
      num_comments: 262,
      num_empathy: 16,
      num_interests: 105,
      num_likes: 1061,
      num_praises: 58,
      num_reposts: 44,
      text: "£72,540.\n\nThat's the approximate annual cost of your daily standup.\n\nAssuming 6 developers on £75,000pa, you'll be lucky to get change from £100,000 to hire each developer after you've paid employers NI, pension contributions, and other benefits. Broken down to a day rate, that comes out at about £430 a day, or £54 an hour.\n\nWith a 23 minute unproductive context switch either side of a 15 minute standup meeting, you're going to be spending £54 per developer, per day (or £12,420 per developer per ~230-day working year) for that ritual.\n\nThis isn't about the cost of communication, which is wholly justified. Three quarters of that cost relate entirely to an avoidable and undesirable context switch.\n\nYour competitors are busy turning standup into a daily Slack message which a developer can drop in the 5 minutes before lunch, a time when they'll be naturally context switching anyway. \n\nAutomattic and Zapier have been doing it for years.\n\nEdit: Wow, 20k impressions. Thanks to everyone who agreed with me, and everyone who didn't. The best thing for our industry is open and honest discussions about how we handle remote-first.\n\nEdit 2: 80k impressions, this is officially my most viewed post. I'm looking for outside IR-35 contract work. Fully remote, polyglot on tech but most comfortable with NodeJS, Elixir, Clojure, PHP.\n\nZapier article on making stand up async: https://lnkd.in/ervhtPeu\n\n#change #engineering #softwaredevelopment #agile #asynchronouswork ",
      time: "3mo",
      urn: "7027584575392350208",
    },
    {
      num_appreciations: 6,
      num_comments: 262,
      num_empathy: 16,
      num_interests: 105,
      num_likes: 1061,
      num_praises: 58,
      num_reposts: 44,
      text: "£72,540.\n\nThat's the approximate annual cost of your daily standup.\n\nAssuming 6 developers on £75,000pa, you'll be lucky to get change from £100,000 to hire each developer after you've paid employers NI, pension contributions, and other benefits. Broken down to a day rate, that comes out at about £430 a day, or £54 an hour.\n\nWith a 23 minute unproductive context switch either side of a 15 minute standup meeting, you're going to be spending £54 per developer, per day (or £12,420 per developer per ~230-day working year) for that ritual.\n\nThis isn't about the cost of communication, which is wholly justified. Three quarters of that cost relate entirely to an avoidable and undesirable context switch.\n\nYour competitors are busy turning standup into a daily Slack message which a developer can drop in the 5 minutes before lunch, a time when they'll be naturally context switching anyway. \n\nAutomattic and Zapier have been doing it for years.\n\nEdit: Wow, 20k impressions. Thanks to everyone who agreed with me, and everyone who didn't. The best thing for our industry is open and honest discussions about how we handle remote-first.\n\nEdit 2: 80k impressions, this is officially my most viewed post. I'm looking for outside IR-35 contract work. Fully remote, polyglot on tech but most comfortable with NodeJS, Elixir, Clojure, PHP.\n\nZapier article on making stand up async: https://lnkd.in/ervhtPeu\n\n#change #engineering #softwaredevelopment #agile #asynchronouswork ",
      time: "3mo",
      urn: "7027584161179664384",
    },
    {
      num_appreciations: 6,
      num_comments: 262,
      num_empathy: 16,
      num_interests: 105,
      num_likes: 1061,
      num_praises: 58,
      num_reposts: 44,
      text: "£72,540.\n\nThat's the approximate annual cost of your daily standup.\n\nAssuming 6 developers on £75,000pa, you'll be lucky to get change from £100,000 to hire each developer after you've paid employers NI, pension contributions, and other benefits. Broken down to a day rate, that comes out at about £430 a day, or £54 an hour.\n\nWith a 23 minute unproductive context switch either side of a 15 minute standup meeting, you're going to be spending £54 per developer, per day (or £12,420 per developer per ~230-day working year) for that ritual.\n\nThis isn't about the cost of communication, which is wholly justified. Three quarters of that cost relate entirely to an avoidable and undesirable context switch.\n\nYour competitors are busy turning standup into a daily Slack message which a developer can drop in the 5 minutes before lunch, a time when they'll be naturally context switching anyway. \n\nAutomattic and Zapier have been doing it for years.\n\nEdit: Wow, 20k impressions. Thanks to everyone who agreed with me, and everyone who didn't. The best thing for our industry is open and honest discussions about how we handle remote-first.\n\nEdit 2: 80k impressions, this is officially my most viewed post. I'm looking for outside IR-35 contract work. Fully remote, polyglot on tech but most comfortable with NodeJS, Elixir, Clojure, PHP.\n\nZapier article on making stand up async: https://lnkd.in/ervhtPeu\n\n#change #engineering #softwaredevelopment #agile #asynchronouswork ",
      time: "3mo",
      urn: "7027584155865505792",
    },
    {
      num_appreciations: 6,
      num_comments: 262,
      num_empathy: 16,
      num_interests: 105,
      num_likes: 1061,
      num_praises: 58,
      num_reposts: 44,
      text: "£72,540.\n\nThat's the approximate annual cost of your daily standup.\n\nAssuming 6 developers on £75,000pa, you'll be lucky to get change from £100,000 to hire each developer after you've paid employers NI, pension contributions, and other benefits. Broken down to a day rate, that comes out at about £430 a day, or £54 an hour.\n\nWith a 23 minute unproductive context switch either side of a 15 minute standup meeting, you're going to be spending £54 per developer, per day (or £12,420 per developer per ~230-day working year) for that ritual.\n\nThis isn't about the cost of communication, which is wholly justified. Three quarters of that cost relate entirely to an avoidable and undesirable context switch.\n\nYour competitors are busy turning standup into a daily Slack message which a developer can drop in the 5 minutes before lunch, a time when they'll be naturally context switching anyway. \n\nAutomattic and Zapier have been doing it for years.\n\nEdit: Wow, 20k impressions. Thanks to everyone who agreed with me, and everyone who didn't. The best thing for our industry is open and honest discussions about how we handle remote-first.\n\nEdit 2: 80k impressions, this is officially my most viewed post. I'm looking for outside IR-35 contract work. Fully remote, polyglot on tech but most comfortable with NodeJS, Elixir, Clojure, PHP.\n\nZapier article on making stand up async: https://lnkd.in/ervhtPeu\n\n#change #engineering #softwaredevelopment #agile #asynchronouswork ",
      time: "3mo",
      urn: "7027584069634813953",
    },
    {
      num_appreciations: 3,
      num_comments: 10,
      num_empathy: 2,
      num_interests: 2,
      num_likes: 69,
      num_praises: 1,
      num_reposts: 3,
      text: "I was more than ready to pay the $42/month they first announced.\n\n$20/month - take my money! 💰 \n\nYou can see the announcement and join the ChatGPT Plus waitlist here:\nhttps://lnkd.in/eeRfgxBh",
      time: "3mo",
      urn: "7027311289538342913",
    },
    {
      num_comments: 0,
      num_likes: 9,
      num_reposts: 0,
      text: "One of the most underrated SEO tools is Google Local Business. \n\nAlbacete is a city in the center of Spain with cca 170k inhabitants. \n\nI have managed to get to almost 37k visits in less than 3 weeks just creating a Local Business for a client.\n\n\n #localbusinesses  #seo #google",
      time: "3mo",
      urn: "7026925831092363264",
    },
    {
      num_comments: 23,
      num_empathy: 7,
      num_likes: 114,
      num_praises: 14,
      num_reposts: 0,
      text: "1 month of not drinking alcohol.\n\n- Accomplished more. 🤝\n- Slept better. 💤\n- Lost weight. 💪\n\nI'm going to keep going.",
      time: "3mo",
      urn: "7026693815482601472",
    },
    {
      acticle_subtitle: "openai.com • 1 min read",
      acticle_title: "OpenAI and Microsoft extend partnership",
      num_appreciations: 111,
      num_comments: 310,
      num_empathy: 267,
      num_interests: 210,
      num_likes: 22928,
      num_praises: 1254,
      num_reposts: 976,
      text: "We are happy to announce the next phase of our partnership with Microsoft: https://lnkd.in/g-6VVpHf",
      time: "3mo",
      urn: "7026469983257812993",
    },
    {
      num_comments: 18,
      num_empathy: 3,
      num_interests: 1,
      num_likes: 135,
      num_praises: 15,
      num_reposts: 1,
      text: "FeedHive is two years old 🥳\n\nNo crazy hockey-stick growth.\nYet, only 1 time did we end the month lower than we started.\n\nI stopped sharing exact revenue figures - but what I can say is, $1M ARR is now within sight 🤩\n\nWhat a crazy ride this has been!",
      time: "3mo",
      urn: "7026118706426433536",
    },
    {
      num_comments: 6,
      num_empathy: 2,
      num_likes: 23,
      num_reposts: 1,
      text: "Want to use a Webflow library on steroids? 💖\n\nCheck out this amazing new tool for Webflow! \n\nIt’s Called GridUp! \n\nAnd it automates and synchronises all your Webflow components for you\n\nThe benefits? \n\n✅ Saves you tons of time\n✅ Build out pages in bulk (aka instantly) \n✅ Add a predefined structure to all those pages\n✅ Define a structure once, re-use it everywhere\n✅ No more conflicting classes with ‘class-sync’\n\nSuper curious where this tool will go the coming year! \n\nIt’s already great as it is, but could use some more customization, \n\n\n❓ What app do you want to see coming to a Webflow site near you? \n\n\nPs. borrowed the video from their website! \n\n------------\n\nHey there!\n\nI'm Mourice, ⚡\n\nAnd I'm on a mission to help entrepreneurs like you unlock the full potential of their digital business.\n\nAs a no-code and automation expert,\n\nI share valuable insights on #Webflow, #Marketing, and #Automation,\n\nto help you grow and streamline your operations. 📈\n\nJoin me on this journey and follow my updates for actionable tips and tricks!",
      time: "3mo",
      urn: "7025803196258209792",
    },
  ],
};
