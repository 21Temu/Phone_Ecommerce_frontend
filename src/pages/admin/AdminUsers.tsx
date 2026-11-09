import { useEffect, useState } from "react";
import { adminBlockUser, adminFetchUsers } from "../../api/admin";
import type { User } from "../../types";

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);

  const reload = () => adminFetchUsers().then(setUsers).catch(() => {});
  useEffect(() => { reload(); }, []);

  const toggle = async (id: number) => {
    await adminBlockUser(id);
    reload();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Username</th><th className="p-3">Email</th>
              <th className="p-3">Role</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3 font-medium">{u.username}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3 text-right">
                  <button className="text-red-600 hover:underline text-xs" onClick={() => toggle(u.id)}>
                    Block / unblock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}