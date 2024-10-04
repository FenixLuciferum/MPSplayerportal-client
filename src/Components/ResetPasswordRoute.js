import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";


const ResetPasswordRoute = () => {

  const pageparams = useParams();

  const token = localStorage.getItem("passwordstore");
  const comparedtoken = (pageparams.token).substring(1);

  debugger;
  
  if (!token) return <Navigate to="/" />;
  if (token !== comparedtoken) return <Navigate to="/" />;
  
  return <Outlet />;
};

export default ResetPasswordRoute;