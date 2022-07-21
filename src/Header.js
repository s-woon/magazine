import "./App.css";
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";

import { auth } from "./shared/firebase";

const Header = () => {
  const navigate = useNavigate();
  const [is_login, setIslogin] = React.useState(false);

  const loginCheck = async () => {
    if (sessionStorage.getItem("name")) {
      setIslogin(true);
    } else {
      setIslogin(false);
    }
  };

  React.useEffect(() => {
    loginCheck();
  }, [sessionStorage.getItem("name")]);

  return (
    <>
      <Headerbar>
        <span
          className="material-symbols-rounded"
          style={{
            cursor: "pointer",
            fontSize: "40px",
            margin: "20px 30px",
            padding: "10px",
            color: "#99ccff",
            border: "1px solid #99ccff",
            borderRadius: "40px",
          }}
          onClick={() => {
            navigate("/");
          }}
          title="홈으로"
        >
          home
        </span>
        {is_login ? <Logined /> : <NotLogined /> }
      </Headerbar>
    </>
  );
};

const NotLogined = () => {
  const navigate = useNavigate();
  return (
    <div style={{ float: "right" }}>
      <span
        className="material-symbols-rounded"
        style={{
          cursor: "pointer",
          fontSize: "40px",
          margin: "20px 10px",
          padding: "10px",
          color: "#99ccff",
          border: "1px solid #99ccff",
          borderRadius: "40px",
        }}
        onClick={() => {
          navigate("/signup");
        }}
        title="회원가입"
      >
        person_add
      </span>
      <span
        className="material-symbols-rounded"
        style={{
          cursor: "pointer",
          fontSize: "40px",
          margin: "20px 10px",
          padding: "10px",
          color: "#99ccff",
          border: "1px solid #99ccff",
          borderRadius: "40px",
        }}
        onClick={() => {
          navigate("/login");
        }}
        title="로그인"
      >
        login
      </span>
    </div>
  );
};

const Logined = () => {
  const navigate = useNavigate();
  let user_name = "";
  if (sessionStorage.getItem("name")) {
    user_name = sessionStorage.getItem("name")
  }
  return (
    <div style={{ float: "right", display: "flex", alignItems: "center"}}>
        <span style={{ fontSize:"40px", color:"#99ccff", marginRight:"30px" }}>환영합니다! <strong>{user_name}</strong> 님</span>
      <span
        className="material-symbols-rounded"
        style={{
          cursor: "pointer",
          fontSize: "40px",
          margin: "20px 10px",
          padding: "10px",
          color: "#99ccff",
          border: "1px solid #99ccff",
          borderRadius: "40px",
        }}
        onClick={() => {
          signOut(auth);
          sessionStorage.clear();
          alert("다음에 또 와주세요!");
          navigate("/");
          
        }}
        title="로그아웃"
      >
        logout
      </span>
    </div>
  );
};

const Headerbar = styled.div`
  width: 1000px;
  height: 100px;
  margin: 0 auto;
`;

export default Header;
