import React, { Suspense, useEffect, useState } from "react";
// import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LayoutLoader } from "./components/layout/Loaders";
import { ThemeProvider } from "./context/theme";
import axios from "axios";
import { server } from "../src/components/constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "../src/redux/reducers/auth";
import { Toaster } from "react-hot-toast";

// router
import { lazy } from "react";

import { createBrowserRouter } from "react-router-dom";
import AuthRoute from "./routes/AuthRoute";
import NotAuthRoute from "./routes/NotAuthRoute";
import { SocketProvider } from "./socket";

// import HomePage from "./pages/HomePage";
// importing dynamic
const HomePage = lazy(() => import("./pages/HomePage"));
const Login = lazy(() => import("./pages/auth/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

// Admin routes
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUserManageMent = lazy(() => import("./pages/admin/UserManagement"));
const AdminChatManageMent = lazy(() => import("./pages/admin/ChatManagement"));
const AdminMessageManageMent = lazy(
  () => import("./pages/admin/MessageManagement"),
);

const VideoCallPage = lazy(() => import("./pages/VideoCallPage"));

const App = () => {
  const { user, loader } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/my-profile`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        dispatch(userExists(data.user));
      })
      .catch((err) => {
        dispatch(userNotExists());
      });
  }, [dispatch]);

  const [themeMode, setThemeMode] = useState("light");
  const darkTheme = () => {
    setThemeMode("dark");
  };
  const lightTheme = () => {
    setThemeMode("light");
  };

  useEffect(() => {
    document.querySelector("html").classList.remove("dark", "light");
    document.querySelector("html").classList.add(themeMode);
  }, [themeMode]);

  // router
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <SocketProvider>
          <AuthRoute user={user}>
            <HomePage />
          </AuthRoute>
        </SocketProvider>
      ),
    },
    {
      path: "/login",
      element: (
        <NotAuthRoute user={user}>
          <Login />
        </NotAuthRoute>
      ),
    },
    {
      path: "/chat/:chatId",

      element: (
        <SocketProvider>
          <AuthRoute user={user}>
            <Chat />
          </AuthRoute>
        </SocketProvider>
      ),
    },
    {
      path: "/groups",
      element: (
        <SocketProvider>
          <AuthRoute user={user}>
            <Groups />
          </AuthRoute>
        </SocketProvider>
      ),
    },
    // Admin-Routes
    {
      path: "/admin",
      element: <AdminLogin />,
    },
    {
      path: "/admin/dashboard",
      element: <AdminDashboard />,
    },
    {
      path: "/admin/users",
      element: <AdminUserManageMent />,
    },
    {
      path: "/admin/chats",
      element: <AdminChatManageMent />,
    },
    {
      path: "/admin/messages",
      element: <AdminMessageManageMent />,
    },
    {
      path: "/video-call",
      element: <VideoCallPage />,
    },
    // page not found
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  return loader ? (
    <LayoutLoader />
  ) : (
    // rigght click se default behaviour nhi hoga
    <div onContextMenu={(e) => e.preventDefault()}>
      <HelmetProvider>
        <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
          <Suspense fallback={<LayoutLoader />}>
            {/* <SocketProvider> */}
            <RouterProvider router={router} />
            {/* </SocketProvider> */}
          </Suspense>
          <Toaster position="top-center" />
        </ThemeProvider>
      </HelmetProvider>
    </div>
  );
};

export default App;
