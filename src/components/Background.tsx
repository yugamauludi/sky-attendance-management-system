import React from "react";

const Background: React.FC = () => {
  return (
    <>
      <div className="fixed -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full opacity-70 blur-3xl" />
      <div className="fixed top-1/2 -left-20 w-60 h-60 bg-gradient-to-tr from-navy-500 to-blue-600 rounded-full opacity-15 blur-3xl" />
      <div className="fixed -bottom-40 right-1/3 w-80 h-80 bg-gradient-to-bl from-yellow-300 to-yellow-500 rounded-full opacity-10 blur-3xl" />
    </>
  );
};

export default Background;