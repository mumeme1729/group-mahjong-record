import { Avatar, Button } from '@material-ui/core';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { fetchAsyncGetGameResults, fetchAsyncGetSelectProfile, selectGameResults, selectSelectProfile } from './groupSlice';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart,} from 'recharts';
import styles from "./Group.module.css";

const MemberDetail:React.FC = () => {
    const params = useParams<{ id: string,user_id:string }>();
    const dispatch: AppDispatch = useDispatch();
    const gameresults=useSelector(selectGameResults);
    const history = useHistory();
    const prof=useSelector(selectSelectProfile);

    useEffect(()=>{
        const fetchLoader = async ()=>{
            if (localStorage.localJWT) {
                await dispatch(fetchAsyncGetGameResults(params.id));
                await dispatch(fetchAsyncGetSelectProfile(params.user_id));
            }
        };
        fetchLoader();
    },[dispatch,params.id,params.user_id]);

    let rank1:number=0;
    let rank2:number=0;
    let rank3:number=0;
    let rank4:number=0;
    let score:number=0;
    let gamecount:number=0;
    let nickname:string="";
    let img:string="";
    let text:string="";
    let finduser=false;
    gameresults.map((gameresult)=>{
       return gameresult.results.forEach((r)=>{
            if(String(r.user_id)===params.user_id){
                gamecount+=1;
                score+=r.score;
                if(r.rank===1){rank1+=1}
                if(r.rank===2){rank2+=1}
                if(r.rank===3){rank3+=1}
                if(r.rank===4){rank4+=1}
                nickname=r.profile.nickName;
                text=r.profile.text;
                img=r.profile.img;
                finduser=true;
            }
        })
    });
    const useStyles = makeStyles({
        table: {
            minWidth: 700,
            maxWidth:1200,
        },
        });
    
    const classes = useStyles();
    
    //???????????????
    let average_rank=0;
    let top_rate=0;
    let las_rate=0;
    let rentai_rate=0;
    let average_score=0;
    if(finduser){
        let rank=(1*rank1+2*rank2+3*rank3+4*rank4)/gamecount;
        if((rank)<=2.3){
            average_rank=100;
        }else if((rank)>2.3 && (rank)<2.5){
            average_rank=75;
        }else if((rank)>=2.5 && (rank)<2.7){
            average_rank=50;
        }else{
            average_rank=25;
        }
        //????????????
        let top=((rank1)/gamecount)*100;
        
        if(top>=30){
            top_rate=100;
        }else if(top<30 && top>25){
            top_rate=75;
        }else if(top<=25 && top >20){
            top_rate=50;
        }else{
            top_rate=25;
        }
        //???????????????
        let las=100-(((rank4)/gamecount)*100);
        if(las>=80){
            las_rate=100;
        }else if(las<80 && las>75){
            las_rate=75;
        }else if(las<=75 && las >70){
            las_rate=50;
        }else{
            las_rate=25;
        }
        //??????
        let rentai=((rank1+rank2)/gamecount)*100;
        if(rentai>=60){
            rentai_rate=100;
        }else if(rentai<60 && rentai >55){
            rentai_rate=75;
        }else if(rentai <=55 && rentai>=50){
            rentai_rate=50;
        }else{
            rentai_rate=25;
        }
        //?????????
        let setscore=score/gamecount;
        if(setscore>=20){
            average_score=100;
        }else if(setscore<20 && setscore>=10){
            average_score=75;
        }else if(setscore<10 && setscore>=0){
            average_score=50;
        }else{
            average_score=25;
        }
    }else{
        nickname=prof.nickName;
        text=prof.text;
        img=prof.img;
    }
    const data = [
        { rank: '???????????????', value: average_score},
        { rank: '????????????', value: average_rank },
        { rank: '????????????', value: top_rate },
        { rank: '???????????????', value: las_rate },
        { rank: '?????????', value:rentai_rate },
        ];
    return (
        <div>
            <br/>
            <Button variant="outlined" color="primary" onClick={()=>history.push(`/group/${params.id}/member/`)}>??????</Button>
            <div className={styles.memberdetail_container_top}>
                <div className={styles.memberdetail_container_top_body}>
                <div className={styles.memberdetail_prof}>
                    {img!==""?
                        <div className={styles.memberdetail_prof_avatar}>
                            
                            <Avatar alt="who?" src={img} style={{height:'80px',width:'80px'}}/>
                            
                        </div>
                    :null}
                    <div className={styles.memberdetail_prof_p_container}>
                        <p className={styles.memberdetail_prof_p_name}>{nickname}</p>
                        <p className={styles.memberdetail_prof_p}>{text}</p>
                    </div>
                </div>
                <div className={styles.memberdetail_chart}>
                    <RadarChart // ??????????????????????????????????????????????????????????????????
                        height={250} //???????????????????????????????????????????????????
                        width={340} //????????????????????????????????????????????????
                        cx="50%" //?????????????????????????????????50%??????
                        cy="50%" //?????????????????????????????????50%??????
                        outerRadius={100}
                        data={data} //?????????Array????????????????????????
                        >
                        <PolarGrid /> 
                        <PolarAngleAxis
                            dataKey="rank" //Array??????????????????????????????????????????????????????????????????
                            domain={[100]}
                        />
                        <PolarRadiusAxis 
                            tick={false}
                            axisLine={false}
                            domain={[0,100]}
                        />
                        <Radar //??????????????????????????????????????????????????????????????????
                            name="Mike"  //hover?????????????????????????????????????????? 
                            dataKey="value" //Array?????????????????????????????????????????????????????????
                            stroke="#8884d8"  //?????????????????????????????????
                            fill="#8884d8" //????????????????????????????????????
                            fillOpacity={0.6} //?????????????????????????????????????????????
                        />
                        {/* <Tooltip /> //hover?????????????????????????????????????????????????????? */}
                    </RadarChart>
                </div>
                </div>
            </div>
            {finduser?
            <div>
                <br/>
                <div className={styles.match_recode_table}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                            <TableCell>???????????????</TableCell>
                            <TableCell>???????????????</TableCell>
                            <TableCell>????????????</TableCell>
                            <TableCell>1?????????</TableCell>
                            <TableCell>2?????????</TableCell>
                            <TableCell>3?????????</TableCell>
                            <TableCell>4?????????</TableCell>
                            <TableCell>?????????</TableCell>
                            <TableCell>????????????</TableCell>
                            <TableCell>???????????????</TableCell>
                            <TableCell>?????????</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row" align="center">{score}</TableCell>
                                <TableCell align="center">{(score/gamecount).toFixed(1)}</TableCell>
                                <TableCell align="center">{((1*rank1+2*rank2+3*rank3+4*rank4)/gamecount).toFixed(1)}</TableCell>
                                <TableCell align="center">{rank1}</TableCell>
                                <TableCell align="center">{rank2}</TableCell>
                                <TableCell align="center">{rank3}</TableCell>
                                <TableCell align="center">{rank4}</TableCell>
                                <TableCell align="center">{gamecount}</TableCell>
                                <TableCell align="center">{(((rank1)/gamecount)*100).toFixed(1)}</TableCell>
                                <TableCell align="center">{100-Number((((rank4)/gamecount)*100).toFixed(1))}</TableCell>
                                <TableCell align="center">{(((rank1+rank2)/gamecount)*100).toFixed(1)}</TableCell>
                            </TableRow>   
                        </TableBody>
                    </Table>
                </div>
            </div>
            :<div className={styles.match_recode_not_exist}>??????????????????????????????</div>}
        </div>
    )
}

export default MemberDetail
