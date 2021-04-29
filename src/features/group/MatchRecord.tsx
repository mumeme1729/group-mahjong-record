import { Button, CircularProgress, TextField } from '@material-ui/core';
import React, { useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import GameResults from './GameResults';
import { endLoadResults, fetchAsyncGetGameResults, selectGameResults, selectIsLoadResults, startLoadResults } from './groupSlice';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import styles from "./Group.module.css";


const MatchRecord:React.FC = () => {
    const params = useParams<{ id: string }>();
    const dispatch: AppDispatch = useDispatch();
    const gameresults=useSelector(selectGameResults);
    const [date,setDate]=useState("");
    const [enddate,setEndDate]=useState("");
    const isloadresults=useSelector(selectIsLoadResults);
    const history = useHistory();
    useLayoutEffect(()=>{
        const fetchLoader = async ()=>{
            if (localStorage.localJWT) {
                dispatch(startLoadResults())
                await dispatch(fetchAsyncGetGameResults(params.id));
                dispatch(endLoadResults())
            }
        };
        fetchLoader();
    },[dispatch,params.id]);
    let startday = 0;
    let endday = 99999935200000;
    if(date!==""){startday = Date.parse(date);}
    if(enddate!==""){ endday = Date.parse(enddate);}
    const selectgameresults=gameresults.filter((result)=>{
        let tartgetday=Date.parse(result.created_at.slice(0,10));
        return startday<=tartgetday && tartgetday<=endday
    });

    let profile:{user_id:number,nickName:string,score:number,gamecount:number,rank1:number,rank2:number,rank3:number,rank4:number}[]=[];
    selectgameresults.forEach((selectresult)=>{
        selectresult.results.forEach((r)=>{
            if(profile.length!==0){
                let selectprof=profile.filter((pro)=>{
                return pro.user_id===r.profile.userProfile;
                })
                //プロフィールがない時
                if(selectprof.length===0){
                    if(r.rank===1){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:1,rank2:0,rank3:0,rank4:0});}
                    if(r.rank===2){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:0,rank2:1,rank3:0,rank4:0});}
                    if(r.rank===3){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:0,rank2:0,rank3:1,rank4:0});}
                    if(r.rank===4){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:0,rank2:0,rank3:0,rank4:1});}
                }else{
                //　情報更新
                    selectprof[0].gamecount+=1;
                    if(r.rank===1){selectprof[0].rank1+=1;}
                    if(r.rank===2){selectprof[0].rank2+=1;}
                    if(r.rank===3){selectprof[0].rank3+=1;}
                    if(r.rank===4){selectprof[0].rank4+=1;}
                    selectprof[0].score+=r.score;
                }
            }else{
                if(r.rank===1){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:1,rank2:0,rank3:0,rank4:0});}
                if(r.rank===2){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:0,rank2:1,rank3:0,rank4:0});}
                if(r.rank===3){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:0,rank2:0,rank3:1,rank4:0});}
                if(r.rank===4){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:0,rank2:0,rank3:0,rank4:1});}
            }
        })
    })
    
      
    const useStyles = makeStyles({
    table: {
        minWidth: 700,
        maxWidth:1200,
    },
    table2:{
        minWidth: 300,
        maxWidth:700,
        background:'white',
    }
    });
    const classes = useStyles();
    return (
        <div>
            <br/>
            <Button variant="outlined" color="primary" onClick={()=>history.push(`/group/${params.id}/`)}>戻る</Button>
            <br/>
            <div className={styles.matchresult_title}>
                <h2 className={styles.group_title_h2}>対局記録</h2>
            </div>
            <div className={styles.selectdate_container}>
                <div className={styles.selectdate_body}>
                    <TextField
                        id="date"
                        type="date"
                        onChange={(e)=>setDate(e.target.value)}
                        defaultValue={date}
                        // className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <div className={styles.selectdate_container_div}>
                        <h3　className={styles.selectdate_container_h3}>～</h3>
                    </div>
                     <TextField
                        id="date"
                        type="date"
                        onChange={(e)=>setEndDate(e.target.value)}
                        defaultValue={enddate}
                        // className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </div>
            {isloadresults?
                <div className={styles.group_home_body_circular_container}>
                    <div>
                        <CircularProgress />
                    </div>
                </div>
            :      
             profile.length!==0?
                <div >
                    <div className={styles.match_recode_table}>
                        <div>
                            <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead>
                                <TableRow>
                                    <TableCell><p className={styles.results_table_p}>成績集計結果</p></TableCell>
                                    <TableCell><p className={styles.results_table_p}>合計スコア</p></TableCell>
                                    <TableCell><p className={styles.results_table_p}>平均スコア</p></TableCell>
                                    <TableCell><p className={styles.results_table_p}>平均順位</p></TableCell>
                                    <TableCell><p className={styles.results_table_p}>1位回数</p></TableCell>
                                    <TableCell><p className={styles.results_table_p}>2位回数</p></TableCell>
                                    <TableCell><p className={styles.results_table_p}>3位回数</p></TableCell>
                                    <TableCell><p className={styles.results_table_p}>4位回数</p></TableCell>
                                    <TableCell><p className={styles.results_table_p}>対局数</p></TableCell>
                                    <TableCell><p className={styles.results_table_p}>トップ率</p></TableCell>
                                    <TableCell><p className={styles.results_table_p}>ラス率</p></TableCell>
                                    <TableCell><p className={styles.results_table_p}>連対率</p></TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {profile.map((prof)=>(
                                        <TableRow key={prof.user_id}>
                                            <TableCell component="th" scope="row"><p className={styles.results_table_p}>{prof.nickName}</p></TableCell>
                                            <TableCell>
                                                {prof.score>=0?
                                                    <p className={styles.results_table_p_blue}>{prof.score}</p>
                                                :<p className={styles.results_table_p_red}>{prof.score}</p>}
                                            </TableCell>
                                            <TableCell><p className={styles.results_table_p}>{(prof.score/prof.gamecount).toFixed(1)}</p></TableCell>
                                            <TableCell><p className={styles.results_table_p}>{((1*prof.rank1+2*prof.rank2+3*prof.rank3+4*prof.rank4)/prof.gamecount).toFixed(1)}</p></TableCell>
                                            <TableCell><p className={styles.results_table_p}>{prof.rank1}</p></TableCell>
                                            <TableCell><p className={styles.results_table_p}>{prof.rank2}</p></TableCell>
                                            <TableCell><p className={styles.results_table_p}>{prof.rank3}</p></TableCell>
                                            <TableCell><p className={styles.results_table_p}>{prof.rank4}</p></TableCell>
                                            <TableCell><p className={styles.results_table_p}>{prof.gamecount}</p></TableCell>
                                            <TableCell><p className={styles.results_table_p}>{(((prof.rank1)/prof.gamecount)*100).toFixed(1)}</p></TableCell>
                                            <TableCell><p className={styles.results_table_p}>{(((prof.rank4)/prof.gamecount)*100).toFixed(1)}</p></TableCell>
                                            <TableCell><p className={styles.results_table_p}>{(((prof.rank1+prof.rank2)/prof.gamecount)*100).toFixed(1)}</p></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <br/>
                    <div className={styles.result_matchrecode}>
                        <Table className={classes.table2} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><p className={styles.results_table_p}>日付</p></TableCell>
                                    <TableCell><p className={styles.results_table_p}>1位</p></TableCell>
                                    <TableCell><p className={styles.results_table_p}>2位</p></TableCell>
                                    <TableCell><p className={styles.results_table_p}>3位</p></TableCell>
                                    <TableCell><p className={styles.results_table_p}>4位</p></TableCell>
                                </TableRow>
                            </TableHead>
                            {selectgameresults.map((gameresult)=>(
                            <TableBody  key={gameresult.id} className={styles.gameresult_container}>
                                
                                <GameResults {...gameresult}/>
                                
                            </TableBody>
                            ))}
                        </Table>
                    </div>
                </div>
            :
                <div className={styles.results_table_not_exist_div}>
                    <p className={styles.results_table_p}>対局記録がありません</p>
                </div>
            }
        </div>
    )
}

export default MatchRecord
