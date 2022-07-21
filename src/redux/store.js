import {configureStore} from "@reduxjs/toolkit";
import postReducer from "./modules/magazineSlice";

const store = configureStore({reducer: {
    post: postReducer,
}});

export default store;