import React from "react";
import Navbar from "../components/Navbar";
import { Home } from "lucide-react";
import HomePage from "../pages/public/HomePage";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default UserLayout;
