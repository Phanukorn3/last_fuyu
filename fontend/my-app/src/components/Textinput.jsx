import React from "react";

const TextInput = ({ label, type = "text", name, value, onChange, placeholder, className = "" }) => {
  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label htmlFor={name} className="mb-2 text-gray-700 font-medium">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-3 py-2 outline-none border-b-2 border-gray-300 font-sans focus:ring-0 focus:placeholder-transparent hover:border-black duration-500 ${className}`}
      />
    </div>
  );
};

export default TextInput;
