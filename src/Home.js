import React from "react";
import {useSelector, useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import styled from "styled-components";

import { auth } from "./shared/firebase";
import {loadPostThunk} from "./redux/modules/magazineSlice"
import Spinner from "./Spinner";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [is_login, setIslogin] = React.useState(false);
  const is_loaded = useSelector((state) => state.post.is_loaded);
  const posts = useSelector((state) => state.post.posts);
  
  console.log(is_loaded, posts);

  React.useEffect(() => {
    dispatch(loadPostThunk());
  }, [])

  const loginCheck = async (user) => {
    if (user) {
      setIslogin(true);
    } else {
      setIslogin(false);
    }
  };

  const deleteDocs = (e) => {

  }

  React.useEffect(() => {
    onAuthStateChanged(auth, loginCheck);
  }, []);

  return (
    <>
      <Container>
        <WritingField>
          {posts.map(post => 
            <PostBox layout={post.layout}>
            <div style={{ width: "50%"}}>
              <img
                alt="이미지 미리보기"
                style={{ maxWidth: "500px", maxHeight: "300px"}}
                src={post.img_url}
              ></img>
            </div>
            <div style={{ width: "50%", border: "1px solid #99ccff", minWidth:"100%", maxHeight:"300px"}}>
              <span>{post.text}</span>
            </div>
            <DeleteBtn onClick={deleteDocs}>작성하기</DeleteBtn>
          </PostBox>
          )}
            
        </WritingField>


        {is_login ? (
          <span
            className="material-symbols-outlined"
            style={{
              color: "white",
              backgroundColor: "#99ccff",
              fontSize: "40px",
              borderRadius: "60px",
              padding: "10px",
              position: "fixed",
              left: "80vw",
              top: "80vh",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/add");
            }}
          >
            edit
          </span>
        ) : null}
      </Container>
      {!is_loaded && <Spinner />}
    </>
  );
};

const Container = styled.div`
  width: 1000px;
  height: 100%;
  margin: 0 auto;
  align-items: center;
`;

const WritingField = styled.div`
  width: 1000px;
  text-align: center;
  width: 600px;
  height: 300px;
  margin: 0 auto;
  color: #208fff;
  font-size: 30px;
`;

const PostBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 1000px;
`;

const DeleteBtn = styled.div`
  width: 100px;
  margin: 0px auto;
  color: white;
  border: 1px solid #99ccff;
  background-color: #99ccff;
  cursor: pointer;
`;

export default Home;
