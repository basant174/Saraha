import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CreateUser from './CreateUser'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [users, setUsers] = useState([])
  const [messagesCount, setMessagesCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await axios.get('/api/v1/admin/', {
        headers: { Authorization: `ADMIN ${token}` }
      })
      setUsers(res.data.data.users)
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await axios.get('/api/v1/admin/get-messages/', {
        headers: { Authorization: `ADMIN ${token}` }
      })
      const messages = res.data.data.messages || res.data.data
      setMessagesCount(Array.isArray(messages) ? messages.length : 0)
    } catch (err) {
      console.error("Error fetching messages:", err)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchUsers()
      await fetchMessages()
      setLoading(false)
    }
    loadData()
  }, [])

  // ====== Delete User ======
  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No admin token found");

      await axios.delete(`/api/v1/user/${userId}/delete-account/`, {
        headers: { Authorization: `ADMIN ${token}` },
      });

      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.error || err.message || "Failed to delete user");
    }
  };

  // ====== Freeze User ======
  const handleFreezeUser = async (userId) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No admin token found");

      await axios.delete(`/api/v1/user/${userId}/freeze-account`, {
        headers: { Authorization: `ADMIN ${token}` },
      });

      setUsers(prev =>
        prev.map(u =>
          u._id === userId ? { ...u, freezedAt: new Date().toISOString() } : u
        )
      );
      toast.success("User frozen successfully!");
    } catch (err) {
      console.error("Freeze error:", err);
      toast.error(err.response?.data?.error || err.message || "Failed to freeze user");
    }
  };

  // ====== Restore User ======
  const handleRestoreUser = async (userId) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No admin token found");

      await axios.patch(
        `/api/v1/user/${userId}/restore-account`,
        {},
        { headers: { Authorization: `ADMIN ${token}` } }
      );

      setUsers(prev =>
        prev.map(u =>
          u._id === userId ? { ...u, freezedAt: null } : u
        )
      );
      toast.success("User restored successfully!");
    } catch (err) {
      console.error("Restore error:", err);
      toast.error(err.response?.data?.error || err.message || "Failed to restore user");
    }
  };

  const totalMessages = messagesCount
  const frozenCount = Array.isArray(users) ? users.filter(user => user.freezedAt).length : 0
  const adminCreatedCount = Array.isArray(users) ? users.filter(user => user.role === 'ADMIN').length : 0

  return (
    <div className="p-6">
      <h4 className="font-bold mb-11 text-xl">Dashboard</h4>

      {/* ====== Stats Cards ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="relative bg-white text-black shadow rounded-xl p-4 flex items-start">
          <div className="absolute -top-4 left-4 bg-[#156faf] rounded-xl w-12 h-12 flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-user text-white text-xl"></i>
          </div>
          <div className="flex-1 flex flex-col items-end pr-5 w-full">
            <span className="text-md text-gray-500 mb-1">Total Users</span>
            <div className="w-full flex flex-col items-end mb-2">
              <div className="text-2xl font-bold text-gray-700">
                {users.filter(user => user.role === "USER").length}
              </div>
              <div className="border-b border-gray-200 w-full mt-1"></div>
            </div>
          </div>
        </div>

        <div className="relative bg-white text-black shadow rounded-xl p-4 flex items-start">
          <div className="absolute -top-4 left-4 bg-[#156faf] rounded-xl w-12 h-12 flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-message text-white text-xl"></i>
          </div>
          <div className="flex-1 flex flex-col items-end pr-5 w-full">
            <span className="text-md text-gray-500 mb-1">Total Messages</span>
            <div className="w-full flex flex-col items-end mb-2">
              <div className="text-2xl font-bold text-gray-700">{totalMessages}</div>
              <div className="border-b border-gray-200 w-full mt-1"></div>
            </div>
          </div>
        </div>

        <div className="relative bg-white text-black shadow rounded-xl p-4 flex items-start">
          <div className={`absolute -top-4 left-4 rounded-xl w-12 h-12 flex items-center justify-center shadow-lg ${frozenCount > 0 ? 'bg-red-600' : 'bg-[#156faf]'}`}>
            <i className="fa-solid fa-person-circle-xmark text-white text-xl"></i>
          </div>
          <div className="flex-1 flex flex-col items-end pr-5 w-full">
            <span className="text-md text-gray-500 mb-1">Frozen Users</span>
            <div className="w-full flex flex-col items-end mb-2">
              <div className={`text-2xl font-bold ${frozenCount > 0 ? 'text-red-600' : 'text-gray-700'}`}>
                {frozenCount}
              </div>
              <div className="border-b border-gray-200 w-full mt-1"></div>
            </div>
          </div>
        </div>

        <div className="relative bg-white text-black shadow rounded-xl p-4 flex items-start">
          <div className="absolute -top-4 left-4 bg-[#156faf] rounded-xl w-12 h-12 flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-user-minus text-white text-xl"></i>
          </div>
          <div className="flex-1 flex flex-col items-end pr-5 w-full">
            <span className="text-md text-gray-500 mb-1">Admin Account</span>
            <div className="w-full flex flex-col items-end mb-2">
              <div className="text-2xl font-bold text-gray-700">{adminCreatedCount}</div>
              <div className="border-b border-gray-200 w-full mt-1"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#156faf] text-white px-5 py-2 rounded-lg"
        >
          Create User
        </button>
      </div>

      {/* ====== Users Table ====== */}
      <div className="bg-white shadow rounded-xl overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-700">
          Users Activity
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-md font-medium text-[#082c46] uppercase">User</th>
                <th className="px-6 py-3 text-left text-md font-medium text-[#082c46] uppercase">Email</th>
                <th className="pr-16 py-3 text-left text-md font-medium text-[#082c46] uppercase">Role</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <div className="bg-gray-200 w-10 h-10 flex items-center justify-center rounded-full text-xl">
                      <i className="fa-regular fa-user"></i>
                    </div>
                    <span
                      className="text-gray-800 font-medium cursor-pointer"
                      onClick={() => setSelectedUser(user)}
                    >
                      {user.firstName} {user.lastName}
                      {user.freezedAt && (
                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                          Frozen
                        </span>
                      )}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="pr-16 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === "ADMIN" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right relative">
                    {user.freezedAt ? (
                      <div className="absolute top-4 right-16 flex gap-7 transform -translate-x-2">
                        <button
                          onClick={() => handleRestoreUser(user._id)}
                          className="w-10 h-10 flex items-center justify-center bg-green-700 text-white rounded-lg shadow"
                        >
                          <i className="fa-solid fa-rotate"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="w-10 h-10 flex items-center justify-center bg-red-700 text-white rounded-lg shadow"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleFreezeUser(user._id)}
                        className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-lg shadow"
                      >
                        <i className="fa-solid fa-person-circle-minus"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="p-6 w-[320px] relative">
              <CreateUser
                onSuccess={() => {
                  setShowModal(false)
                  fetchUsers()
                  fetchMessages()
                }}
              />
              <button onClick={() => setShowModal(false)} className="absolute top-10 -right-9 text-gray-500 hover:text-gray-700">✕</button>
            </div>
          </div>
        )}
      </div>

      {/* ====== User Details Popup ====== */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#d0e2ef] p-6 rounded-xl w-[400px] relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <div className="flex flex-col items-center gap-4">
              {selectedUser.cloudProfileImage?.secure_url ? (
                <img
                  src={selectedUser.cloudProfileImage.secure_url}
                  alt="profile"
                  className="w-32 h-32 shadow-md rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                  {selectedUser.firstName[0]}
                  {selectedUser.lastName[0]}
                </div>
              )}

              <h3 className="text-lg font-bold">
                {selectedUser.firstName} {selectedUser.lastName}
              </h3>

              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Gender:</strong> {selectedUser.gender}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Provider:</strong> {selectedUser.provider}</p>

              <p><strong>Messages:</strong> {selectedUser.messages ? selectedUser.messages.length : 0}</p>

              {selectedUser.confirmEmail && (
                <p><strong>Email Confirmed:</strong> {new Date(selectedUser.confirmEmail).toLocaleString()}</p>
              )}

              {selectedUser.createdAt && (
                <p><strong>Account Created:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}