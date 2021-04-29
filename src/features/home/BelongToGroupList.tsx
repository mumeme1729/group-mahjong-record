import { Button,  } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {PROPS_BELONG_TO_GROUP} from '../types';
import styles from "./Home.module.css";
import groupImage from '../auth/fish_shark.png';

const BelongToGroupList:React.FC<PROPS_BELONG_TO_GROUP> = (group) => {
    const history = useHistory();
    return (
        <>
            <Button onClick={()=>{history.push(`/group/${group.id}`)}}> 
                <div className={styles.belong_to_group_container}>
                    <div className={styles.belong_to_group_body_top}>
                        {group.img!==null?
                            <img src={group.img} className={styles.belong_to_group_img} alt="group_img"/>
                        :   <img src={groupImage} className={styles.belong_to_group_img} alt="group_img"/>
                        }
                    </div>
                    <div className={styles.belong_to_group_body_bottom}>
                        <h3 className={styles.belong_to_group_h3}>{group.title}</h3>
                    </div>    
                </div>
            </Button>
        </>
    )
}

export default BelongToGroupList
