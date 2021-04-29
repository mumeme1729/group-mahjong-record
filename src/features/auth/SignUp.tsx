import React,{useState} from 'react'
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import {Button,TextField} from "@material-ui/core";
import * as Yup from "yup";
import Modal from "react-modal";
import styles from './Auth.module.css';
import {
    fetchAsyncGetUser,
    fetchAsyncRegister,
    setOpenSignIn,
} from './authSlice';
const modalStyle={
    overlay: {
        background: 'rgba(0, 0, 0, 0.2)',
        zIndex:4,
      },
    content: {  
      top: "50%",
      left: "50%",
      backgroundColor: 'white',
      width: 260,
      height: 180,
      transform: "translate(-50%, -50%)",
      },
};
const SignUp:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [sendEmail,setSendEmail]=useState(false);
    const [successCreateAccount,setSuccessCreateAccount]=useState(false);
    return (
        <>
        <div　className="auth_container">
            <Formik
                initialErrors={{ email: "required" }}
                initialValues={{ email: "", password: "",password2:"" }}
                
                onSubmit={async (values) => {
                    const res=await dispatch(fetchAsyncGetUser(values.email));
                    if(res.payload.length===0){
                        setSendEmail(true);
                        setSuccessCreateAccount(false);
                        const auth_packet={email: values.email,password: values.password}
                        const resultRegister = await dispatch(fetchAsyncRegister(auth_packet));
                        //新規作成に成功したらログイン
                        if (fetchAsyncRegister.fulfilled.match(resultRegister)) {
                            if (resultRegister.payload.email===values.email){
                                setSuccessCreateAccount(false);
                            }else{
                                values.email="";
                                values.password="";
                                values.password2="";
                                setSendEmail(false);
                                setSuccessCreateAccount(true);
                            }
                        }else{
                            values.email="";
                            values.password="";
                            values.password2="";
                            setSendEmail(false);
                            setSuccessCreateAccount(true);
                        }  
                    } else{
                        values.email="";
                        values.password="";
                        values.password2="";
                        setSendEmail(false);
                        setSuccessCreateAccount(true);
                    }  
                }
            }
                //バリデーション
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                            .email("メールアドレスのフォーマットが不正です。")
                            .required("メールアドレスは必須です。"),
                    password: Yup.string().required("パスワードは必須です。").min(8),
                    password2:Yup.string().required("確認パスワードは必須です。").oneOf([Yup.ref("password"), null], "Passwords must match")
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
                        {successCreateAccount
                        ?
                            <div>
                                <p className={styles.login_failure_p}>このメールアドレスは既に登録されています</p>
                            </div>:null}
                        <div className="">
                            <h2 className={styles.login_signup_h2}>アカウント作成</h2>
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
                                <TextField
                                    placeholder="confirm password"
                                    type="password"
                                    name="password2"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password2}
                                />
                                {touched.password2 && errors.password2 ? (
                                    <div >{errors.password2}</div>
                                    ) : null}
                                <div className="">
                                    <br/>
                                    <Button variant="contained" color="primary" disabled={!isValid} type="submit">
                                        アカウント作成
                                    </Button>
                                    <br/>
                                    <div className={styles.switch_login_signup_btn_container}>
                                        <span className={styles.switch_login_signup_btn} onClick={async () => {
                                            dispatch(setOpenSignIn());              
                                        }}>
                                            アカウントをお持ちの方はこちら
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </Formik>
        </div>
        <Modal
                isOpen={sendEmail}
                onRequestClose={()=>{
                    setSendEmail(false);
                }}
                style={modalStyle}
                ariaHideApp={false}
            >
                <div className={styles.send_mail_container}>
                <div>
                    <p className={styles.send_mail_p}>ご登録いただいたメールアドレスに確認メールを送信しました。</p>
                    <p className={styles.send_mail_p}>メールより本登録をお願いします。</p>
                </div>
                <div>
                    <Button
                        variant="contained" color="primary"
                        onClick={()=>{setSendEmail(false)}}
                    >
                        OK
                    </Button>
                </div>
                </div>
        </Modal>
        </>
    )
}

export default SignUp
