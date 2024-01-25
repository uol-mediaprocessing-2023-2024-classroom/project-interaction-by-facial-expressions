import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {SocketEvent} from '../../common/enums/SocketEvent';
import {useSocketEventHook} from '../../common/hooks/useSocketEventHook';
import {ReturnedActionLogSchema} from '../../common/schemas/ReturnedActionLogSchema';
import {ReturnedActionLog} from '../../common/types/ReturnedActionLog';
import {formatDate} from '../../common/utils/formatDate';
import styles from './ActionLog.less';

const ActionLog = () => {
    const actionLogRef = useRef<HTMLDivElement>(null);
    const [actionLogs, addActionLog] = useState<ReturnedActionLog[]>([]);
    const [actionLogsLength, setActionLogsLength] = useState(0);

    useSocketEventHook(
            SocketEvent.ACTION_LOG,
            (response) => {
                addActionLog(actionLogs => {
                    const result = [...actionLogs, ReturnedActionLogSchema.parse(response)];
                    setActionLogsLength(result.length);
                    return result;
                });
            }
    );

    useEffect(() => {
        if (actionLogRef.current) {
            actionLogRef.current.scrollTop = actionLogRef.current.scrollHeight;
        }
    }, [actionLogsLength]);

    return (
            <div>
                <h2>Action Log</h2>
                <div className={styles.component} ref={actionLogRef}>
                    {actionLogs.map(actionLog => (
                            <div key={actionLog.timestamp} className={styles.message}>
                                <div>{formatDate(actionLog.timestamp)}</div>
                                <div>{actionLog.message}</div>
                            </div>
                    ))}
                </div>
            </div>
    );
};

export default ActionLog;
