import {io} from 'socket.io-client';

export const ACTION_LOG_EVENT = 'action-log';
export const WEBCAM_STREAM_EVENT = 'webcam-stream';
export const CANVAS_UPDATE_EVENT = 'canvas-update';
export const socket = io('http://localhost:9001');
