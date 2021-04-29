import { Avatar, Button } from '@material-ui/core';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { fetchAsyncGetGameResults, fetchAsyncGetGroup, fetchAsyncPutRate,  selecGroup, selectGameResults } from './groupSlice';
import styles from "./Group.module.css";
const GroupMember:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const params = useParams<{ id: string ,user_id:string}>();
    const group=useSelector(selecGroup);
    const groupmember=group.profile;
    const allgameresults=useSelector(selectGameResults);
    
    useEffect(()=>{
        const fetchLoader = async ()=>{
            if (localStorage.localJWT) {
                await dispatch(fetchAsyncGetGroup(params.id));
            }
        };
        fetchLoader();
    },[dispatch,params.id]);

    function rateInfo(){
        let rateinfo:{rate_id:number,group_id:number,user_id:number,rate:number}[]=[];
        groupmember.forEach((gm)=>{
            const rate={rate_id:gm.rate_id,group_id:gm.group_id,user_id:gm.user_id,rate:1500}
            rateinfo.push(rate)
        })
        return rateinfo
    }

    const updateRate=async()=>{
        const res=await dispatch(fetchAsyncGetGameResults(params.id));
        if(fetchAsyncGetGameResults.fulfilled.match(res)){
            let rate=rateInfo()//1500に初期化
            //レート更新
            allgameresults.forEach((all)=>{
                let gameRate:{rate_id:number,group_id:number,user_id:number,rate:number}[]=[];
                let ratesum=0;
                all.results.forEach((ar)=>{
                    const rm=rate.filter((r)=>{
                        return r.user_id===ar.user_id
                    })[0];
                    ratesum+=rm.rate;
                    gameRate.push(rm);
                    
                })
                if(gameRate.length!==0){
                    let rateave=Math.round(ratesum/4);//レートの平均
                    //レート更新
                    let i=1;
                    gameRate.forEach((r)=>{
                        if(i===1){r.rate=Math.round(r.rate+(50+((rateave-r.rate)/70)*0.2));}
                        if(i===2){r.rate=Math.round(r.rate+(10+((rateave-r.rate)/70)*0.2));}
                        if(i===3){r.rate=Math.round(r.rate+(-20+((rateave-r.rate)/70)*0.2));}
                        if(i===4){r.rate=Math.round(r.rate+(-40+((rateave-r.rate)/70)*0.2));}
                        i+=1;
                    });
                }
            })
            rate.map(async(r)=>{
                await dispatch(fetchAsyncPutRate(r));
            });
            await dispatch(fetchAsyncGetGroup(params.id));
        }  
    }

    return (
        <div>
            <br/>
            <Button variant="outlined" color="primary" onClick={()=>history.push(`/group/${params.id}/`)}>戻る</Button>
            <br/>
            <div className={styles.game_main_container}>
            <div className={styles.game_main_body}>
                <div className={styles.page_title_group_member}>
                    <h2 className={styles.group_title_h2}>グループメンバー</h2> 
                    <div className={styles.update_rate_btn}>
                        <Button color="primary" onClick={()=>{updateRate()}}>
                            レート更新
                        </Button>
                    </div>
                </div>
                <div className={styles.game_container}> 
                    {groupmember.map((mem)=>(
                        mem.is_active &&
                            <div key={mem.id}>
                                <div className={styles.game_body}>
                                    <Button onClick={()=>{history.push(`/group/${params.id}/member/${mem.user_id}/`)}}>
                                        <div>
                                            <div className={styles.game_avater}>
                                                {mem.img!==""?
                                                <Avatar alt="who?" src={mem.img} style={{height:'70px',width:'70px'}}/>
                                                :null}
                                            </div>
                                            <div>
                                                {mem.nickName}
                                                <br/>
                                                {mem.rate}
                                            </div>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                    ))}
                </div>
                </div>
            </div>
        </div>
    )
}

export default GroupMember
