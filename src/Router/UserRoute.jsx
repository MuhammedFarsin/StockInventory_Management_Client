// import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../Components/User/Login";
import SignUp from "../Components/User/SignUp";
import ShowProducts from "../Components/User/ShowProducts";
import ProtectedAuth from "./ProtectedAuth";
import ProtectedRoute from "./ProtectedRoute";

function UserRoute() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedAuth>
            <Login />
          </ProtectedAuth>
        }
      />
      <Route
        path="/login"
        element={
          <ProtectedAuth>
            <Login />
          </ProtectedAuth>
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedAuth>
            <SignUp />
          </ProtectedAuth>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <ShowProducts />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default UserRoute;
