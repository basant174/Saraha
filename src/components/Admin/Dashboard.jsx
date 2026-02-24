import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaTrash } from 'react-icons/fa'

export default function Dashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/v1/user/')
        setUsers(res.data.data.users) 
        setLoading(false)
      } catch (err) {
        console.error('Error fetching users:', err)
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="p-6">
      <h4 className="font-bold mb-11 text-xl">Dashboard</h4>

      {/* كروت الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1 - Total Users */}
        <div className="relative bg-gradient-to-r from-white to-gray-50 text-black shadow rounded-xl
         p-4 hover:translate-y-[-4px] hover:shadow-lg transition-all duration-200 py-5 flex items-start">
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
            <div className="flex items-center gap-1 text-right">
              <span className="text-md font-bold text-green-600">+12%</span>
              <span className="text-sd text-gray-400 leading-tight">since last month</span>
            </div>
          </div>
        </div>

        {/* Card 2 - Total Messages */}
        <div className="relative bg-gradient-to-r from-white to-gray-50 text-black shadow rounded-xl
         p-4 hover:translate-y-[-4px] hover:shadow-lg transition-all duration-200 py-5 flex items-start">
          <div className="absolute -top-4 left-4 bg-[#156faf] rounded-xl w-12 h-12 
          flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-message text-white text-xl"></i>
          </div>
          <div className="flex-1 flex flex-col items-end pr-5 w-full">
            <span className="text-md text-gray-500 mb-1">Total Messages</span>
            <div className="w-full flex flex-col items-end mb-2">
              <div className="text-2xl font-bold text-gray-700">
                {users.reduce((acc, user) => acc + (user.messages?.length || 0), 0)}
              </div>
              <div className="border-b border-gray-200 w-full mt-1"></div>
            </div>
            <div className="flex items-center gap-1 text-right">
              <span className="text-md font-bold text-green-600">+8%</span>
              <span className="text-sd text-gray-400 leading-tight">since last week</span>
            </div>
          </div>
        </div>

        {/* Card 3 - Frozen Users */}
        <div className="relative bg-gradient-to-r from-white to-gray-50 text-black shadow rounded-xl
         p-4 hover:translate-y-[-4px] hover:shadow-lg transition-all duration-200 py-5 flex items-start">
          <div className="absolute -top-4 left-4 bg-[#156faf] rounded-xl w-12 h-12 
          flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-person-circle-xmark text-white text-2xl"></i>
          </div>
          <div className="flex-1 flex flex-col items-end pr-5 w-full">
            <span className="text-md text-gray-500 mb-1">Frozen Users</span>
            <div className="w-full flex flex-col items-end mb-2">
              <div className="text-2xl font-bold text-gray-700">0</div>
              <div className="border-b border-gray-200 w-full mt-1"></div>
            </div>
            <div className="flex items-center gap-1 text-right">
              <span className="text-md font-bold text-green-600">-2%</span>
              <span className="text-sd text-gray-400 leading-tight">this week</span>
            </div>
          </div>
        </div>

        {/* Card 4 - Delete Users */}
        <div className="relative bg-gradient-to-r from-white to-gray-50 text-black shadow rounded-xl
         p-4 hover:translate-y-[-4px] hover:shadow-lg transition-all duration-200 py-5 flex items-start">
          <div className="absolute -top-4 left-4 bg-[#156faf] rounded-xl w-12 h-12 
          flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-user-minus  text-white text-xl"></i>
          </div>
          <div className="flex-1 flex flex-col items-end pr-5 w-full">
            <span className="text-md text-gray-500 mb-1">Delete Users</span>
            <div className="w-full flex flex-col items-end mb-2">
              <div className="text-2xl font-bold text-gray-700">0</div>
              <div className="border-b border-gray-200 w-full mt-1"></div>
            </div>
            <div className="flex items-center gap-1 text-right">
              <span className="text-md font-semibold mt-1 text-red-700 leading-tight">Just updated</span>
            </div>
          </div>
        </div>
      </div>


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
                <th className="px-6 py-3 text-left text-md font-medium text-[#082c46] uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-md font-medium text-[#082c46] uppercase tracking-wider">Email</th>
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
                    <span className="text-gray-800 font-medium">{user.firstName} {user.lastName}</span>
                  </td>

        
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>

            
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="w-10 h-10 flex items-center justify-center bg-red-700 text-white rounded-lg hover:bg-red-800 transition">
                 <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}