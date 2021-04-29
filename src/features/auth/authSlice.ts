import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {PROPS_AUTHEN, PROPS_PASSWORD_CONFIRM, PROPS_PROFILE, PROPS_UPDATE_PROFILE, PROPS_UPDATE_PROFILE_IMAGE} from '../types'

const apiUrl = process.env.REACT_APP_DEV_API_URL;

//新規登録
export const fetchAsyncRegister=createAsyncThunk(
    "auth/register",
    async (auth: PROPS_AUTHEN) => {
        const res = await axios.post(`${apiUrl}mahjong/register/`, auth, {
          headers: {
            "Content-Type": "application/json",
          },
        }).catch(error=>{
          return error.response
        });
        return res.data;
    }
);

//有効化
export const fetchAsyncActivateUser = createAsyncThunk("activate/get", async (token:string) => {
  const res = await axios.get(`${apiUrl}mahjong/activate/${token}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
});
//ユーザーが存在するか
export const fetchAsyncGetUser=createAsyncThunk(
  "user/get",
  async (email: string) => {
    const res = await axios.get(`${apiUrl}mahjong/checkuser/${email}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);
//プロフィール作成
export const fetchAsyncCreateProf = createAsyncThunk(
  "profile/post",
  async (nickName: PROPS_PROFILE) => {
    const res = await axios.post(`${apiUrl}mahjong/profile/`, nickName, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);
//アップデート(プロフィール以外)
export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/put",
  async (profile:PROPS_UPDATE_PROFILE) => {
    const res = await axios.put(
      `${apiUrl}mahjong/profile/${profile.id}/`,
      profile,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);
export const fetchAsyncUpdateProfImage = createAsyncThunk(
  "profileimage/put",
  async (profileimage:PROPS_UPDATE_PROFILE_IMAGE ) => {
    const uploadData = new FormData();
    uploadData.append("nickName", profileimage.nickName);
    uploadData.append("text", profileimage.text);
    profileimage.img &&uploadData.append("img",profileimage.img,profileimage.name);
    const res = await axios.put(
      `${apiUrl}mahjong/profile/${profileimage.id}/`,
      uploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    )
    
    return res.data;
  }
);
//ログイン
export const fetchAsyncLogin = createAsyncThunk(
    "auth/post",
    async (authen: PROPS_AUTHEN) => {
      const res = await axios.post(`${apiUrl}authen/jwt/create`, authen, {
        headers: {
          "Content-Type": "application/json",
        },
      }).catch(error=>{
        return error.response
      });
      return res.data;
      //取得に成功したらローカルに保存
    }
);

//ログインしたユーザーのプロフィール
export const fetchAsyncGetMyProf = createAsyncThunk("profile/get", async () => {
  const res = await axios.get(`${apiUrl}mahjong/loginuserprofile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data[0];
});
//パスワードリセット
export const fetchAsyncPasswordReset = createAsyncThunk(
  "passwordreset/post",
  async (email: {email:string}) => {
    const res = await axios.post(`${apiUrl}mahjong/auth/password_reset/`, email, {
      headers: {
        "Content-Type": "application/json",
      },
    }).catch(error=>{
      return error.response
    });
    return res.data;
  }
);
//パスワード再設定
export const fetchAsyncPasswordConfirm=createAsyncThunk(
  "passwordconfirm/post",
  async(password:PROPS_PASSWORD_CONFIRM)=>{
    const res = await axios.post(`${apiUrl}rest-auth/password/reset/confirm/`, password, {
      headers: {
        "Content-Type": "application/json",
      },
    }).catch(error=>{
      return error.response
    });
    return res.data;
  }
);

export const authSlice=createSlice({
    name:'auth',
    initialState:{
      openSignIn: true,
      login_user_profile: {
        id: 0,
        nickName: "",
        text:"",
        userProfile: 0,
        created_at: "",
        img: "",
      },
    },
    reducers:{
      setOpenSignIn(state) {
        state.openSignIn = true;
      },
      resetOpenSignIn(state) {
        state.openSignIn = false;
      },
    },
    extraReducers:(builder)=>{
        //ログインが成功したらjwtをローカルに保存
        builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
            if(action.payload.detail!=="No active account found with the given credentials"){
              localStorage.setItem("localJWT", action.payload.access);
            };
        });
        builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
          state.login_user_profile = action.payload;
        }); 
        builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
          state.login_user_profile = action.payload;
        });    
        builder.addCase(fetchAsyncUpdateProfImage.fulfilled,(state,action)=>{
          state.login_user_profile=action.payload;
        }); 
    },
});

export const {
  setOpenSignIn,
  resetOpenSignIn,
} = authSlice.actions;

export const selectLoginUserProfile = (state: RootState) => state.auth.login_user_profile;
export const selectOpenSignIn=(state:RootState)=>state.auth.openSignIn;
export default authSlice.reducer;