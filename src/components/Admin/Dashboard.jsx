import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CreateUser from './CreateUser';

export default function Dashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
 const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");      
        const res = await axios.get('/api/v1/admin/', {
          headers: { Authorization: `ADMIN ${token}` }
        });
        setUsers(res.data.data.users); 
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const totalMessages = Array.isArray(users)
    ? users.reduce((acc, user) => acc + (user.messages?.length || 0), 0)
    : 0;

  const frozenCount = Array.isArray(users)
    ? users.filter(user => user.freezedAt).length
    : 0;

  const adminCreatedCount = Array.isArray(users)
    ? users.filter(user => user.role === 'ADMIN').length
    : 0;

  return (
    <div className="p-6">
      <h4 className="font-bold mb-11 text-xl">Dashboard</h4>

      {/* ====== Statistics Cards ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        {/* Total Users */}
        <div className="relative bg-gradient-to-r from-white to-gray-50 text-black shadow rounded-xl
         p-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 py-5 flex items-start">
          <div className="absolute -top-4 left-4 bg-[#156faf] rounded-xl w-12 h-12 
          flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-user text-white text-xl"></i>
          </div>
          <div className="flex-1 flex flex-col items-end pr-5 w-full">
            <span className="text-md text-gray-500 mb-1">Total Users</span>
            <div className="w-full flex flex-col items-end mb-2">
              <div className="text-2xl font-bold text-gray-700">{users.length}</div>
              <div className="border-b border-gray-200 w-full mt-1"></div>
            </div>
          </div>
        </div>

        {/* Total Messages */}
        <div className="relative bg-gradient-to-r from-white to-gray-50 text-black shadow rounded-xl
         p-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 py-5 flex items-start">
          <div className="absolute -top-4 left-4 bg-[#156faf] rounded-xl w-12 h-12 
          flex items-center justify-center shadow-lg">
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

        {/* Frozen Users */}
        <div className="relative bg-gradient-to-r from-white to-gray-50 text-black shadow rounded-xl
         p-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 py-5 flex items-start">
          <div className={`absolute -top-4 left-4 rounded-xl w-12 h-12 
          flex items-center justify-center shadow-lg 
          ${frozenCount > 0 ? 'bg-red-600' : 'bg-[#156faf]'}`}>
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

        {/* Admin Created Users */}
        <div className="relative bg-gradient-to-r from-white to-gray-50 text-black shadow rounded-xl
         p-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 py-5 flex items-start">
          <div className="absolute -top-4 left-4 bg-[#156faf] rounded-xl w-12 h-12 
          flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-user-minus text-white text-xl"></i>
          </div>
          <div className="flex-1 flex flex-col items-end pr-5 w-full">
            <span className="text-md text-gray-500 mb-1">Admin Created Users</span>
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
    className="bg-[#156faf] text-white px-5 py-2 rounded-lg hover:bg-[#0f5485] transition"
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-md font-medium text-[#082c46] uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-md font-medium text-[#082c46] uppercase">
                  Email
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <div className="bg-gray-200 w-10 h-10 flex items-center justify-center rounded-full text-xl">
                      <i className="fa-regular fa-user"></i>
                    </div>
                    <span className="text-gray-800 font-medium">
                      {user.firstName} {user.lastName}
                      {user.freezedAt && (
                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                          Frozen
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="w-10 h-10 flex items-center justify-center bg-red-700 text-white rounded-lg hover:bg-red-800 transition">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="  p-6 w-[320px]">
      {/* الفورم فقط */}
      <CreateUser
        onSuccess={() => {
          setShowModal(false);
          fetchUsers();
        }}
      />

      {/* الغاء المودال يكون زر صغير فوق الفورم أو في الأعلى */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  )
}