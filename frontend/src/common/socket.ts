import {io} from 'socket.io-client';

export const ACTION_LOG_EVENT = 'action-log';
export const HEAD_POSE_EVENT = 'head-pose';
export const FACE_EMOTION_EVENT = 'face-emotion';
export const EYE_BLINK_EVENT = 'eye-blink'
export const WEBCAM_STREAM_EVENT = 'webcam-stream';
export const CANVAS_UPDATE_EVENT = 'canvas-update';
export const socket = io('http://localhost:9001');
