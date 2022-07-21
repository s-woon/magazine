import "./App.css";
import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import styled from "styled-components";

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Header from "./Header";
import Post from "./Post";

function App() {

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add" element={<Post />} />
      </Routes>
    </div>
  );
}

export default App;
