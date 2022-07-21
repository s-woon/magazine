import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import styled from "styled-components";

import { auth } from "./shared/firebase";
import { deletePostThunk, loadPostThunk } from "./redux/modules/magazineSlice";
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
  }, []);

  const loginCheck = async (user) => {
    if (user) {
      setIslogin(true);
    } else {
      setIslogin(false);
    }
  };

  const deleteDocs = (e) => {
    dispatch(deletePostThunk(e.target.id))
  };

  React.useEffect(() => {
    onAuthStateChanged(auth, loginCheck);
  }, []);

  return (
    <>
      <Container>
        <WritingField>
          {posts.map((post) => {
            if(post.layout == "left") {
              return ( 
                <div>
                  <PostBox>
                    <div style={{ width: "50%" }}>
                      <img
                        alt="이미지 미리보기"
                        style={{ maxWidth: "500px", maxHeight: "300px" }}
                        src={post.img_url}
                      ></img>
                    </div>
                    <div
                      style={{
                        width: "50%",
                        border: "1px solid #99ccff",
                        minWidth: "100%",
                        maxHeight: "300px",
                      }}
                    >
                      <span>{post.text}</span>
                    </div>
                  </PostBox>
                  <div style={{ width:"1000px", marginBottom:"30px"}}>
                    <DeleteBtn id={post.id} onClick={deleteDocs}>삭제</DeleteBtn>
                  </div>
                </div>
              )
            } else if (post.layout == "right") {
              return (
                <div>
                  <PostBox>
                    <div
                      style={{
                        width: "50%",
                        border: "1px solid #99ccff",
                        minWidth: "100%",
                        maxHeight: "300px",
                      }}
                    >
                      <span>{post.text}</span>
                    </div>
                    <div style={{ width: "50%" }}>
                      <img
                        alt="이미지 미리보기"
                        style={{ maxWidth: "500px", maxHeight: "300px" }}
                        src={post.img_url}
                      ></img>
                    </div>
                  </PostBox>
                  <div style={{ width:"1000px", marginBottom:"30px"}}>
                    <DeleteBtn id={post.id} onClick={deleteDocs}>삭제</DeleteBtn>
                  </div>
                </div>
              )
            } else {
              return (
                <BottomPreviewBox>
                  <PostBox style={{ display:"block" }}>
                  <div
                      style={{
                        width: "50%",
                        border: "1px solid #99ccff",
                        minWidth: "100%",
                        maxHeight: "300px",
                      }}
                    >
                      <span>{post.text}</span>
                    </div>
                    <div style={{ width: "50%" }}>
                      <img
                        alt="이미지 미리보기"
                        style={{ maxWidth: "500px", maxHeight: "300px" }}
                        src={post.img_url}
                      ></img>
                    </div>
                  </PostBox>
                  <div style={{ width:"1000px", marginBottom:"30px"}}>
                    <DeleteBtn id={post.id} onClick={deleteDocs}>삭제</DeleteBtn>
                  </div>
                </BottomPreviewBox>
              )
            }
          })}
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
  background-color: #99ccff;
  cursor: pointer;
`;

const BottomPreviewBox = styled.div`
  display: grid;
  height: 400px;
  align-items: center;
`;

export default Home;
