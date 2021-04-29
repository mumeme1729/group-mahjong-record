import { Avatar, TextField,} from '@material-ui/core';
import React,{useEffect,useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { fetchAsyncGetGroup, selecGroup,fetchAsyncCreateGame,fetchAsyncPutRate, fetchAsyncCreateGameResults } from './groupSlice';
import styles from "./Group.module.css";
import { Button } from '@material-ui/core';
import Modal from "react-modal";


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
      height: 450,
      transform: "translate(-50%, -50%)",
      },
};

const Game:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const group=useSelector(selecGroup);
    const groupmember=group.profile;
    const [openModal,setOpenModal]=useState(false);
    const [score1,setScore1]=useState<{id:number,score:number}>({id:0,score:0});
    const [score2,setScore2]=useState<{id:number,score:number}>({id:0,score:0});
    const [score3,setScore3]=useState<{id:number,score:number}>({id:0,score:0});
    const [score4,setScore4]=useState<{id:number,score:number}>({id:0,score:0});
    const [memts,setMemts]=useState<number[]>([]);
    const [uma, setUma] = useState('5-10');
    
    let ratelist:{
        rate_id: number;
        group_id: number;
        user_id: number;
        rate: number;
    }[]=[]
    useEffect(()=>{
        const fetchLoader = async ()=>{
            if (localStorage.localJWT) {
                await dispatch(fetchAsyncGetGroup(params.id));
            }
        };
        fetchLoader();
    },[dispatch,params.id]);
    
    const setUserId=(id:number):void=>{
        if(!memts.includes(id)){
            setMemts([
                ...memts,
                id,
            ]);
        }else{
            setMemts(memts.filter((i) => i !== id));
        }
    }
    //選択したメンバーのプロフィール
    const memberprofile=memts.map((m)=>{
         return groupmember.filter((gr)=>{
            return gr.userProfile===m;
        })[0]
    })

    const newGame = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setOpenModal(true);
    };
    //スコア計算
    function culcScore(ranklist:{id:number,score:number}[]):{id:number,score:number,rank:number}[]{
        let score:{id:number,score:number,rank:number}[]=[]
        ratelist=[]
        let i=1;
        ranklist.forEach((rank)=>{
            let culcscore:number=0
            if(rank.score>=0){
                let cscore=(rank.score+400)/1000;
                cscore=Math.floor(cscore);
                culcscore=cscore-30;
            }else{
                let cscore=(rank.score-400)/1000;
                cscore=Math.ceil(cscore);
                culcscore=cscore-30;
            }
            // ウマの計算
            if(uma==="5-10"){
                if(i===1){culcscore=culcscore+20+10;}
                if(i===2){culcscore=culcscore+5;}
                if(i===3){culcscore=culcscore-5;}
                if(i===4){culcscore=culcscore-10};
            }else if(uma==="10-20"){
                if(i===1){culcscore=culcscore+20+20;}
                if(i===2){culcscore=culcscore+10;}
                if(i===3){culcscore=culcscore-10;}
                if(i===4){culcscore=culcscore-20};
            }else if(uma==="10-30"){
                if(i===1){culcscore=culcscore+20+30;}
                if(i===2){culcscore=culcscore+10;}
                if(i===3){culcscore=culcscore-10;}
                if(i===4){culcscore=culcscore-30};
            }

            let r:{id:number,score:number,rank:number}={id:rank.id,score:culcscore,rank:i}
            i=i+1;
            score.push(r);
            //レート計算
            const profile=memberprofile.filter((pro)=>{
                return pro.userProfile===rank.id
            })[0]
            const rate={rate_id:profile.rate_id,group_id:profile.group_id,user_id:profile.user_id,rate:profile.rate}
            ratelist.push(rate)
        });
        return score;
    }

    const recodeScore=async(e:React.MouseEvent<HTMLElement>)=>{
        e.preventDefault();
        let ranklist:{id:number,score:number}[]=[]
        if(score1.score+score2.score+score3.score+score4.score===100000){
            ranklist.push(score1,score2,score3,score4);
            ranklist.sort(function(a, b) {
                let comp=0;
                if (a.score < b.score) {
                    comp= 1;
                } else if(a.score>b.score){
                    comp= -1;
                }
                return comp;
             });

            let score=culcScore(ranklist);//計算済みのスコア
 
            //レート計算
            if(ratelist.length===4){
                let ratesum=0;
                ratelist.forEach((r)=>{
                    ratesum+=r.rate;
                })
                let rateave=Math.round(ratesum/4);
                let i=1;
                ratelist.forEach((r)=>{
                    if(i===1){r.rate=Math.round(r.rate+(50+((rateave-r.rate)/70)*0.2));}
                    if(i===2){r.rate=Math.round(r.rate+(10+((rateave-r.rate)/70)*0.2));}
                    if(i===3){r.rate=Math.round(r.rate+(-20+((rateave-r.rate)/70)*0.2));}
                    if(i===4){r.rate=Math.round(r.rate+(-40+((rateave-r.rate)/70)*0.2));}
                    i+=1;
                });
                ratelist.map(async(r)=>{
                    await dispatch(fetchAsyncPutRate(r));
                });
            };
            //ゲームを作る
            const packet={group_id:params.id};
            const results=await dispatch(fetchAsyncCreateGame(packet));
            if(fetchAsyncCreateGame.fulfilled.match(results)){
                score.map(async(s)=>{
                    const resultspacket={game_id:results.payload.id,user_id:s.id,rank:s.rank,score:s.score}
                    await dispatch(fetchAsyncCreateGameResults(resultspacket));
                })
            }
            setOpenModal(false);
            history.push(`/group/${params.id}`)
        };
    }
    return (
        <>  
            <br/>
            <Button variant="outlined" color="primary" onClick={()=>history.push(`/group/${params.id}/`)}>戻る</Button>
            <br/>
            <div className={styles.game_main_container}>
                <div className={styles.game_main_body}>
                    <div className={styles.page_title_select_member}>
                        <h2 className={styles.group_title_h2}>対局者を選択</h2>
                    </div>
                    <div className={styles.game_container}>        
                        {groupmember.map((member)=>(
                            member.is_active &&
                                <div key={member.id} >
                                    <Button  onClick={()=>setUserId(member.userProfile)} className={styles.game_user_btn}>
                                        <div className={styles.game_body}>
                                            {!memts.includes(member.userProfile)
                                            ?
                                                <div>
                                                    <div className={styles.game_avater}>
                                                        {member.img!==""?
                                                        <Avatar alt="who?" src={member.img} style={{height:'70px',width:'70px'}}/>
                                                        :null}
                                                    </div>
                                                    <div>
                                                        {member.nickName}
                                                        <br/>
                                                        {member.rate}
                                                    </div>
                                                </div>
                                            :
                                                <div className={styles.game_selected_profile}>
                                                    <div className={styles.game_avater}>
                                                        {member.img!==""?
                                                        <Avatar alt="who?" src={member.img} style={{height:'70px',width:'70px'}}/>
                                                        :null}
                                                    </div>
                                                    <div>
                                                        {member.nickName}
                                                        <br/>
                                                        {member.rate}
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </Button>
                                </div>
                        ))}
                    </div>
                    <div className={styles.game_start_btn}>
                        <Button
                            disabled={memts.length!==4}
                            variant="contained"
                            color="primary"
                            onClick={newGame}
                        >
                            対局開始
                        </Button>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={openModal}
                onRequestClose={()=>{
                    setOpenModal(false);
                    setMemts([]);
                    setScore1({id:0,score:0})
                    setScore2({id:0,score:0})
                    setScore3({id:0,score:0})
                    setScore4({id:0,score:0})
                }}
                style={modalStyle}
                ariaHideApp={false}
            >
                <h2>対局結果</h2>
                {/* {startLoad && <CircularProgress/>} */}
                {memberprofile.length===4?
                    <div>
                        <div>
                            東: {memberprofile[0].nickName}
                            <br/>
                            <TextField
                                placeholder="点数"
                                type="number"
                                onChange={(e) => setScore1({id:memberprofile[0].userProfile,score:Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            南: {memberprofile[1].nickName}
                            <br/>
                            <TextField
                                placeholder="点数"
                                type="number"
                                onChange={(e) => setScore2({id:memberprofile[1].userProfile,score:Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            西: {memberprofile[2].nickName}
                            <br/>
                            <TextField
                                placeholder="点数"
                                type="number"
                                onChange={(e) => setScore3({id:memberprofile[2].userProfile,score:Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            北: {memberprofile[3].nickName}
                            <br/>
                            <TextField
                                placeholder="点数"
                                type="number"
                                onChange={(e) => setScore4({id:memberprofile[3].userProfile,score:Number(e.target.value)})}
                            />
                        </div>
                    </div>
                :
                    <div> 
                    </div>
                }
                <div>
                    <p>合計:{score1.score+score2.score+score3.score+score4.score}</p>
                    <div className={styles.match_radio_box_container}>
                        <label>
                            <input
                            type="radio"
                            value="5-10"
                            onChange={(e)=>{setUma(e.target.value)}}
                            checked={uma === '5-10'}
                            />
                            5-10
                        </label>
                        <label>
                            <input
                            type="radio"
                            value="10-20"
                            onChange={(e)=>{setUma(e.target.value)}}
                            checked={uma === '10-20'}
                            />
                            10-20
                        </label>
                        <label>
                            <input
                            type="radio"
                            value="10-30"
                            onChange={(e)=>{setUma(e.target.value)}}
                            checked={uma === '10-30'}
                            />
                            10-30
                        </label>
                    </div>
                    <div className={styles.game_start_btn}>
                        <Button
                            disabled={score1.score+score2.score+score3.score+score4.score!==100000}
                            variant="contained"
                            color="primary"
                            onClick={recodeScore}
                        >
                            記録
                        </Button>
                    </div>
                </div>
            </Modal>
        </>

    )
}

export default Game
