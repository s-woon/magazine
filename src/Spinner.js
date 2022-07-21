import React from "react";
import { CircularProgress } from "@material-ui/core";
import styled from "styled-components";

const Spinner = (props) => {
  return (
    <Outter>
      <CircularProgress />
    </Outter>
  );
};

const Outter = styled.div`
background: white;
width: 100vw;
height: 100vh;
position: fixed;
top: 0;
left: 0;
display: flex;
align-items: center;
justify-content: center;
`;


export default Spinner;