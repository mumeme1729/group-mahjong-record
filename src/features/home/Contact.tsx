import { Button, TextField } from '@material-ui/core';
import { Formik } from 'formik';
import React,{useState} from 'react'
import styles from "./Home.module.css";
import * as Yup from "yup";
import { AppDispatch } from '../../app/store';
import { useDispatch } from 'react-redux';
import { fetchAsyncPostContact } from './homeSlice';

const Contact:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [sendmail,setSendMail]=useState(false);
    return (
        <div className={styles.contact_container}>
            {!sendmail?
            <div className={styles.contact_body}>
                <h3>お問い合わせ</h3>
                <Formik
                    initialErrors={{ email: "required" }}
                    initialValues={{ email: "",text: "",title:""}}
                    
                    onSubmit={async (values) => {
                        setSendMail(true);
                        const contact_packet={sender: values.email,title:values.title,message:values.text}
                        await dispatch(fetchAsyncPostContact(contact_packet));
                        
                    }}
                    //バリデーション
                    validationSchema={Yup.object().shape({
                        email: Yup.string()
                                .email("メールアドレスが不正です。")
                                .required("メールアドレスは必須です。"),
                        title: Yup.string().required("件名は必須です。"),
                        text: Yup.string().required("内容は必須です。"),
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
                                    <TextField
                                        label="件名"
                                        placeholder="件名(必須)"
                                        type="input"
                                        name="title"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.title}
                                        variant="outlined"
                                        fullWidth
                                    />
                                    <br />
                                    {touched.title && errors.title ? (
                                        <div >{errors.title}</div>
                                        ) : null}
                                    <br />
                                    <TextField
                                        label="お問い合わせ内容(必須)"
                                        type="input"
                                        name="text"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        value={values.text}
                                        multiline
                                        rows={10}
                                        variant="outlined"
                                    />
                                    <br/>
                                    {touched.text && errors.text ? (
                                        <div >{errors.text}</div>
                                        ) : null}
                                    <br />
                                    <br/>
                                </div>
                                <Button variant="contained" color="primary" disabled={!isValid} type="submit">
                                    送信
                                </Button>
                            </form>
                        </div>  
                    )}
                </Formik>
            </div>
            :<div><h3>送信が完了しました。</h3></div>}
        </div>
    )
}

export default Contact
