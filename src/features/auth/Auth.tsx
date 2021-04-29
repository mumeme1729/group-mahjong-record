import React from 'react'
import { useSelector} from "react-redux";
import {selectOpenSignIn,} from './authSlice';
import SignUp from './SignUp';
import Login from './Login';
import styles from './Auth.module.css';
import img from './fish_shark.png';
import loginImage from './login.jpg';
import home from './home.jpg';
import grouphome from './grouphome.jpg';
import mahjong from './mahjong.jpg';
const Auth:React.FC = () => {
    const openSignIn = useSelector(selectOpenSignIn); 
    return (
        <>
            <div className={styles.auth_container}>
                <div className={styles.auth_body}>
                    <div className={styles.auth_body_header}>
                        <img src={img} className={styles.auth_body_header_img} alt='heade-img'/>
                        <h1 className={styles.auth_title_h1}>グループ麻雀レコード</h1>
                        <p className={styles.auth_title_p}>グループごとに麻雀の成績を管理</p>
                    </div>
                    <div className={styles.auth_login_signup}>
                        {!openSignIn
                        ?<>
                            {/* サインアップ */}
                            <SignUp/>
                        </>
                        :<> 
                            {/* サインイン  */}
                            <Login/>
                        </>}
                    </div>
                    <div className={styles.auth_what_container}>
                        <div className={styles.auth_what}>
                            <h2 className={styles.auth_what_h2}>グループ麻雀レコードとは</h2>
                        </div>
                        <p className={styles.auth_what_p}>グループを作成してグループごとに麻雀の成績を管理することができます。</p>
                        <div className={styles.auth_how_to}>
                            <h2 className={styles.auth_how_to_h2}>使い方</h2>
                        </div>
                        <div className={styles.auth_how_to_container}>
                            <div className={styles.auth_how_to_body}>
                                <div>
                                    <p className={styles.how_to_p}>1. ログイン又はアカウントを作成します</p>
                                    <img src={loginImage} className={styles.how_to_image_login} alt="img"/>
                                </div>
                                <div>
                                    <p className={styles.how_to_p}>2. グループを作成します。</p>
                                    <img src={home} className={styles.how_to_image_login} alt="img"/>
                                </div>
                                <div>
                                    <p className={styles.how_to_p}>3. グループに参加します。</p>
                                    <img src={grouphome} className={styles.how_to_image_login} alt="img"/>
                                </div>
                                <div>
                                    <p className={styles.how_to_p}>4. ルールを守って楽しく対局!!</p>
                                    <img src={mahjong} className={styles.how_to_image_login}alt="img"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Auth
