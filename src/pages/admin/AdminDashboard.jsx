import React from "react";
import moment from "moment";

import AdminLayout from "../../components/layout/AdminLayout";
import { DoughnutChart, LineChart } from "../../components/charts/Charts";
import { BsSearch } from "react-icons/bs";
import { RiNotificationLine } from "react-icons/ri";
import { FaUser, FaComments, FaRegUser } from "react-icons/fa";

import { useFetchData } from "6pp";
import { server } from "../../components/constants/config";
import { LayoutLoader } from "../../components/layout/Loaders";
import { useErrors } from "../../hooks/hook";

const AdminDashboard = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/stats`,
    "dashboard-stats",
  );

  const { stats } = data || {};

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const Appbar = (
    <div className="mb-8 rounded-lg bg-white p-8 shadow-md">
      <div className="flex items-center space-x-4">
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="rounded-full bg-gray-100 px-4 py-2 focus:outline-none"
          />
        </div>
        <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none">
          <BsSearch />
        </button>
        <div className="flex-grow" />
        <p className="hidden lg:block">
          {moment().format("dddd, D MMMM YYYY")}
        </p>
        <div className="ml-auto">
          <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 focus:outline-none">
            <RiNotificationLine className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  const Widgets = (
    <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
      <Widget
        title="Users"
        value={stats?.usersCount}
        Icon={<FaUser className="h-6 w-6" />}
      />
      <Widget
        title="Chats"
        value={stats?.totalChatsCount}
        Icon={<FaRegUser className="h-6 w-6" />}
      />
      <Widget
        title="Messages"
        value={stats?.messagesCount}
        Icon={<FaComments className="h-6 w-6" />}
      />
    </div>
  );

  return loading ? (
    <div>
      <LayoutLoader />
    </div>
  ) : (
    <AdminLayout>
      <div>{Appbar}</div>
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg bg-white  py-8 shadow-md">
          <p className="mb-4 text-xl font-semibold">Last Messages</p>
          <LineChart value={stats?.messagesChart || []} />
        </div>
        <div className="rounded-lg bg-white p-8 shadow-md">
          <DoughnutChart
            labels={["Single Chats", "Group Chats"]}
            value={[
              stats?.totalChatsCount - stats?.groupsCount || 0,
              stats?.groupsCount || 0,
            ]}
          />
          <div className="mt-4 flex items-center justify-center space-x-2">
            <FaRegUser className="h-6 w-6 text-gray-500" />
            <p>V/s</p>
            <FaUser className="h-6 w-6 text-gray-500" />
          </div>
        </div>
      </div>
      <div>{Widgets}</div>
    </AdminLayout>
  );
};

const Widget = ({ title, value, Icon }) => (
  <div className="rounded-lg bg-white p-8 shadow-md">
    <div className="mb-4 flex items-center">
      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
        {Icon}
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
    <p className="text-lg font-semibold">{title}</p>
  </div>
);

export default AdminDashboard;
