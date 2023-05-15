import React from "react";
import Post from "./Post";
import Spinner from "./Spinner";

function Theme({
  theme,
  index,
  themes,
  setThemes,
  generatePostIdeas,
  generatePost,
  setPost,
}) {
  return (
    <div
      className={`flex flex-col items-start justify-start ${
        index != 2 && "lg:border-r border-b lg:border-b-0"
      } pr-3`}
      key={index}
    >
      <div className="flex w-full">
        <div className="relative w-full">
          <input
            type="text"
            className="p-2.5 w-full z-20 text-sm rounded-lg border border-gray-300"
            placeholder={`Theme ${index + 1}`}
            onChange={(e) => {
              setThemes(
                themes.map((item, i) =>
                  i === index ? { ...item, theme: e.target.value } : item
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
              <Spinner />
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
                className={`ml-1 p-1 text-white bg-vulsePurple rounded-full`}
                onClick={() => generatePost(topic.title, theme.theme)}
              >
                {topic.loading ? <Spinner /> : "Generate"}
              </button>
            </div>
            {topic.post && <Post topic={topic} setPost={setPost} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Theme;
