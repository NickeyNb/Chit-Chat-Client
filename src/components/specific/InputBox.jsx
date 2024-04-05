import React from "react";

const InputBox = ({ type, placeholder, onInputChange, value }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onInputChange && onInputChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-solid border-gray-400 px-2 py-2 outline-gray-500"
      required
    />
  );
};

export default InputBox;
