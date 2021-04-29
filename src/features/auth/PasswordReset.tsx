import { Formik } from 'formik';
import React, { useState } from 'react'
import styles from './Auth.module.css';
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { Button,TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { fetchAsyncPasswordReset } from './authSlice';
const PasswordReset:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const [sendemal,setSendEmail]=useState(false);
    return (
        <div className={styles.password_reset_container}>
            <div className={styles.password_reset_body}>
            {!sendemal?
            <>
            <h3 className={styles.password_reset_h3}>パスワード再設定</h3>
            <p className={styles.password_reset_p}>登録したメールアドレスを入力してください。</p>
            <p className={styles.password_reset_p}>パスワード再設定用のURLをメールに送信します。</p>
            <Formik
                    initialErrors={{ email: "required" }}
                    initialValues={{ email: ""}}
                    
                    onSubmit={async (values) => {
                        const result= await dispatch(fetchAsyncPasswordReset({email:values.email}));
                        if(fetchAsyncPasswordReset.fulfilled.match(result)){
                            setSendEmail(true);
                        }
                    }}
                    //バリデーション
                    validationSchema={Yup.object().shape({
                        email: Yup.string()
                                .email("メールアドレスが不正です。")
                                .required("メールアドレスは必須です。"),
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
                            <form onSubmit={handleSubmit}>
                                <div >
                                    <TextField
                                        label="メールアドレス"
                                        placeholder="メールアドレス"
                                        type="input"
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <br />
                                    {touched.email && errors.email ? (
                                        <div >{errors.email}</div>
                                        ) : null}
                                    <br />
                            
                                </div>
                                <Button variant="contained" color="primary" disabled={!isValid} type="submit">
                                    送信
                                </Button>
                            </form>
                        </div>  
                    )}
                </Formik>
                </>:
                    <div>
                        <h3 className={styles.password_reset_h3}>メールを送信しました。</h3>
                    </div>
                }
                <div className="">
                    <p className={styles.password_reset_btn} onClick={()=>{history.push('/')}}>
                        ログイン画面へ
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PasswordReset
