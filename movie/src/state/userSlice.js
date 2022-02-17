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
            state.user=null;
        },
    },
});

export const{login,logout}= userSlice.actions;

export const selectUser= (state)=> state.user.user;

export default userSlice.reducer;