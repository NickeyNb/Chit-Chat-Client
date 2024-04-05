import React from "react";

const ConfirmDeleteDialog = ({ open, handleClose, deleteHandler }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${open ? "visible" : "hidden"}`}
    >
      <div className="w-80 rounded-lg bg-white p-8">
        <h2 className="mb-4 text-center text-2xl font-bold">Confirm Delete</h2>
        <p className="mb-4 text-center">
          Are you sure you want to delete this group?
        </p>
        <div className="flex justify-center">
          <button
            className="mr-2 rounded-md bg-gray-300 px-4 py-2 hover:bg-gray-400"
            onClick={handleClose}
          >
            No
          </button>
          <button
            className="rounded-md bg-red-500 px-4 py-2 text-white"
            onClick={deleteHandler}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteDialog;
