import React from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {auth, storage} from "./shared/firebase";
import {addPostThunk} from "./redux/modules/magazineSlice"


const Post = () => {
  const navigate = useNavigate();
  
  const fileName_ref = React.useRef(null);
  const textArea_ref = React.useRef(null);
  const left_ref = React.useRef(null);
  const right_ref = React.useRef(null);
  const bottom_ref = React.useRef(null);
  const file_link_ref = React.useRef(null);
  
  // 레이아웃 설정
  const [postLayout, setpostLayout] = React.useState("left");
  const changeLayout = (e) => {
    setpostLayout(e.target.id)
  }
  React.useEffect(() => {
    if (postLayout == "left") {
      left_ref.current.style.display = "flex";
      right_ref.current.style.display = "none";
      bottom_ref.current.style.display = "none";
    } else if (postLayout == "right") {
      left_ref.current.style.display = "none";
      right_ref.current.style.display = "flex";
      bottom_ref.current.style.display = "none";
    } else {
      left_ref.current.style.display = "none";
      right_ref.current.style.display = "none";
      bottom_ref.current.style.display = "inline";
    }
  }, [postLayout])
  

  // 이미지 미리보기
  const [fileImage, setFileImage] = React.useState(null);
  const fileuploaded = async (e) => {
    const file = e.target.files[0];
    fileName_ref.current.value = e.target.files[0].name;
    setFileImage(URL.createObjectURL(file));

    // 파이어베이스에 업로드
    const uploaded_file = await uploadBytes(
      ref(storage, `images/${e.target.files[0].name}`),
      e.target.files[0]
    );

    const file_url = await getDownloadURL(uploaded_file.ref);
    file_link_ref.current = {url: file_url};
  };

  // 버튼 활성화 체크, 텍스트 프리뷰
  const [btnValue, setBtnValue] = React.useState(false);
  const [previewText, setpreviewText] = React.useState(null);
  const checkValid = () => {
    setpreviewText(textArea_ref.current.value);
    fileName_ref.current.value && textArea_ref.current.value
    ? setBtnValue(true) : setBtnValue(false)
  };

  
  // 포스트
  const dispatch = useDispatch();
  const time = new Date();
  const post = () => {
    const post_data = {
      uid : auth.currentUser.uid,
      createAt : time,
      img_url : file_link_ref.current.url,
      text : textArea_ref.current.value,
      layout : postLayout
    }
    dispatch(addPostThunk({ ...post_data })).then(() => {
      alert("포스팅 성공");
      navigate("/");
    })
  }

  return (
    <>
      <Container>
        <WritingField>
          <div style={{ display: "flex" }}>
            <Layout id="left" onClick={changeLayout}>왼쪽에 이미지, 오른쪽에 글</Layout>
            <Layout id="right" onClick={changeLayout}>오른쪽에 이미지, 왼쪽에 글</Layout>
            <Layout id="bottom" onClick={changeLayout}>위쪽에 글, 아래쪽에 이미지</Layout>
          </div>
          <LayoutBox style={{padding: "10px"}}>
            <h2>미리보기</h2>
            <PreviewBox ref={left_ref} className="leftLayout">
              <div style={{ width: "50%"}}>
                <img
                  alt="이미지 미리보기"
                  style={{ maxWidth: "500px", maxHeight: "300px"}}
                  src={fileImage}
                ></img>
              </div>
              <div style={{ width: "50%", border: "1px solid #99ccff", minHeight:"300px", maxHeight:"300px"}}>
                <span>{previewText}</span>
              </div>
            </PreviewBox>
            <PreviewBox ref={right_ref} className="rightLayout">
              <div style={{ width: "50%", border: "1px solid #99ccff", minHeight:"300px", maxHeight:"300px"}}>
                <span>{previewText}</span>
              </div>
              <div style={{ width: "50%"}}>
                <img
                  alt="이미지 미리보기"
                  style={{ maxWidth: "500px", maxHeight: "300px"}}
                  src={fileImage}
                ></img>
              </div>
            </PreviewBox>
            <BottomPreviewBox ref={bottom_ref} className="bottomLayout">
            <div style={{ width: "100%", border: "1px solid #99ccff", minHeight:"300px", maxWidth:"500px", margin:"10px auto"}}>
                <span>{previewText}</span>
              </div>
              <div style={{ width: "100%"}}>
                <img
                  alt="이미지 미리보기"
                  style={{ minWidth: "500px", minHeight: "300px", maxWidth:"1000px", maxHeight:"500px"}}
                  src={fileImage}
                ></img>
              </div>
            </BottomPreviewBox>
          </LayoutBox>
          <InputBox>
            <FileUploadBox>
              <UploadName onChange={checkValid} ref={fileName_ref} placeholder="첨부파일" disabled />
              <UploadBtn htmlFor="file">파일업로드</UploadBtn>
              <File type="file" id="file" onChange={fileuploaded} />
            </FileUploadBox>
            <TextAreaBox>
              <TextArea onKeyUp={checkValid} placeholder="여기에 입력하세요." ref={textArea_ref}></TextArea>
            </TextAreaBox>
          </InputBox>
          <div style={{width:"300px", margin:"0px auto 300px auto", display:"flex"}}>
          <PostBtn btnValue={btnValue} onClick={post}>작성하기</PostBtn>
          <CancelBtn btnValue={btnValue} onClick={() => {navigate("/")}}>취소하기</CancelBtn>
          </div>
        </WritingField>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

const WritingField = styled.div`
  width: 1000px;
  text-align: center;
  margin: 0 auto;
  color: #208fff;
  font-size: 30px;
`;

const Layout = styled.div`
  margin: 10px auto;
  padding: 10px;
  border-radius: 200px;
  width: 200px;
  height: 40px;
  background-color: #99ccff;
  color: white;
  cursor: pointer;
`;

const LayoutBox = styled.div`
  border: 1px solid #99ccff;
  margin: 0px auto;
`;

const PreviewBox = styled.div`
  display: flex;
  height: 400px;
`;

const BottomPreviewBox = styled.div`
  display: grid;
  height: 400px;
  align-items: center;
`;

const InputBox = styled.div`
  margin: 10px 0px;
  display: flex;
  align-items: center;
`;

const FileUploadBox = styled.div`
  width: 50%;
`;

const UploadName = styled.input`
  display: inline-block;
  height: 40px;
  padding: 0 10px;
  vertical-align: middle;
  border: 1px solid #dddddd;
  width: 50%;
  margin-right: 10px;
  color: #999999;
`;

const UploadBtn = styled.label`
  background-color: #99ccff,
  padding: 0px 10px,
  color: white,
  borderRadius: 100px,
`;

const File = styled.input`
  display: none;
`;

const TextAreaBox = styled.div`
  width: 45%;
`;

const TextArea = styled.textarea`
  padding: 10px 10px;
  border: 1px solid #dddddd;
  width: 100%;
  outline-color: #99ccff;
  resize: none;
  margin: 0px;
  margin-bottom: 20px;
  height: 200px;
`;

const PostBtn = styled.div`
  width: 100px;
  margin: 0px auto;
  color: white;
  border: ${(props) => props.btnValue ? "1px solid #99ccff" : "1px solid lightgray"}; 
  background-color: ${(props) => props.btnValue ? "#99ccff" : "lightgray"};
  cursor: ${(props) => props.btnValue ? "pointer" : "default"};
`;

const CancelBtn = styled.div`
  width: 100px;
  margin: 0px auto;
  color: white;
  border: 1px solid #99ccff;
  background-color: #99ccff;
  cursor: pointer;
`;

export default Post;
