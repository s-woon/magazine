import { extractQuerystring } from "@firebase/util";
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { collection, doc, getDocs, addDoc, deleteDoc } from "firebase/firestore";

import { db } from "../../shared/firebase"

export const addPostThunk = createAsyncThunk(
    'post/create',
    async(post) => {
        console.log("durl")
        console.log(post);
        const doc = await addDoc(collection(db, "posts"), {...post})
        const res = [doc.id, {...post}]
        return res
    }
)

export const loadPostThunk = createAsyncThunk(
    'post/load',
    async () => {
        const docs = await getDocs(collection(db, "posts"));

        let docs_list = [];

        docs.forEach((d) => {
            docs_list.push({id : d.id, ...d.data()})
        })
        return docs_list
    }
)

export const deletePostThunk = createAsyncThunk(
    'post/delete',
    async (id) => {
        const docRef = doc(db, "posts", id);
        await deleteDoc(docRef);
        return id
    }
)

const postSlice = createSlice({
    name: "post",
    initialState: {
        is_loaded : false,
        posts : []
    },
    reducers: {
        
    },
    extraReducers : (builder) => {
        builder.addCase(addPostThunk.fulfilled, (state, action) => {
            state.posts.unshift(action.payload)
        })
        builder.addCase(loadPostThunk.fulfilled, (state, action) => {
            console.log(action.payload);
            state.posts = action.payload;
            state.is_loaded = true;
        })
        builder.addCase(deletePostThunk.fulfilled, (state, action) => {
            const new_post_list = state.posts.filter((l, idx) => {
                return action.payload !== l.id;
            })
            state.posts = new_post_list;
        })
    }
});

export default postSlice.reducer;