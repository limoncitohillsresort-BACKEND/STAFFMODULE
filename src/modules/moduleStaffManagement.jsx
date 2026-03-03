import React, { useState } from "react";
import {
  ChevronLeft,
  Search,
  Plus,
  UserCog,
  Lock,
  Activity,
  Trash2,
} from "lucide-react";

export default function ModuleStaffManagement({ onBack }) {
  const [staff, setStaff] = useState([
    {
      id: "E001",
      name: "Dalia M.",
      role: "Housekeeping",
      active: true,
      email: "dalia@resort.com",
    },
    {
      id: "E002",
      name: "Carlos R.",
      role: "Maintenance",
      active: true,
      email: "carlos@resort.com",
    },
    {
      id: "E003",
      name: "Sarah S.",
      role: "Front Desk",
      active: true,
      email: "sarah@resort.com",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });

  const toggleStatus = (id) => {
    setStaff(
      staff.map((s) =>
        s.id === id ? { ...s, active: !s.active } : s
      )
    );
  };

  const handleSaveUser = () => {
    setStaff(
      staff.map((s) =>
        s.id === editModal.user.id ? editModal.user : s
      )
    );
    setEditModal({ isOpen: false, user: null });
  };

  return (
    <div className="module-page bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={20} /> Back
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          Staff Access Control
        </h2>
      </div>

      <div className="max-w-7xl mx-auto bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden m-4">
        <div className="p-4 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              className="pl-10 pr-4 py-2 border rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700">
            <Plus size={16} /> Add Staff
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staff
                .filter((s) =>
                  s.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-500">
                      {s.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div>{s.name}</div>
                      <div className="text-xs text-gray-400">{s.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {s.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(s.id)}
                        className={`text-xs px-2 py-1 rounded border ${
                          s.active
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        {s.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() =>
                          setEditModal({
                            isOpen: true,
                            user: { ...s },
                          })
                        }
                        className="p-1 text-gray-500 hover:text-blue-600"
                        title="Edit Access"
                      >
                        <UserCog size={18} />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-orange-500"
                        title="Reset Password"
                      >
                        <Lock size={18} />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-green-600"
                        title="View Logs"
                      >
                        <Activity size={18} />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-red-600"
                        title="Remove"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Staff Access</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500">
                  Name
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={editModal.user.name}
                  onChange={(e) =>
                    setEditModal({
                      ...editModal,
                      user: {
                        ...editModal.user,
                        name: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">
                  Role
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={editModal.user.role}
                  onChange={(e) =>
                    setEditModal({
                      ...editModal,
                      user: {
                        ...editModal.user,
                        role: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">
                  Email
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={editModal.user.email}
                  onChange={(e) =>
                    setEditModal({
                      ...editModal,
                      user: {
                        ...editModal.user,
                        email: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() =>
                  setEditModal({ isOpen: false, user: null })
                }
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

