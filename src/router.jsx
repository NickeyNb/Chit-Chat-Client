import { lazy } from "react";

import { createBrowserRouter } from "react-router-dom";
import AuthRoute from "./routes/AuthRoute";
import NotAuthRoute from "./routes/NotAuthRoute";

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

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthRoute user={user}>
        <HomePage />
      </AuthRoute>
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
      <AuthRoute user={user}>
        <Chat />
      </AuthRoute>
    ),
  },
  {
    path: "/groups",
    element: (
      <AuthRoute user={user}>
        <Groups />
      </AuthRoute>
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
