import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaArrowsDownToPeople, FaCircleUser } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { server } from "../../components/constants/config";
import ButtonBox from "../../components/specific/ButtonBox";
import InputBox from "../../components/specific/InputBox";
import { userExists } from "../../redux/reducers/auth";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // redux
  const dispatch = useDispatch();
  // toggle login
  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  // register-handler
  // Setting the Content-Type header to multipart/form-data to indicate that the request contains a file upload.
  const handleRegister = async () => {
    // console.log("register");
    const toastId = toast.loading("Signing up...");
    setIsLoading(true);
    // Create FormData object to send form data including avatar file
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("avatar", avatar);

    try {
      const response = await axios.post(
        `${server}/api/v1/user/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.data.success) {
        console.log(response.data.message);
        dispatch(userExists(response.data.user));
        toast.success(response.data.message, {
          id: toastId,
        });
      }
    } catch (error) {
      // console.log(error.response?.data.message || "Something went wrong !");
      toast.error(error.response?.data.message || "Something went wrong !", {
        id: toastId,
      });
      // console.log(error)
    } finally {
      setIsLoading(false);
      setName("");
      setBio("");
      setUsername("");
      setPassword("");
    }
  };

  // Login handler
  const handleLogin = async () => {
    // console.log("login");
    // Implement login logic here
    const toastId = toast.loading("Logging in...");
    setIsLoading(true);
    const values = {
      username,
      password,
    };
    try {
      const response = await axios.post(`${server}/api/v1/user/login`, values, {
        withCredentials: true,
      });
      if (response.data.success) {
        console.log(response.data);
        dispatch(userExists(response.data.user));
        toast.success(response.data.message, {
          id: toastId,
        });
      }
    } catch (error) {
      // console.log(error.response?.data.message || "Something went wrong !");
      toast.error(error.response?.data.message || "Something went wrong !", {
        id: toastId,
      });
      // console.log(error);
    } finally {
      setIsLoading(false);
      setUsername("");
      setPassword("");
    }
  };

  const handleGuestLogin = () => {
    console.log("Guest login");
    // Implement guest login logic here
    setUsername("user@user.com");
    setPassword("user1234");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isLogin ? handleLogin() : handleRegister();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-400">
      <div className="flex w-full flex-col items-center justify-center px-4 md:max-w-3xl md:flex-row">
        <div className="flex flex-1 flex-col items-center justify-center bg-transparent p-8 text-white md:w-1/2 md:flex-none">
          <FaArrowsDownToPeople size={100} color="white" />
          <div className="mt-8 flex flex-col gap-4 text-center">
            <h1 className="text-3xl font-semibold">Join the community</h1>
            <p className="text-lg">Open the world!</p>
            <Link
              to={"https://nitin-portfolio-coral.vercel.app/"}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white px-2 py-2 text-center font-semibold uppercase text-black outline-white hover:bg-gray-100"
            >
              About developer
            </Link>
            <div className="mt-4 text-sm text-gray-300">
              © {new Date().getFullYear()} Chit-Chat. All rights reserved.
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center bg-white p-8 md:rounded-r-2xl">
          <h1 className="mb-8 text-center text-2xl font-semibold">
            {isLogin ? "Sign-In" : "Sign-Up"}
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div className="flex flex-col gap-4">
                <label htmlFor="pic" className="mx-auto ">
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="Profile"
                      className="mx-auto h-20 w-20 rounded-full"
                    />
                  ) : (
                    <FaCircleUser
                      size={80}
                      color="gray"
                      className="cursor-pointer"
                    />
                  )}
                </label>
                <input
                  name="pic"
                  id="pic"
                  type="file"
                  className=" hidden"
                  onChange={handleFileChange}
                />
                <InputBox
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onInputChange={(val) => setName(val)}
                />
                <InputBox
                  type="text"
                  placeholder="Enter your Bio"
                  value={bio}
                  onInputChange={(val) => setBio(val)}
                />
              </div>
            )}
            <InputBox
              type="text"
              placeholder="Enter Username"
              value={username}
              onInputChange={(val) => setUsername(val)}
            />
            <InputBox
              type="password"
              placeholder="Enter password"
              value={password}
              onInputChange={(val) => setPassword(val)}
            />
            <ButtonBox
              isLoading={isLoading}
              label={isLogin ? "Login" : "Register"}
              // onClickHandler={() => alert("ahaha")}
            />
            {isLogin && (
              <button
                className="border border-orange-500 px-2 py-2 font-semibold tracking-wide text-orange-500 outline-orange-600  hover:bg-gray-100"
                onClick={handleGuestLogin}
              >
                Guest Login
              </button>
            )}
            <div className="relative border-2 border-t border-gray-200">
              <div className="absolute -top-3 left-32 bg-white px-2 ">OR</div>
            </div>
            <div className="flex justify-center md:justify-between">
              <div>{isLogin ? "New User?" : "Already a User?"}</div>
              <div
                onClick={toggleLogin}
                className="cursor-pointer font-semibold text-blue-500 underline"
              >
                {isLogin ? "Register" : "Login"}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
