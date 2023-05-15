import React from "react";

function PostEdit({ post, setPost }) {
  return (
    <div className="grid grid-cols-6 gap-4 mb-4 col-span-3">
      <div className="flex flex-col items-start justify-center col-span-6 space-y-3">
        <textarea
          className="w-full p-2 text-xs border rounded shadow-md min-h-[200px] max-h-[500px] focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent"
          value={post.post}
          onChange={(e) => setPost(e.target.value)}
        />
      </div>
    </div>
  );
}

export default PostEdit;
