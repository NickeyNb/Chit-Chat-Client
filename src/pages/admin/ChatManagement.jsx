import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { dashboardData } from "../../components/constants/sampleData";
import { transformImage } from "../../utils/features";
import AvatarCard from "../../components/shared/AvatarCard";
import { server } from "../../components/constants/config";
import { useFetchData } from "6pp";
import { useErrors } from "../../hooks/hook";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },
  {
    field: "groupChat",
    headerName: "Group",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <AvatarCard max={100} avatar={params.row.members} />
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },
  // some problem in this
  // comment this
  // {
  //   field: "creator",
  //   headerName: "Created By",
  //   headerClassName: "table-header",
  //   width: 250,
  //   renderCell: (params) => (
  //     <div className="flex items-center space-x-1">
  //       <img
  //         alt={params.row.creator.name}
  //         src={params.row.creator.avatar}
  //         className="h-8 w-8 rounded-full"
  //       />
  //       <span>{params.row.creator.name}</span>
  //     </div>
  //   ),
  // },
];

const ChatManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/chats`,
    "dashboard-chats",
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
        data.chats.map((i) => ({
          ...i,
          id: i._id,
          avatar: i.avatar.map((i) => transformImage(i, 50)),
          members: i.members.map((i) => transformImage(i.avatar, 50)),
          creator: {
            name: i.creator.name,
            avatar: transformImage(i.creator.avatar, 50),
          },
        })),
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? (
        <div>Load...</div>
      ) : (
        <Table heading={"All Chats"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default ChatManagement;

// import { useFetchData } from "6pp";
// import React, { useEffect, useState } from "react";
// import AdminLayout from "../../components/layout/AdminLayout";
// import AvatarCard from "../../components/shared/AvatarCard";
// import Table from "../../components/shared/Table";

// import { useErrors } from "../../hooks/hook";
// import { server } from "../../components/constants/config";
// import { transformImage } from "../../utils/features";

// const columns = [
//   {
//     field: "id",
//     headerName: "ID",
//     headerClassName: "table-header",
//     width: 200,
//   },
//   {
//     field: "avatar",
//     headerName: "Avatar",
//     headerClassName: "table-header",
//     width: 150,
//     renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
//   },

//   {
//     field: "name",
//     headerName: "Name",
//     headerClassName: "table-header",
//     width: 300,
//   },

//   {
//     field: "groupChat",
//     headerName: "Group",
//     headerClassName: "table-header",
//     width: 100,
//   },
//   {
//     field: "totalMembers",
//     headerName: "Total Members",
//     headerClassName: "table-header",
//     width: 120,
//   },
//   {
//     field: "members",
//     headerName: "Members",
//     headerClassName: "table-header",
//     width: 400,
//     renderCell: (params) => (
//       <AvatarCard max={100} avatar={params.row.members} />
//     ),
//   },
//   {
//     field: "totalMessages",
//     headerName: "Total Messages",
//     headerClassName: "table-header",
//     width: 120,
//   },
//   {
//     field: "creator",
//     headerName: "Created By",
//     headerClassName: "table-header",
//     width: 250,
//     renderCell: (params) => (
//       <div className="flex items-center space-x-4">
//         <img
//           className="h-8 w-8 rounded-full"
//           alt={params.row.creator?.name}
//           src={params.row.creator?.avatar}
//         />
//         <span>{params.row.creator.name}</span>
//       </div>
//     ),
//   },
// ];

// const ChatManagement = () => {
//   const { loading, data, error } = useFetchData(
//     `${server}/api/v1/admin/chats`,
//     "dashboard-chats",
//   );

//   useErrors([
//     {
//       isError: error,
//       error: error,
//     },
//   ]);

//   const [rows, setRows] = useState([]);

//   useEffect(() => {
//     if (data) {
//       setRows(
//         data.chats.map((i) => ({
//           ...i,
//           id: i._id,
//           avatar: i.avatar.map((i) => transformImage(i, 50)),
//           members: i.members.map((i) => transformImage(i.avatar, 50)),
//           creator: {
//             name: i.creator.name,
//             avatar: transformImage(i.creator.avatar, 50),
//           },
//         })),
//       );
//     }
//   }, [data]);

//   return (
//     <AdminLayout>
//       {loading ? (
//         <div className="h-full">Load...</div>
//       ) : (
//         <Table heading="All Chats" columns={columns} rows={rows} />
//       )}
//     </AdminLayout>
//   );
// };

// export default ChatManagement;
