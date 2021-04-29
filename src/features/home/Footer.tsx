import React from 'react'
import styles from "./Home.module.css";
import { Link } from 'react-router-dom';

const Footer:React.FC = () => {
    return (
        <footer className={styles.footer_container}>
            <div className={styles.footer_p_div}>
                <p className={styles.footer_p}>
                    <Link to="/contact" className={styles.footer_link} onClick={()=>{window.scrollTo(0, 0);}}>お問い合わせ</Link>
                </p>
            </div>
            <div className={styles.footer_p_div}>
                <p className={styles.footer_p}>
                    <Link to="/disclaimer" className={styles.footer_link} onClick={()=>{window.scrollTo(0, 0);}}>免責事項</Link>
                </p>
            </div>
        </footer>
    )
}

export default Footer
