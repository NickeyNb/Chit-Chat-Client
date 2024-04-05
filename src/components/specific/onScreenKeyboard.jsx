import React from "react";

const OnScreenKeyboard = ({ onClose, onKeyPress }) => {
  // Function to handle key presses
  const handleKeyPress = (key) => {
    // Call the onKeyPress function with the pressed key
    if (onKeyPress) {
      onKeyPress(key);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4">
      <div className="grid grid-cols-3 gap-2">
        {/* Letters */}
        {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((letter) => (
          <button key={letter} onClick={() => handleKeyPress(letter)}>
            {letter}
          </button>
        ))}
        {/* Close button */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default OnScreenKeyboard;
