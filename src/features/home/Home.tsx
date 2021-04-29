import React,{ useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { AppDispatch } from "../../app/store";
import { fetchAsyncGetMyProf,selectLoginUserProfile } from '../auth/authSlice';
import { fetchAsyncGetBelongToGroup, selectBelongToGroup } from './homeSlice';
import BelongToGroupList from './BelongToGroupList';
import styles from "./Home.module.css";
import Search from './Search';

const Home:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const loginUserProfile=useSelector(selectLoginUserProfile);
    const belongtogroup=useSelector(selectBelongToGroup);
    
    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                const result = await dispatch(fetchAsyncGetMyProf());//ログインしているユーザーのプロフィールを取得する
                await dispatch(fetchAsyncGetBelongToGroup());
                if (fetchAsyncGetMyProf.rejected.match(result)) {
                    history.push('/')
                }
              }else{
                history.push('/')
              }
            };
        fetchLoader();
    },[dispatch,history]);

    return (
        <div>
            <Search/>
            <div className={styles.home_container}>
                {belongtogroup.length!==0 && belongtogroup[0].id!==0?
                <div className={styles.home_grouplist_container}>
                    {belongtogroup.map((group)=>( 
                        group.profile.map((prof)=>(
                            prof.is_active &&prof.userProfile===loginUserProfile.userProfile && <BelongToGroupList key={group.id} {...group}/>
                        ))
                    ))}
                </div>
                :<>参加しているグループはありません</>}
            </div>
        </div>
    )
}

export default Home
