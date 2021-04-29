
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { PROPS_GAME_RESULTS } from '../types'
import { fetchAsyncDeleteGame, fetchAsyncEditGameResults, fetchAsyncGetGameResults, fetchAsyncPutRate, selecGroup, selectGameResults } from './groupSlice';
import TableCell from '@material-ui/core/TableCell';
import styles from "./Group.module.css";
import { Button,TableRow, TextField } from '@material-ui/core';
import Modal from "react-modal";

const GameResults:React.FC<PROPS_GAME_RESULTS> = (gameresults) => {
    const params = useParams<{ id: string }>();
    const dispatch: AppDispatch = useDispatch();
    const group=useSelector(selecGroup);
    const groupmember=group.profile;
    let results=gameresults.results;
    const [openModal,setOpenModal]=useState(false);
    const [opendeleteresults,setOpenDeleteResults]=useState(false);
    const created_at=gameresults.created_at.slice(0,10);
    const allgameresults=useSelector(selectGameResults);
    const [score1,setScore1]=useState<{id:number,score:number}>({id:0,score:0});
    const [score2,setScore2]=useState<{id:number,score:number}>({id:0,score:0});
    const [score3,setScore3]=useState<{id:number,score:number}>({id:0,score:0});
    const [score4,setScore4]=useState<{id:number,score:number}>({id:0,score:0});
    
    function rateInfo(){
        let rateinfo:{rate_id:number,group_id:number,user_id:number,rate:number}[]=[];
        groupmember.forEach((gm)=>{
            const rate={rate_id:gm.rate_id,group_id:gm.group_id,user_id:gm.user_id,rate:1500}
            rateinfo.push(rate)
        })
        return rateinfo
    }
    const deletegame=async(id:number)=>{
        let rate=rateInfo()//1500に初期化
        //レート更新
        allgameresults.forEach((all)=>{
            let gameRate:{rate_id:number,group_id:number,user_id:number,rate:number}[]=[];
            let ratesum=0;
            
            all.results.forEach((ar)=>{
                if(ar.game_id!==id){
                    const rm=rate.filter((r)=>{
                        return r.user_id===ar.user_id
                    })[0];
                    ratesum+=rm.rate;
                    gameRate.push(rm);
                }
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
        const result=await dispatch(fetchAsyncDeleteGame(id));
        if(fetchAsyncDeleteGame.fulfilled.match(result)){
            setScore1({id:0,score:0});
            setScore2({id:0,score:0});
            setScore3({id:0,score:0});
            setScore4({id:0,score:0});
        }
        setOpenModal(false);
        setOpenDeleteResults(false);
        window.location.reload();

    }

    const editGame=async()=>{
        let score:{id:number,score:number}[]=[]
        score.push(score1,score2,score3,score4);
        score.sort(function(a, b) {
            let comp=0;
            if (a.score < b.score) {
                comp= 1;
            } else if(a.score>b.score){
                comp= -1;
            }
            return comp;
         });
        let editscore:{id:number,score:number,rank:number}[]=[]
        let i=1;
        score.forEach((s)=>{
            let es={id:s.id,score:s.score,rank:i}
            editscore.push(es);
            i+=1;
        });
        editscore.map(async(edits)=>{
            await dispatch(fetchAsyncEditGameResults(edits));
        });
        await dispatch(fetchAsyncGetGameResults(params.id));
        setOpenModal(false);
    }

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
    function setcss(score:number){
        if(score>=0){
            return styles.results_table_p_blue
        }else{
            return styles.results_table_p_red
        }
    }

    const openConfirmModal=()=>{
        setOpenDeleteResults(true);
    }
    
    return (
        <>
            <TableRow key={gameresults.id+gameresults.group_id} onClick={()=>{
                    setOpenModal(true)
                    setScore1({id:results[0].id,score:results[0].score});
                    setScore2({id:results[1].id,score:results[1].score});
                    setScore3({id:results[2].id,score:results[2].score});
                    setScore4({id:results[3].id,score:results[3].score});
                }} className={styles.gameresult_container}>
                <TableCell  >{created_at}</TableCell>
                {results.map((result)=>(
                    <TableCell component="th" scope="row" key={result.id} >
                        <p className={setcss(result.score)}>{result.score} </p>
                        <p className={styles.results_table_p}>{result.profile.nickName}</p>
                    </TableCell> 
                ))}
            </TableRow>
            <Modal
                isOpen={openModal}
                onRequestClose={()=>{
                    setOpenModal(false);
                }}
                style={modalStyle}
                ariaHideApp={false}
            >
                <h2>記録編集</h2>
                    <div>
                        {results.length===4?
                        <>
                            <div>
                                {results[0].profile.nickName}
                                <br/>
                                <TextField
                                    placeholder="点数"
                                    type="number"
                                    defaultValue={results[0].score}
                                    onChange={(e) => setScore1({id:results[0].id,score:Number(e.target.value)})}
                                />
                            </div>
                            <div>
                                {results[1].profile.nickName}
                                    <br/>
                                    <TextField
                                        placeholder="点数"
                                        type="number"
                                        defaultValue={results[1].score}
                                        onChange={(e) => setScore2({id:results[1].id,score:Number(e.target.value)})}
                                    />
                            </div>
                            <div>
                                {results[2].profile.nickName}
                                    <br/>
                                    <TextField
                                        placeholder="点数"
                                        type="number"
                                        defaultValue={results[2].score}
                                        onChange={(e) => setScore3({id:results[2].id,score:Number(e.target.value)})}
                                    />
                            </div>
                            <div>
                                {results[3].profile.nickName}
                                    <br/>
                                    <TextField
                                        placeholder="点数"
                                        type="number"
                                        defaultValue={results[3].score}
                                        onChange={(e) => setScore4({id:results[3].id,score:Number(e.target.value)})}
                                    />
                            </div>
                        </>
                    :null}
                    </div>
                <div>
                    <p>合計:{score1.score+score2.score+score3.score+score4.score}</p>
                    <div className={styles.gameresults_btn_container}>
                        <Button
                            disabled={score1.score+score2.score+score3.score+score4.score!==0}
                            variant="contained"
                            color="primary"
                            onClick={()=>{editGame()}}
                        >
                            記録
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            //onClick={()=>{deletegame(results[0].game_id)}}
                            onClick={()=>{openConfirmModal()}}
                        >
                            削除
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={opendeleteresults}
                onRequestClose={()=>{
                    setOpenDeleteResults(false);
                }}
                style={modalStyle2}
                ariaHideApp={false}
            >
                <div>
                    <p className={styles.leavegroup_p}>本当に記録を削除しますか？</p>
                </div>
                <div className={styles.leavegroup_container}>
                    <div className={styles.leavegroup_body}>
                        <Button
                            variant="contained" color="secondary"
                            onClick={()=>{deletegame(results[0].game_id)}}
                        >
                            OK
                        </Button>
                    </div>
                    <div className={styles.leavegroup_body}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={()=>{setOpenDeleteResults(false)}}
                        >
                            キャンセル
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default GameResults
