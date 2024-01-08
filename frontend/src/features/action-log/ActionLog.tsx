import * as moment from 'moment';
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';

import {z} from 'zod';
import {ACTION_LOG_EVENT, socket} from '../../common/socket';
import styles from './ActionLog.less';

const ReturnedActionLogSchema = z.object({
    timestamp: z.number(),
    message: z.string()
});

interface ReturnedActionLog extends z.infer<typeof ReturnedActionLogSchema> {
}

const formatDate = (timestamp: number) => moment(timestamp * 1000).format('HH:mm:ss:SSS');

const ActionLog = () => {
    const actionLogRef = useRef<HTMLDivElement>(null);
    const [actionLogs, addActionLog] = useState<ReturnedActionLog[]>([]);
    const [actionLogsLength, setActionLogsLength] = useState(0);
    useEffect(() => {
        socket.on(ACTION_LOG_EVENT, (response) => {
            addActionLog(actionLogs => {
                const result = [...actionLogs, ReturnedActionLogSchema.parse(response)];
                setActionLogsLength(result.length);
                return result;
            });
        });

        return () => {
            socket.off(ACTION_LOG_EVENT);
        };
    }, []);

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
