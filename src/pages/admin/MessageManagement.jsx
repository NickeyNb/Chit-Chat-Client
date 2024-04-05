import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { dashboardData } from "../../components/constants/sampleData";
import { fileFormat, transformImage } from "../../utils/features";
import moment from "moment";
import RenderAttachment from "../../components/shared/RenderAttachement";
import { server } from "../../components/constants/config";
import { useFetchData } from "6pp";
import { useErrors } from "../../hooks/hook";
const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: "w-1/6",
  },
  // some problem in this
  // comment this
  // {
  //   field: "attachments",
  //   headerName: "Attachments",
  //   headerClassName: "table-header",
  //   width: "w-1/6",
  //   renderCell: (params) => {
  //     const { attachments } = params.row;
  //     return attachments?.length > 0
  //       ? attachments.map((i) => {
  //           const url = i.url;
  //           const file = fileFormat(url);

  //           return (
  //             <div>
  //               <a
  //                 href={url}
  //                 download
  //                 target="_blank"
  //                 style={{
  //                   color: "black",
  //                 }}
  //               >
  //                 {RenderAttachment(file, url)}
  //               </a>
  //             </div>
  //           );
  //         })
  //       : "No attachemetns";
  //     return (
  //       <img
  //         alt={params.row.name}
  //         src={params.row.avatar}
  //         className="h-8 w-8 rounded-full"
  //       />
  //     );
  //   },
  // },
  {
    field: "Content",
    headerName: "Content",
    headerClassName: "table-header",
    width: "w-2/6",
  },
  // some problem in this
  // comment this
  // {
  //   field: "sender",
  //   headerName: "Sent By",
  //   headerClassName: "table-header",
  //   width: "w-1/6",
  //   renderCell: (params) => (
  //     <div className="flex items-center space-x-2">
  //       <img
  //         alt={params.row.sender.name}
  //         src={params.row.sender.avatar}
  //         className="h-8 w-8 rounded-full"
  //       />
  //       <span>{params.row.sender.name}</span>
  //     </div>
  //   ),
  // },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: "w-1/6",
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: "w-1/6",
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: "w-1/6",
  },
];
const MessageManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/messages`,
    "dashboard-messages",
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
        data.messages.map((i) => ({
          ...i,
          id: i._id,
          sender: {
            name: i.sender.name,
            avatar: transformImage(i.sender.avatar, 50),
          },
          createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        })),
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? (
        <div>Load...</div>
      ) : (
        <Table
          heading={"All Messages"}
          columns={columns}
          rows={rows}
          rowHeight={200}
        />
      )}
    </AdminLayout>
  );
};

export default MessageManagement;
