import './App.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import "flowbite";
import Login from './components/Login/Login'
import Layout from './components/Layout/Layout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Signup from './components/SignUp/SignUp.jsx';
import Home from './components/Home/Home.jsx';
import ConfirmEmail from './components/ConfirmEmail/ConfirmEmail.jsx';
import Logout from './components/Logout/Logout.jsx';
import About from './components/About/About.jsx';
import { Settings } from 'lucide-react';
import Profile from './components/Profile/Profile.jsx';
import Messages from './components/Messages/Messages.jsx';
import ForgetPassword from './components/ForgetPassword/ForgetPassword.jsx';
import ResetPassword from './components/ResetPassword/ResetPassword.jsx';
import ProfileSettings from './components/ProfileSettings/ProfileSettings.jsx';
import SendMessage from './components/SendMessage/SendMessage.jsx';
import MessagesList from './components/MessagesList/MessagesList.jsx';
import MyMessages from './components/MyMessages/MyMessages.jsx';
import { GoogleLogin } from '@react-oauth/google';
import GoogleSignup from './components/GoogleSignup/GoogleSignup.jsx';
import GetShareLink from './components/GetShareLink/GetShareLink.jsx';
import PublicProfile from './components/PublicProfile/PublicProfile.jsx';
import Dashboard from './components/Admin/Dashboard.jsx';
import AdminLayout from './components/Admin/AdminLayout.jsx';
import CreateUser from './components/Admin/CreateUser.jsx';



function App() {
  const queryClient = new QueryClient();
  let router = createHashRouter([
    {
      path: '', element: <Layout />, children: [
        { index: true, element: <Signup/> },
        { path: 'login', element: <Login /> },
        { path: 'Logout', element: <Logout/> },  
        { path: 'About', element: <About/> },
        { path: 'Home', element: <Home/> },
        { path: 'ConfirmEmail', element: <ConfirmEmail/> },
        { path: 'profile', element: <Profile/> },
        { path: 'Messages', element: <Messages/> },
        { path: 'ForgetPassword', element: <ForgetPassword/> },
        { path: 'resetPassword', element: <ResetPassword /> },
        { path: 'ProfileSettings', element: <ProfileSettings /> },
        { path: 'SendMessage', element: <SendMessage/> },
        { path: 'MessagesList', element: <MessagesList/> },
        { path: 'MyMessages', element: <MyMessages/> },
        { path: 'GoogleSignup', element: <GoogleSignup/> },
        { path: 'GetShareLink', element: <GetShareLink/> },
        { path:  "/u/:shareId", element:<PublicProfile/>},
      ]},



      {path: 'admin',element: <AdminLayout/> ,children: [
        { path: 'dashboard', element: <Dashboard/> },
        { path: 'createUser', element: <CreateUser/> },

  ]
}


  ])
  return (
    <>
          <QueryClientProvider client={queryClient}>
              <RouterProvider router={router}></RouterProvider>
              <Toaster />
          </QueryClientProvider>
    </>
  )
}
export default App
