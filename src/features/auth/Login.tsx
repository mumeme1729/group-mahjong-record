import React,{useState} from 'react'
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import {Button,TextField} from "@material-ui/core";
import {Link,useHistory} from 'react-router-dom';
import styles from './Auth.module.css';
import * as Yup from "yup";
import {
    fetchAsyncLogin,
    fetchAsyncGetMyProf,
    fetchAsyncCreateProf,
    resetOpenSignIn,
} from './authSlice';
import { resetBackUrl, selectBackUrl } from '../home/homeSlice';

const Login:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [falseLogin,setfalseLogin]=useState(false);
    const history = useHistory();
    const backurl=useSelector(selectBackUrl);
    return (
        <div　className="auth_container">
            <Formik
                initialErrors={{ email: "required" }}
                initialValues={{ email: "", password: ""}}

                onSubmit={async (values) => {
                    const result = await dispatch(fetchAsyncLogin(values));
                    if (fetchAsyncLogin.fulfilled.match(result)) {
                        if(result.payload.detail!=="No active account found with the given credentials"){
                            const login=await dispatch(fetchAsyncGetMyProf());
                            if(login.payload.length===0){
                                await dispatch(fetchAsyncCreateProf({ nickName: "no name"}));
                            }
                            if(!backurl.includes('/group')){
                                history.push('/home');
                            }else{
                                history.push(backurl);
                                dispatch(resetBackUrl());
                            }
                        }else{
                            //有効化されていない
                            values.email="";
                            values.password="";
                            setfalseLogin(true);
                        }
                    }else{
                        //fetch失敗
                        values.email="";
                        values.password="";
                        setfalseLogin(true);
                    } 
                    
                }}
                //バリデーション
                validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email("メールアドレスのフォーマットが不正です。")
                    .required("メールアドレスは必須です。"),
                password: Yup.string().required("パスワードは必須です。").min(4),
                })}
            >
            {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
                isValid,
            }) => (
                    <div className="auth_login_main_container">
                        {/* <div className="css_styles.auth_progress">
                            {isLoadingAuth && <CircularProgress />}
                        </div> */}
                        {falseLogin?<p className={styles.login_failure_p}>ログインに失敗しました</p>:null}
                        <div className="">
                            <h2 className={styles.login_signup_h2}>ログイン</h2>
                        </div>
                    
                        <form onSubmit={handleSubmit}>
                            <div >
                                <TextField
                                    placeholder="email"
                                    type="input"
                                    name="email"
                                    onChange={handleChange}//formikのバリデーションを走らせる
                                    onBlur={handleBlur}//マウスが外れた時に走らせる
                                    value={values.email}
                                />
                                <br />
                                {touched.email && errors.email ? (
                                <div >{errors.email}</div>
                                ) : null}
                                <br />
                                <TextField
                                    placeholder="password"
                                    type="password"
                                    name="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                />
                                {touched.password && errors.password ? (
                                <div >{errors.password}</div>
                                ) : null}
                                <br />
                                <br/>
                                
                                <div className="">
                                    <Button variant="contained" color="primary" disabled={!isValid} type="submit">ログイン</Button>
                                    <div className={styles.switch_login_signup_btn_container}>
                                        <span className={styles.switch_login_signup_btn} onClick={async () => {
                                            dispatch(resetOpenSignIn());              
                                        }}>
                                            アカウントをお持ちでない方はこちら
                                        </span>
                                    </div>
                                    <div className={styles.switch_login_signup_btn_container}>
                                        <Link to='/password/reset' className={styles.link_border}>
                                            <span className={styles.switch_login_signup_btn}>パスワードをお忘れですか？</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </Formik>
        </div>
    )
}

export default Login
