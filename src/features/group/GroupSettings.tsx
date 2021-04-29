import React, { useState } from 'react'
import Modal from "react-modal";
import { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAsyncRateIsActive, fetchAsyncUpdateGroup, resetOpenSettings, selecGroup, selectOpenSettings, setOpenGroupImageTrimming } from './groupSlice';
import { Button, IconButton, TextField } from '@material-ui/core';
import GroupImageTrimming from './GroupImageTrimming';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import { selectLoginUserProfile } from '../auth/authSlice';
import { useHistory, useParams } from 'react-router-dom';
import styles from "./Group.module.css";

const modalStyle={
    overlay: {
        background: 'rgba(0, 0, 0, 0.2)',
        zIndex:4,
      },
    content: {  
      top: "50%",
      left: "50%",
      backgroundColor: 'white',
      width: 260,
      height: 520,
      transform: "translate(-50%, -50%)",
      },
};
const modalStyle2={
    overlay: {
        background: 'rgba(0, 0, 0, 0.2)',
        zIndex:6,
      },
    content: {  
      top: "50%",
      left: "50%",
      backgroundColor: 'white',
      width: 280,
      height: 180,
      transform: "translate(-50%, -50%)",
      },
};

const GroupSettings:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const isopensettings=useSelector(selectOpenSettings);
    const group=useSelector(selecGroup);
    const [title,setTitle]=useState("");
    const [text,setText]=useState("");
    const [password,setPassword]=useState("");
    const [openleavegroup,setOpenLeaveGroup]=useState(false);
    const groupmember=group.profile;
    const loginuserprofile=useSelector(selectLoginUserProfile);
    const history = useHistory();
    const params = useParams<{ id: string }>();
    
    const updateGroup = async () => {
        let updateTitle=title;
        let updateText=text;
        let updatePassword=password;
        if(updateTitle===""){updateTitle=group.title}
        if(updateText===""){updateText=group.text}
        if(updatePassword===""){updatePassword=group.password}
        const packet = { id: group.id, title:updateTitle,text:updateText,password:updatePassword};
        await dispatch(fetchAsyncUpdateGroup(packet));   
        dispatch(resetOpenSettings());
    };

    const openConfirmModal=()=>{
        setOpenLeaveGroup(true);
    }

    const leaveGroup=async()=>{
        let rate_id:number=0;
            groupmember.forEach((gm)=>{
                if(gm.userProfile===loginuserprofile.userProfile){
                    rate_id=gm.rate_id
                }
            })
        const rate_pkt={rate_id:rate_id,group_id:params.id,user_id:loginuserprofile.userProfile,is_active:false}
        const results=await dispatch(fetchAsyncRateIsActive(rate_pkt));
        if(fetchAsyncRateIsActive.fulfilled.match(results)){
            dispatch(resetOpenSettings());
            history.push('/home');
        }
    }
    
    return (
        <>
            <Modal
                isOpen={isopensettings}
                onRequestClose={()=>{
                    dispatch(resetOpenSettings());
                }}
                style={modalStyle}
                ariaHideApp={false}
            >   
                {group.img!==null?
                    <img src={group.img} onClick={()=>{dispatch(setOpenGroupImageTrimming())}} width="150px" height="170px" className={styles.groupsetting_modal_img} alt="setting_img"/>
                :
                <IconButton onClick={()=>{dispatch(setOpenGroupImageTrimming())}}>
                    <PhotoLibraryIcon /> 画像を選択
                </IconButton>}
                <GroupImageTrimming/>
                <br/>
                <div>
                    <TextField placeholder="名前" type="text" defaultValue={group.title} label="グループ名" 
                        helperText={`${title.length}/30`}
                        onChange={(e) => {
                            if(e.target.value.length<=30){
                                setTitle(e.target.value)
                            }
                        }}/>
                </div>
                    <TextField placeholder="紹介" type="text" defaultValue={group.text} multiline fullWidth label="紹介"
                        helperText={`${text.length}/200`}
                        onChange={(event) => {
                            if(event.target.value.length<=199){
                                setText(event.target.value)
                            }
                        }}/>
                <br />
                <br />
                    <TextField placeholder="パスワード" type="text" defaultValue={group.password} multiline fullWidth label="パスワード"
                        onChange={(event) => {
                            if(event.target.value.length<=199){
                                setPassword(event.target.value)
                            }
                        }}/>
                <br />
                <div className={styles.groupsetting_btn}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={updateGroup}
                    >
                        更新
                    </Button>
                </div>
                <br/>
                <p
                    onClick={()=>{openConfirmModal()}}
                    className={styles.leavegroup}
                >
                    グループから抜ける
                </p>
            </Modal>
            <Modal
                isOpen={openleavegroup}
                onRequestClose={()=>{
                    setOpenLeaveGroup(false);
                }}
                style={modalStyle2}
                ariaHideApp={false}
            >
                <div>
                    <p className={styles.leavegroup_p}>本当にグループを抜けますか？</p>
                    <p className={styles.leavegroup_p_c}> ※ グループを抜けても対局記録は消えません</p>
                </div>
                <div className={styles.leavegroup_container}>
                    <div className={styles.leavegroup_body}>
                        <Button
                            variant="contained" color="secondary"
                            onClick={()=>{leaveGroup()}}
                        >
                            OK
                        </Button>
                    </div>
                    <div className={styles.leavegroup_body}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={()=>{setOpenLeaveGroup(false)}}
                        >
                            キャンセル
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default GroupSettings
