import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    //name of the store
    name:"user",

    //initial state is null because the user is not logged in
    initialState: {
        user: null
    },
    reducers:{
        //action is the data that will be passed in
        login: (state,action)=>{
            state.user= action.payload;
        },
        logout: (state)=>{
            sessionStorage.removeItem("token");
            state.user=null;
        },
        //filter out the likes id
        unlike:(state,action)=>{
            state.user.likes=state.user.likes.filter(like => like.id !== action.payload);
        },
        //add like id onto like array
        like:(state,action)=>{
            state.user.likes.push(action.payload);
        }
    },
});

export const{login,logout,unlike,like}= userSlice.actions;

export const selectUser= (state)=> state.user.user;

export default userSlice.reducer;