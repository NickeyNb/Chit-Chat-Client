import React from "react";
import { transformImage } from "../../utils/features";

const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <div className=" flex items-center justify-center rounded-full">
      {avatar.map((i, index) => (
        <img
          key={index}
          src={transformImage(i)}
          alt={`Avatar ${index}`}
          // wherever we used this AvatarCard give its parent relative
          className="absolute h-12 w-12 rounded-full"
          style={{
            width: "3rem",
            height: "3rem",
            left: `${index * 0.5}rem`, // Adjust position based on index
            overflow: "auto",
          }}
        />
      ))}
    </div>
  );
};

export default AvatarCard;
