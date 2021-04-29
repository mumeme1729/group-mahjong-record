import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {PROPS_CONTACT,PROPS_CREATE_GROUP} from '../types'


const apiUrl = process.env.REACT_APP_DEV_API_URL;

//所属しているグループを取得
export const fetchAsyncGetBelongToGroup = createAsyncThunk("belongtogroup/get", async () => {
    const res = await axios.get(`${apiUrl}mahjong/groupmember/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data.reverse();
});

//グループ新規作成
export const fetchAsyncCreateGroup = createAsyncThunk(
    "group/post",
    async (newGroup: PROPS_CREATE_GROUP) => {
      const groupData = new FormData();
      groupData.append("title",newGroup.title);
      groupData.append("text",newGroup.text);
      groupData.append("password",newGroup.password);
      newGroup.img && groupData.append("img", newGroup.img, newGroup.img.name);
      const res = await axios.post(`${apiUrl}mahjong/group/`, groupData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      })
      return res.data;
});

//お問い合わせ
export const fetchAsyncPostContact=createAsyncThunk(
  "contact/post",
  async (data:PROPS_CONTACT)=>{
    const res = await axios.post(`${apiUrl}mahjong/contact/`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    })
    return res.data;
  });

export const homeSlice=createSlice({
    name:'home',
    initialState:{
        backUrl:"",
        isOpenProfile:false,
        isOpenImageTrimming:false,
        belongToGroup:[{
            id: 0,
            title: "",
            text:"",
            password:"",
            img:"",
            profile:[
                {
                    id: 0,
                    nickName: "",
                    text:"",
                    userProfile: 0,
                    created_on: "",
                    img: "",
                    is_active:true,                    
                }
            ],
        }],
    },
    reducers:{
      setBackUrl(state,action){
        state.backUrl=action.payload;
      },
      resetBackUrl(state){
        state.backUrl="";
      },
      setOpenProfile(state){
        state.isOpenProfile=true;
      },
      resetOpenProfile(state){
        state.isOpenProfile=false;
      },
      setImageTrimming(state){
        state.isOpenImageTrimming=true;
      },
      resetImageTrimming(state){
        state.isOpenImageTrimming=false;
      }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchAsyncGetBelongToGroup.fulfilled, (state, action) => {
            state.belongToGroup = action.payload;
        });
      //   // builder.addCase(fetchAsyncCreateGroup.fulfilled, (state, action) => {
      //   //   return {
      //   //     ...state,
      //   //     belongToGroup: [ action.payload,...state.belongToGroup],
      //   // };
      // });
    },
});

export const {
 setBackUrl,
 resetBackUrl,
 setOpenProfile,
 resetOpenProfile,
 setImageTrimming,
 resetImageTrimming,
} = homeSlice.actions;

export const selectBelongToGroup=(state:RootState)=>state.home.belongToGroup;
export const selectBackUrl=(state:RootState)=>state.home.backUrl;
export const selectIsOpenProfile=(state:RootState)=>state.home.isOpenProfile;
export const selectIsOpenImageTrimming=(state:RootState)=>state.home.isOpenImageTrimming;
export default homeSlice.reducer;