import * as React from 'react';
import styles from './ActionLog.less';

const ActionLog = () => (
        <>
            <h2>Action Log</h2>
            <div className={styles.component}>
                <div className={styles.message}>
                    <div>13:37:00:100</div>
                    <div>Go to next photo</div>
                </div>
                <div className={styles.message}>
                    <div>13:37:00:200</div>
                    <div>Go to previous photo</div>
                </div>
                <div className={styles.message}>
                    <div>13:37:00:300</div>
                    <div>No command recognized</div>
                </div>
            </div>
        </>
);

export default ActionLog;
