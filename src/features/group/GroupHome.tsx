import React,{useLayoutEffect,useState }  from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from 'react-redux';
import { 
    endLoad,
    fetchAsyncCreateRate, 
    fetchAsyncGetGameResults, 
    fetchAsyncGetGroup,
    fetchAsyncParticipationGroup,
    fetchAsyncRateIsActive,selecGroup, 
    selectGameResults, 
    selectIsStartLoad, 
    setOpenSettings, 
    startLoad 
} from './groupSlice';
import styles from "./Group.module.css";
import GameResults from './GameResults';
import { Button, CircularProgress, makeStyles, TextField,} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { fetchAsyncGetMyProf, selectLoginUserProfile } from '../auth/authSlice';
import { 
    FacebookShareButton, 
    FacebookIcon,
    TwitterShareButton, 
    TwitterIcon,
    LineShareButton,
    LineIcon,
    EmailShareButton,
    EmailIcon,
} from 'react-share'
import Modal from "react-modal";
import GroupSettings from './GroupSettings';
import groupImage from '../auth/fish_shark.png';
const modalStyle={
    overlay: {
        background: 'rgba(0, 0, 0, 0.2)',
        zIndex:2,
      },
    content: {
        
      top: "50%",
      left: "50%",
      backgroundColor: 'white',
      width: 260,
      height: 150,
      transform: "translate(-50%, -50%)",
      },
};

const GroupHome:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const group=useSelector(selecGroup);
    const groupmember=group.profile;
    const gameresults=useSelector(selectGameResults);
    const isload=useSelector(selectIsStartLoad);
    const loginuserprofile=useSelector(selectLoginUserProfile);
    const [istrue,setIsTrue]=useState(false);
    const [password,setPassword]=useState("");
    const [isopenpasswordwindow,setIsOpenPasswordWindow]=useState(false);
    const [notmatchpass,setNotMatchPass]=useState(false);
    useLayoutEffect(()=>{
        const fetchLoader = async ()=>{
            dispatch(startLoad())
            if (localStorage.localJWT) {
                const results=await dispatch(fetchAsyncGetGroup(params.id));
                if(fetchAsyncGetGroup.fulfilled.match(results)){
                    const member:{
                        id: number;
                        nickName: string;
                        text: string;
                        userProfile: number;
                        created_on: string;
                        img: string;
                        rate_id: number;
                        group_id: number;
                        user_id: number;
                        rate: number;
                        is_active:boolean;
                    }[]=results.payload.profile
                    const profileresults=await dispatch(fetchAsyncGetMyProf());
                    if(fetchAsyncGetMyProf.fulfilled.match(profileresults)){
                        const profile: {
                            id: number;
                            nickName: string;
                            text: string;
                            userProfile: number;
                            created_at: string;
                            img: string;
                        }=profileresults.payload;
                        const isParti=member.map((m)=>{
                            return (m.userProfile===profile.userProfile && m.is_active)
                        })
                        setIsTrue(isParti.includes(true))
                    }
                }
                const res=await dispatch(fetchAsyncGetGameResults(params.id));
                if(fetchAsyncGetGameResults.fulfilled.match(res)){
                    dispatch(endLoad())
                }
            }
        };
        fetchLoader();
    },[dispatch,params.id]);


    //グループに参加
    const participationGroup=async()=>{
        if(group.password==="" || group.password===null){
            let member:number[]=[]
            let flag=true;
            let rate_id=0;
            groupmember.forEach((gm)=>{
                member.push(gm.user_id);
                if((!gm.is_active) && (gm.userProfile===loginuserprofile.userProfile)){
                    flag=false;
                    rate_id=gm.rate_id;
                }
            })
            if(flag){
                member.push(loginuserprofile.userProfile);
                const pkt={id:group.id,userGroup:member}
                const results=await dispatch(fetchAsyncParticipationGroup(pkt));
                if(fetchAsyncParticipationGroup.fulfilled.match(results)){
                    const rate_pkt={group_id:group.id,user_id:loginuserprofile.userProfile,is_active:true}
                    await dispatch(fetchAsyncCreateRate(rate_pkt));
                }
            }else{
                const rate_pkt={rate_id:rate_id,group_id:params.id,user_id:loginuserprofile.userProfile,is_active:true}
                await dispatch(fetchAsyncRateIsActive(rate_pkt));
            }
            setIsTrue(true);
            
        }else{
            setIsOpenPasswordWindow(true);
        }
    }
    const participationGroupWithPassword=async()=>{
        if (password===group.password){
            let member:number[]=[]
            let flag=true;
            let rate_id=0;
            groupmember.forEach((gm)=>{
                member.push(gm.userProfile);
                if((!gm.is_active)&& (gm.userProfile===loginuserprofile.userProfile)){
                    flag=false;
                    rate_id=gm.rate_id;
                }
            })
            if(flag){
                member.push(loginuserprofile.userProfile);
                const pkt={id:group.id,userGroup:member}
                const results=await dispatch(fetchAsyncParticipationGroup(pkt));
                if(fetchAsyncParticipationGroup.fulfilled.match(results)){
                    const rate_pkt={group_id:group.id,user_id:loginuserprofile.userProfile,is_active:true}
                    await dispatch(fetchAsyncCreateRate(rate_pkt));
                }
            }else{
                const rate_pkt={rate_id:rate_id,group_id:params.id,user_id:loginuserprofile.userProfile,is_active:true}
                await dispatch(fetchAsyncRateIsActive(rate_pkt));
            }
            setIsTrue(true);
            setNotMatchPass(false);
            setPassword("");
            setIsOpenPasswordWindow(false);
        }else{
            setNotMatchPass(true);
            setPassword("");
        }
    }
    const useStyles = makeStyles({
        table: {
            minWidth: 300,
            maxWidth:700,
            background:'white',
        },
        });
        const classes = useStyles();
    return (
        <>
            <GroupSettings/>
            <br/>
            <Button variant="outlined" color="primary" onClick={()=>history.push(`/home/`)}>ホーム</Button>
            {isload?
                <div className={styles.group_home_body_circular_container}>
                    <div>
                        <CircularProgress />
                    </div>
                </div>
            :         
                <div className={styles.group_home_container}>
                    <div className={styles.group_home_body_container}>
                        <div className={styles.group_home_body_top}>
                            <div  className={styles.group_home_body_top_groupinfo}>
                                <div className={styles.group_home_body_top_groupinfo_container}>
                                    <div>
                                        {group.img!==null?
                                            <img src={group.img} className={styles.group_img} alt="group_img"/>
                                        :   <img src={groupImage} className={styles.group_img} alt="group_img"/>
                                        }
                                    </div>
                                    <div className={styles.group_home_body_top_groupinfo_title}>
                                        <div className={styles.group_home_title}>
                                            <h2 className={styles.group_title_h2}>{group.title}</h2>
                                        </div>
                                        {group.text}
                                        <div className={styles.share_btn}>
                                            <div>
                                            <FacebookShareButton url={`http://localhost:8080/group/${params.id}` } >
                                                <FacebookIcon  round size='50px'/>
                                            </FacebookShareButton>
                                            </div>
                                            <div className={styles.share_btn_icon}>
                                            <TwitterShareButton url={`http://localhost:8080/group/${params.id}`}>
                                                <TwitterIcon  round size='50px'/>
                                            </TwitterShareButton>
                                            </div>
                                            <div className={styles.share_btn_icon}>
                                            <LineShareButton url={`http://localhost:8080/group/${params.id}`}>
                                                <LineIcon size='50px'/>
                                            </LineShareButton>
                                            </div>
                                            <div className={styles.share_btn_icon}>
                                            <EmailShareButton url={`http://localhost:8080/group/${params.id}`}>
                                                <EmailIcon size='50px'/>
                                            </EmailShareButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br/>
                        </div>
                        <div className={styles.group_home_body}>
                            {istrue?
                            <>
                                <div className={styles.group_home_container_left}>
                                    <div className={styles.group_home_menu}>
                                        <div className={styles.grouphome_btn} onClick={()=>{history.push(`/group/${params.id}/game`);window.scrollTo(0, 0);}}>
                                            <h3 className={styles.hgrouphome_menu_btn_h3}>対局 </h3>　
                                        </div>
                                        <br/>
                                        <div className={styles.grouphome_btn} onClick={()=>{history.push(`/group/${params.id}/member`);window.scrollTo(0, 0);}}>
                                            <h3 className={styles.hgrouphome_menu_btn_h3}>メンバー</h3>
                                        </div>
                                        <br/>
                                        <div className={styles.grouphome_btn} onClick={()=>{history.push(`/group/${params.id}/matchrecord`);window.scrollTo(0, 0);}}>
                                            <h3 className={styles.hgrouphome_menu_btn_h3}>対局記録</h3>
                                        </div>
                                        <br/>
                                        <div className={styles.grouphome_btn} onClick={()=>{dispatch(setOpenSettings())}}>
                                            <h3 className={styles.hgrouphome_menu_btn_h3}>　設定　</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.group_home_container_right}>
                                    <div className={styles.group_home_container_right_bottom}>
                                        <div className={styles.group_home_results}>
                                            <h3 className={styles.hgrouphome_menu_btn_h3}>直近の対局記録</h3>
                                                <Table className={classes.table} size="small" aria-label="a dense table" >
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><p className={styles.results_table_p}>日付</p></TableCell>
                                                        <TableCell><p className={styles.results_table_p}>1位</p></TableCell>
                                                        <TableCell><p className={styles.results_table_p}>2位</p></TableCell>
                                                        <TableCell><p className={styles.results_table_p}>3位</p></TableCell>
                                                        <TableCell><p className={styles.results_table_p}>4位</p></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                {gameresults.slice(0,7).map((gameresult)=>(
                                                <TableBody  key={gameresult.id} className={styles.gameresult_container}>
                                                    <GameResults  {...gameresult}/>
                                                </TableBody>
                                                ))}
                                                </Table>
                                            {/* </TableContainer> */}
                                        </div>
                                    </div>
                                </div>
                            </>:
                                <div className={styles.participation_btn_container}>
                                    <div className={styles.participation_btn_body}>
                                        <Button className={styles.participation_btn} onClick={()=>{participationGroup()}}>
                                            <h3 className={styles.participation_btn_h3}>グループに参加</h3>
                                        </Button>
                                    </div>
                                </div>
                            }
                        </div>   
                    </div>
                </div>
            }
            <Modal
                isOpen={isopenpasswordwindow}
                onRequestClose={()=>{
                    setIsOpenPasswordWindow(false);
                }}
                style={modalStyle}
                ariaHideApp={false}
            >
                <div className={styles.group_home_modal_container}>
                    {notmatchpass && <p className={styles.results_table_p_red}>パスワードが一致しません</p>}
                    <TextField
                        placeholder="パスワード"
                        type="text"
                        defaultValue={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className={styles.group_home_modal_btn}>
                        <Button
                            // disabled={password!==group.password}
                            variant="contained"
                            color="primary"
                            onClick={()=>{participationGroupWithPassword()}}
                        >
                            グループに参加
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default GroupHome
