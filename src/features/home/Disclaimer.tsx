import React from 'react'
import styles from "./Home.module.css";

const Disclaimer:React.FC = () => {
    return (
        <div className={styles.contact_container}>
            <div className={styles.contact_body}>
                <h1>免責事項</h1>
                <p>・本サイトにおける内容の変更、中断、終了によって生じたいかなる損害についても一切責任を負いません。</p>
                <p>・本サービスを利用したことにより直接的または間接的に利用者に発生した損害について、一切賠償責任を負いません。</p>
            </div>
        </div>
    )
}

export default Disclaimer
