import React,{useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory, useLocation} from 'react-router-dom';
import { AppDispatch } from "../../app/store";
import { fetchAsyncGetMyProf, selectLoginUserProfile } from '../auth/authSlice';
import { setBackUrl, setOpenProfile } from './homeSlice';
import styles from "./Home.module.css";
import { Avatar, Button} from '@material-ui/core';
import img from './same.svg'
import Profile from './Profile';



const Header:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const loginUserProfile=useSelector(selectLoginUserProfile);
    
    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                await dispatch(fetchAsyncGetMyProf());//ログインしているユーザーのプロフィールを取得する
                //await dispatch(fetchAsyncGetBelongToGroup());
                if(location.pathname==='/'){
                    history.push('/home');
                }
            }else{
                if(!location.pathname.includes('/activate')){
                    dispatch(setBackUrl(location.pathname));
                    if(!location.pathname.includes('/password_confirm')){
                        history.push('/');
                    }
                }
            }
        };
        fetchLoader();
    },[dispatch,history,location.pathname]);

    return (
        <>
            {location.pathname!=='/'?
            <div className={styles.header_container}>
                <div className={styles.header_body}>
                    <Link to='/home' className={styles.header_link}>
                        <div className={styles.header_body_left}>
                            <h3 className={styles.header_title_h3} >
                                グループ麻雀レコード
                            </h3>
                            <img src={img} className={styles.header_img} width="70px" height="70px" alt="header_img"/>    
                        </div>
                    </Link>
                    {location.pathname.includes('/activate') || location.pathname.includes('/password') || location.pathname.includes('/contact') || location.pathname.includes('/disclaimer')?
                    <div></div>
                    :
                        <div className={styles.header_body_right}>
                            <div>
                                <p className={styles.header_nickname}>{loginUserProfile.nickName}</p>  
                            </div>
                            <div>
                                <Button
                                    onClick={()=>{dispatch(setOpenProfile())}}
                                >
                                    <Avatar alt="who?" src={loginUserProfile.img} style={{height:'55px',width:'55px'}}/>
                                </Button>
                            </div>
                            <Profile />
                        </div>
                    }
                </div>
            </div>
            :null}
        </>
    )
}

export default Header
