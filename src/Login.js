import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";


import { auth, db } from "./shared/firebase";

const Login = () => {
    const id_ref = React.useRef();
    const pw_ref = React.useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const checkEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

    const [btnValue, setBtnValue] = React.useState(false);

    const checkValid = () => {
        checkEmail.test(id_ref.current.value) && pw_ref.current.value.length > 5
        ? setBtnValue(true) : setBtnValue(false)
    }

    const loginCheck = () => {
        if (checkEmail.test(id_ref.current.value) === false) {
            alert("이메일 형식이 아닙니다.");
            id_ref.current.focus();
        } else if (id_ref.current.value == ""){
            alert("아이디를 입력해주세요.");
            id_ref.current.focus();
        } else if (pw_ref.current.value == ""){
            alert("비밀번호를 입력해주세요.");
            pw_ref.current.focus();
        } else {
            loginFB();
        }
    }

    const loginFB = async () => {
        const user = await signInWithEmailAndPassword(
            auth,
            id_ref.current.value,
            pw_ref.current.value
        ).catch((error) => {
            const errorCode = error.code;

            if (errorCode == "auth/wrong-password") {
                alert("아이디/비밀번호가 틀렸습니다! 확인 후 다시 입력해주세요!");
            }
        })
        console.log("user", user);
        
        if (user) {
            const user_docs = await getDocs(query(
                collection(db, "users"), where("user_id", "==", user.user.email)
            ))

            let user_data = "";
            
            user_docs.forEach((u) => {
                user_data = u.data();
            })
            
            sessionStorage.setItem("name", user_data.name);

            alert(user_data.name + "님 어서오세요!");
            navigate("/");
        }
    }

    return (
        <>
            <Container>
                <LoginForm>
                <h1 style={{margin:"0px"}}>로그인</h1>
                아이디(이메일) : <TextInput onKeyUp={checkValid} ref={id_ref} placeholder="아이디(이메일)를 입력해주세요." autoFocus></TextInput> <br />
                비밀번호 : <TextInput onKeyUp={checkValid} ref={pw_ref} placeholder="비밀번호를 입력해주세요." type="password"></TextInput> <br />
                {btnValue ? (
                    <LoginBtn btnValue={btnValue} onClick={loginCheck}>로그인하기</LoginBtn> 
                ) : (
                    <LoginBtn btnValue={btnValue}>로그인하기</LoginBtn> 
                )}
                </LoginForm>
            </Container>
        </>
    )
}


const Container = styled.div`
    width:100%;
    height: 500px;
    margin: 0 auto;
    display: flex;
    align-items: center;
`;
const LoginForm = styled.div`
    width:1000px;
    text-align: center;
    width: 600px;
    height: 300px;
    margin:0 auto;
    color : #208fff;
    font-size: 30px;
`;

const TextInput = styled.input`
    width: 300px;
`;

const LoginBtn = styled.button`
    padding: 5px 20px;
    border: ${(props) => props.btnValue ? "1px solid #99ccff" : "1px solid lightgray"}; 
    background-color: ${(props) => props.btnValue ? "#99ccff" : "lightgray"};
    color: white;
    cursor: ${(props) => props.btnValue ? "pointer" : "default"};
`;



export default Login;