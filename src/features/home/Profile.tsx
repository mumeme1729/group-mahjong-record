import { Avatar, Button, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import Modal from "react-modal";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory} from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { fetchAsyncUpdateProf, selectLoginUserProfile } from '../auth/authSlice';
import { resetBackUrl, resetOpenProfile, selectIsOpenProfile, setImageTrimming } from './homeSlice';
import ImageTrimming from './ImageTrimming';
import styles from "./Home.module.css";
import { ContactsOutlined } from '@material-ui/icons';

const modalStyle={
    overlay: {
        background: 'rgba(0, 0, 0, 0.2)',
        zIndex:8,
      },
    content: {
        
        top: "50%",
      left: "50%",
      backgroundColor: 'white',
      width: 260,
      height: 450,
      transform: "translate(-50%, -50%)",
      },
};
const Profile:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const isopenprofile=useSelector(selectIsOpenProfile);
    const profile=useSelector(selectLoginUserProfile);
    const [name,setName]=useState("");
    const [text,setText]=useState("");
    const history = useHistory();
    let proftext=profile.text;
    if(proftext){
        proftext=""
    }
    const updateProfile = async () => {
        let updateName=name;
        let updateText=text;
        if(updateName===""){updateName=profile.nickName}
        if(updateText===""){updateText=profile.text}
        if(updateText===null){updateText=""}
        const packet = { id: profile.id, nickName: updateName,text:updateText};
        await dispatch(fetchAsyncUpdateProf(packet));   
        dispatch(resetOpenProfile());
    };
    function logout(){
        localStorage.removeItem("localJWT");
        dispatch(resetBackUrl());
        dispatch(resetOpenProfile());
        history.push('/');
    }
    return (
        <Modal
            isOpen={isopenprofile}
            onRequestClose={async () => {
                dispatch(resetOpenProfile());
            }}
            style={modalStyle}
            ariaHideApp={false}
        >
            <div>
                <h2>プロフィールを編集</h2>
                <div>
                    <Button onClick={()=>{dispatch(setImageTrimming())}}>
                        <Avatar alt="who?" src={profile.img} style={{height:'70px',width:'70px'}}/>
                    </Button>
                    <ImageTrimming/>
                    <div>
                        <TextField placeholder="名前" type="text" defaultValue={profile.nickName} label="名前"
                            onChange={(e) => {
                                if(e.target.value.length<=20){
                                    setName(e.target.value)}
                                }
                            }/>
                    </div>
                </div>
                <br />
                <TextField placeholder="自己紹介" type="text" defaultValue={proftext} multiline fullWidth label="自己紹介"
                    onChange={(event) => {
                        if(event.target.value.length<=200){
                            setText(event.target.value)
                        }
                    }}/>
                
                <div className={styles.profile_btn_container}>
                    <div className={styles.profile_btn}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={updateProfile}
                        >
                            プロフィール更新
                        </Button>
                    </div>
                    <div className={styles.profile_btn}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={logout}
                        >
                            ログアウト
                        </Button>
                    </div>
                </div>
            </div> 
        </Modal>
    )
}

export default Profile
