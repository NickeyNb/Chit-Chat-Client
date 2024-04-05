import React from "react";

const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full">
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <h1 className="py-4 text-center text-2xl font-semibold uppercase">
            {heading}
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.field}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      {column.headerName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {rows.map((row) => (
                  <tr key={row.id}>
                    {columns.map((column) => (
                      <td
                        key={column.field}
                        className="whitespace-nowrap px-6 py-4"
                      >
                        {column.field === "avatar" ? (
                          <img
                            src={row[column.field]}
                            alt={row[column.field]}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          row[column.field]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
