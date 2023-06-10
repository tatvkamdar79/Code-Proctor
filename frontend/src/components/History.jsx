import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function History(previousRooms) {
  useEffect(() => {}, [previousRooms]);

  return (
    <div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Name</th>
          </tr>
        </thead>
        <tbody>
          {previousRooms.map((room, index) => {
            const [roomId, roomTitle] = room.split("!", 2);
            return (
              <tr key={index}>
                <td className="border px-4 py-2">
                  <Link
                    className="block text-black no-underline"
                    to={`/room/${roomId}`}
                  >
                    {roomId}
                  </Link>
                </td>
                <td className="border px-4 py-2">
                  <Link
                    className="block text-black no-underline"
                    to={`/room/${roomId}`}
                  >
                    {roomTitle}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default History;
