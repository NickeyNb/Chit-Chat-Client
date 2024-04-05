import React from "react";

const ButtonBox = ({ isLoading, label, className }) => {
  return (
    <button
      disabled={isLoading}
      className={`bg-orange-500 px-2 py-2 font-semibold tracking-wide text-white outline-orange-600  hover:bg-orange-600 ${className} disabled:cursor-not-allowed disabled:bg-orange-300`}
    >
      {label}
    </button>
  );
};

export default ButtonBox;
