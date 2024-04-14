import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate,useParams } from "react-router-dom"; // Import Navigate and useParams
import Header from "./components/Menu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./layout";
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import Login from "./Pages/AuthPage/signin";
import UpdatePassword from "./Pages/AuthPage/UpdatePassword";
import UserCreation from "./Pages/UserPage/UserCreation";
import AddCertifications from "./Pages/SKillPage/addCertifications";
import HandleApprove from "./Pages/SKillPage/HandleApprove";
import ForgotPassword from "./Pages/AuthPage/ForgotPassword";
import UserPage from "./Pages/UserPage/UserPage";
import Profile from "./Pages/UserPage/Profile";
import UserDetails from "./Pages/UserPage/UserDetails";
import Adminpage from "./Pages/UserPage/Adminpage";
import ApproverPage from "./Pages/UserPage/ApproverPage";
import UpdateProfiles from "./Pages/UserPage/UpdateProfiles"
import AuthService from "./Services/AuthService";
import { toast } from 'react-toastify';
const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const expired = await AuthService.checkSession(token);
          if (expired) {
            toast.success("Your Session Expired . Please Log in again!");
            navigate("/");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("username");
          } 
        } catch (error) {
          console.error("Error checking session:", error);
        }
      }
    };
  
    checkToken();
  }, []);
  
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/user-menu" element={<UserMenu />} />
          <Route path="/create-user" element={<ProtectedAddUser />} />
          <Route path="/updateprofile/:userId" element={<ProtectedUpdateProfile />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/add-certifications/:userId"
            element={<ProtectedAddCertifications />}
          />
          <Route path="/users/:userId/:skillId" element={<AddWithUserId />} />
          <Route path="/user-page/:userId" element={<ProjectDetailsUserId />} />
          <Route path="/adminpage" element={<Adminpage/>}/>
          <Route path="/userprofiles" element={<UserDetails/>}/>
          <Route path="/approverpage" element={<ApproverPage/>}/>
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
};
const UserMenu = () => {
  return <Header />;
};

const ProtectedAddCertifications = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  if (localStorage.getItem("role") !== "admin") {
    return isAuthenticated ? (
      <AddCertificationsWithUserId />
    ) : (
      <Navigate to="/" />
    );
  } else {
    return <Navigate to="/" />;
  }
};

const ProtectedAddUser = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (localStorage.getItem("role") === "admin") {
    return isAuthenticated ? <UserCreation /> : <Navigate to="/" />;
  } else {
    return <Navigate to="/" />;
  }
};

const AddCertificationsWithUserId = () => {
  const { userId } = useParams(); 
  return <AddCertifications userId={userId} />;
};
const ProtectedUpdateProfile = () => {
  const { userId } = useParams();
  return <UpdateProfiles userId={userId} />;
};

const AddWithUserId = () => {
  const { userId } = useParams(); 
  const { skillId }= useParams();
  return <HandleApprove userId={userId} skillId={skillId}/>;
};

const ProjectDetailsUserId = () => {
  const { userId } = useParams()
  return <UserPage userId={userId} />;
};

export default App;



