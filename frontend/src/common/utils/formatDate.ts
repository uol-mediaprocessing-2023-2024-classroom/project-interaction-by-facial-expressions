import * as moment from 'moment/moment';

export const formatDate = (timestamp: number) => moment(timestamp * 1000).format('HH:mm:ss:SSS');
