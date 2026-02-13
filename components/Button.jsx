import React, { useState } from "react";

const Button = ({ input, selectedFile, onClick }) => {
  return (
    <div className="w-full">
      <button
        className="bg-green-500 tracking-wider text-white w-[100%] py-2 px-5 rounded-lg disabled:bg-gray-300 disabled:text-gray-500"
        disabled={!input.trim() && !selectedFile}
        onClick={onClick}
      >
        Post
      </button>
    </div>
  );
};

export default Button;