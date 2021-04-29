import { Button, TextField } from '@material-ui/core';
import { Formik } from 'formik';
import React, { useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { fetchAsyncActivateUser, fetchAsyncCreateProf,fetchAsyncLogin } from './authSlice';
import * as Yup from "yup";
import { resetBackUrl, selectBackUrl } from '../home/homeSlice';
import styles from './Auth.module.css';

const Activate:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const params = useParams<{ token: string }>();
    const backurl=useSelector(selectBackUrl);
    useEffect(()=>{
        const fetchLoader = async ()=>{
            if(params.token!==""){
              await dispatch(fetchAsyncActivateUser(params.token));   
            }
        };
        fetchLoader();
    },[dispatch,params.token]);
    return (

        <div　className="auth_container">
            <Formik
                initialErrors={{ email: "required" }}
                initialValues={{ email: "", password: ""}}

                onSubmit={async (values) => {
                    const result = await dispatch(fetchAsyncLogin(values));
                    if (fetchAsyncLogin.fulfilled.match(result)) {
                        const res=await dispatch(fetchAsyncCreateProf({ nickName: "no name"}));
                        if(fetchAsyncCreateProf.fulfilled.match(res)){
                            if(backurl===""){
                                history.push('/home');
                            }else{
                                history.push(backurl);
                                dispatch(resetBackUrl());
                            }
                        }
                    }else{
                        values.email="";
                        values.password="";
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
                    <div className={styles.auth_login_main_container}>
                       <div className={styles.auth_login_main_body}>
                           <p className={styles.auth_activate_p}> 登録が完了しました</p>
                           <p className={styles.auth_activate_p}> 以下のログインフォームよりログインしてください</p>
                        <div className={styles.auth_login_title_container}>
                            <h2 className={styles.auth_login_h2}>ログイン</h2>
                        </div>
                    
                        <form onSubmit={handleSubmit}>
                            <div className={styles.auth_login_title_container}>
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
                                <div className={styles.activate_login_btn}>
                                    <Button variant="contained" color="primary" disabled={!isValid} type="submit">ログイン</Button>
                                </div>
                            </div>
                        </form>
                        </div>
                    </div>
                )}
            </Formik>
        </div>
    )
}

export default Activate


