import { Formik } from 'formik';
import React from 'react'
import styles from './Auth.module.css';
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { Button,TextField } from '@material-ui/core';
import { useHistory,useParams } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { fetchAsyncPasswordConfirm } from './authSlice';

const PasswordConfirm:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const params = useParams<{ uid: string,token:string }>();
    return (
        <div className={styles.password_reset_container}>
            <div className={styles.password_reset_body}>
                <h3 className={styles.password_reset_h3}>新しいパスワードを入力</h3>
                <p className={styles.password_reset_p}>新しいパスワードを入力してください。</p>
                <p className={styles.password_reset_p}>パスワードは8文字以上です。</p>
            <Formik
                    initialErrors={{ password1: "required" }}
                    initialValues={{ password1: "",password2:""}}
                    onSubmit={async (values) => {
                        if(values.password1===values.password2){
                            const packet={new_password1:values.password1,new_password2:values.password2,uid:params.uid,token:params.token};
                            await dispatch(fetchAsyncPasswordConfirm(packet));
                        }
                    }}
                    //バリデーション
                    validationSchema={Yup.object().shape({
                        password1: Yup.string().required("パスワードは必須です。").min(8),
                        password2:Yup.string().required("確認パスワードは必須です。").oneOf([Yup.ref("password1"), null], "Passwords must match")
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
                                        label="パスワード"
                                        placeholder="パスワード"
                                        type="password"
                                        name="password1"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password1}
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <br />
                                    {touched.password1 && errors.password1 ? (
                                        <div >{errors.password1}</div>
                                        ) : null}
                                    <br />
                                    <TextField
                                        label="確認パスワード"
                                        placeholder="確認パスワード"
                                        type="password"
                                        name="password2"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password2}
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <br />
                                    {touched.password2 && errors.password2 ? (
                                        <div >{errors.password2}</div>
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
                <div className="">
                    <p className={styles.password_reset_btn} onClick={()=>{history.push('/')}}>
                        ログイン画面へ
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PasswordConfirm
