import React, { memo } from "react";
import { transformImage } from "../../utils/features";

const UserItem = ({ user, handler, handlerIsLoading, isAdded = false }) => {
  const { name, _id, avatar } = user;
  return (
    <div>
      <li className="flex items-center border-b border-gray-200 py-2">
        <img
          src={transformImage(avatar)}
          alt={name}
          className="mr-4 h-10 w-10 rounded-full"
        />
        <p className="flex-grow overflow-hidden whitespace-nowrap">{name}</p>
        <button
          className="rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-700"
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
        >
          {isAdded ? "Remove" : "Add"}
        </button>
      </li>
    </div>
  );
};

export default memo(UserItem);
