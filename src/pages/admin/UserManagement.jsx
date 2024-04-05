import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { dashboardData } from "../../components/constants/sampleData";
import { transformImage } from "../../utils/features";
import { useFetchData } from "6pp";

import { server } from "../../components/constants/config";
import { useErrors } from "../../hooks/hook";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: "w-1/6",
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: "w-1/6",
    renderCell: (params) => (
      <img
        alt={params.row.name}
        src={params.row.avatar}
        className="h-12 w-12 rounded-full"
      />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: "w-1/6",
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: "w-1/6",
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: "w-1/6",
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: "w-1/6",
  },
];

const UserManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/users`,
    "dashboard-users",
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
      setRows(
        data.users.map((i) => ({
          ...i,
          id: i._id,
          avatar: transformImage(i.avatar, 50),
        })),
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? (
        <div className="h-full">Load..</div>
      ) : (
        <Table heading={"All Users"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default UserManagement;
