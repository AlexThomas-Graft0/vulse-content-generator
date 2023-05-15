import React from "react";

function Post({ topic, setPost }) {
  return (
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
  );
}

export default Post;
