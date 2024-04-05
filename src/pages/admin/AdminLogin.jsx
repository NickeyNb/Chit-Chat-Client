import React, { useEffect, useState } from "react";
import InputBox from "../../components/specific/InputBox";
import ButtonBox from "../../components/specific/ButtonBox";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";

const AdminLogin = () => {
  const [secretKey, setSecretKey] = useState("");

  // redux
  const dispatch = useDispatch();
  const { isAdmin } = useSelector((state) => state.auth);

  const loginHandler = (e) => {
    e.preventDefault();
    console.log("Login handler");
    dispatch(adminLogin(secretKey));
  };

  // initial-time
  useEffect(() => {
    dispatch(getAdmin());
  }, []);
  if (isAdmin) return <Navigate to="/admin/dashboard" />;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center border-2 border-solid border-black bg-rose-100/50">
      <div className="w-full max-w-[70vh] bg-white p-4">
        <h1 className="mb-8 text-center">Welcome ADMIN</h1>
        <form
          onSubmit={loginHandler}
          className="flex w-full flex-col gap-4 rounded-lg px-2 py-2"
        >
          <InputBox
            type="password"
            placeholder="Enter wallet id "
            value={secretKey}
            onInputChange={(val) => setSecretKey(val)}
            className="px-2 py-3"
          />
          <ButtonBox label="Login" />
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
