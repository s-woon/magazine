import React, { useState } from "react";
import styled from "styled-components";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {useNavigate} from "react-router-dom";

import {auth, db} from "./shared/firebase";
import { addDoc, collection } from "firebase/firestore";

const Signup = () => {
    const navigate = useNavigate();
    const id_ref = React.useRef(null);
    const name_ref = React.useRef(null);
    const pw_ref = React.useRef(null);
    const pwCheck_ref = React.useRef(null);

    const checkEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

    const signupCheck = () => {
        if (checkEmail.test(id_ref.current.value) === false) {
            alert("이메일 형식이 아닙니다.");
            id_ref.current.focus();
        } else if (name_ref.current.value == ""){
            alert("닉네임을 입력해주세요.");
            name_ref.current.focus();
        } else if (pw_ref.current.value == ""){
            alert("비밀번호를 입력해주세요.");
            pw_ref.current.focus();
        } else if (pw_ref.current.value != pwCheck_ref.current.value){
            alert("입력하신 비밀번호가 일치하지 않습니다.");
            pw_ref.current.focus();
        } else {
            signupFB();
        }
    }

    const signupFB = async () => {
        const user = await createUserWithEmailAndPassword(
            auth,
            id_ref.current.value,
            pw_ref.current.value
        ).catch((error) =>  {
            const errorCode = error.code;
            
            if (errorCode == 'auth/email-already-in-use') {
                alert("이미 사용중인 아이디 입니다.");
            }
        })
        console.log("user", user);
        if (user) {
            const user_doc = await addDoc(collection(db, "users"), {
                user_id: user.user.email,
                name: name_ref.current?.value,
            });
            console.log("user_doc", user_doc.id);
            alert("축하합니다! 회원가입 되었습니다. 로그인페이지로 이동합니다.")
            navigate("/login");
        };
    }

    return (
        <>
            <Container>
                <SignupForm>
                <h1 style={{margin:"0px"}}>회원가입</h1>
                아이디(이메일) : <TextInput ref={id_ref} placeholder="아이디(이메일)를 입력해주세요." autoFocus></TextInput> <br />
                닉네임 : <TextInput ref={name_ref} placeholder="닉네임을 입력해주세요."></TextInput> <br />
                비밀번호 : <TextInput ref={pw_ref} placeholder="비밀번호를 입력해주세요. (6자 이상)" type="password"></TextInput> <br />
                비밀번호 확인 : <TextInput ref={pwCheck_ref} placeholder="비밀번호를 한번 더 입력해주세요." type="password"></TextInput> <br />
                <SignupBtn onClick={signupCheck} >가입하기</SignupBtn>
                </SignupForm>
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
const SignupForm = styled.div`
    width: 1000px;
    text-align: center;
    width: 600px;
    height: 300px;
    margin:0 auto;
    color : #208fff;
    font-size: 30px;
`;

const SignupBtn = styled.button`
    padding: 5px 20px;
    border: 1px solid #99ccff;
    background-color: #99ccff;
    color: white;
    cursor: pointer;
    &:hover{
        background-color: white;
        color: #99ccff;
    }
`;

const TextInput = styled.input`
    width: 300px;
`;

export default Signup;