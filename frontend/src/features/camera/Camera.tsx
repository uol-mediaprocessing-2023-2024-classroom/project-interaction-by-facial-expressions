import * as classNames from 'classnames';
import * as React from 'react';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import Webcam from 'react-webcam';
import {useAppSelector} from '../../app/hooks';
import {SocketEvent} from '../../common/enums/SocketEvent';
import {useSocketEventHook} from '../../common/hooks/useSocketEventHook';
import {ReturnedFaceEmotionSchema} from '../../common/schemas/ReturnedFaceEmotionSchema';
import {ReturnedImageAnalysisSchema} from '../../common/schemas/ReturnedImageAnalysisSchema';
import {socket} from '../../common/socket';
import {selectFaceDetectorBackend, selectIsEmojiShown, selectIsGridShown} from '../settings-menu/settingsMenuSlice';
import styles from './Camera.less';

const width = 480;
const height = 360;
const fps = 15;

const Camera = () => {
    const [webcamKey, setWebcamKey] = useState(0);
    const webcamRef = useRef<Webcam>(null);
    const [hasWebcamBeenReactivated, setHasWebcamBeenReactivated] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentEmotion, setCurrentEmotion] = useState('neutral');
    const isGridShown = useAppSelector(state => selectIsGridShown(state));
    const isEmojiShown = useAppSelector(state => selectIsEmojiShown(state));
    const faceDetectorBackend = useAppSelector(state => selectFaceDetectorBackend(state));

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.setAttribute('width', String(width));
            canvas.setAttribute('height', String(height));
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const screenshot = webcamRef.current?.getScreenshot();
            if (screenshot && hasWebcamBeenReactivated) {
                socket.emit(SocketEvent.WEBCAM_STREAM, {
                    screenshot,
                    faceDetectorBackend
                });
            }
        }, 1000 / fps);

        const listener = (response: any) => {
            const canvas = canvasRef.current;
            if (canvas == null) {
                return;
            }

            const ctx = canvas.getContext('2d');
            if (ctx == null) {
                return;
            }

            if (!isGridShown) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            const imageAnalysis = ReturnedImageAnalysisSchema.parse(response);
            navigator.mediaDevices.getUserMedia({video: true})
                    .then(_ => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        const {
                            headPose: {
                                boundingBox,
                                leftEye,
                                rightEye,
                                nose
                            }
                        } = imageAnalysis;

                        ctx.strokeStyle = 'lime';
                        ctx.lineWidth = 2;

                        // Draw the bounding box
                        ctx.beginPath();
                        ctx.rect(
                                boundingBox.minX,
                                boundingBox.minY,
                                boundingBox.width,
                                boundingBox.height
                        );
                        ctx.stroke();

                        // Draw the x axis
                        ctx.strokeStyle = 'red';
                        ctx.beginPath();
                        ctx.moveTo(boundingBox.minX, boundingBox.centerY);
                        ctx.lineTo(boundingBox.minX + boundingBox.width, boundingBox.centerY);
                        ctx.stroke();

                        // Draw the y axis
                        ctx.beginPath();
                        ctx.moveTo(boundingBox.centerX, boundingBox.minY);
                        ctx.lineTo(boundingBox.centerX, boundingBox.minY + boundingBox.height);
                        ctx.stroke();

                        // Draw the circle of the left eye
                        ctx.beginPath();
                        ctx.arc(leftEye.x, leftEye.y, 4, 0, 2 * Math.PI, false);
                        ctx.fillStyle = 'white';
                        ctx.fill();

                        // Draw the circle of the right eye
                        ctx.beginPath();
                        ctx.arc(rightEye.x, rightEye.y, 4, 0, 2 * Math.PI, false);
                        ctx.fillStyle = 'white';
                        ctx.fill();

                        // Draw the circle of the nose
                        ctx.beginPath();
                        ctx.arc(nose.x, nose.y, 4, 0, 2 * Math.PI, false);
                        ctx.fillStyle = 'white';
                        ctx.fill();
                    })
                    .catch(_ => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    });
        };

        socket.on(SocketEvent.CANVAS_UPDATE, listener);

        return () => {
            clearInterval(intervalId);
            socket.off(SocketEvent.CANVAS_UPDATE, listener);
        };
    }, [hasWebcamBeenReactivated, faceDetectorBackend, isGridShown]);

    const reactivateWebcam = useCallback(() => {
        if (hasWebcamBeenReactivated) {
            return;
        }

        setWebcamKey(prevKey => prevKey + 1);
        setHasWebcamBeenReactivated(true);
    }, [hasWebcamBeenReactivated]);

    const handleWebcamNotAccessible = useCallback(() => {
        setHasWebcamBeenReactivated(false);

        const canvas = canvasRef.current;
        if (canvas == null) {
            return;
        }

        const ctx = canvas.getContext('2d');
        if (ctx == null) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, [hasWebcamBeenReactivated]);

    const checkCameraAccess = useCallback(() => {
        navigator.mediaDevices
                .getUserMedia({video: true})
                .then(_ => {
                    reactivateWebcam();
                })
                .catch(_ => {
                    handleWebcamNotAccessible();
                });
    }, [reactivateWebcam, handleWebcamNotAccessible]);

    useEffect(() => {
        checkCameraAccess();
        const intervalId = setInterval(checkCameraAccess, 1000);
        return () => clearInterval(intervalId);
    }, [checkCameraAccess]);

    useSocketEventHook(
            SocketEvent.FACE_EMOTION,
            (response: any) => {
                const faceEmotionEvent = ReturnedFaceEmotionSchema.parse(response);
                setCurrentEmotion(faceEmotionEvent.emotion);
            }
    );

    return (
            <div className={styles.component}>
                <Webcam
                        key={webcamKey}
                        ref={webcamRef}
                        audio={false}
                        mirrored={true}
                        width={width}
                        height={height}
                />
                <canvas className={styles.canvas} ref={canvasRef}/>
                {isEmojiShown &&
                        <div className={classNames(
                                styles.emoji,
                                {[styles.angry]: currentEmotion === 'angry'},
                                {[styles.disgust]: currentEmotion === 'disgust'},
                                {[styles.fear]: currentEmotion === 'fear'},
                                {[styles.happy]: currentEmotion === 'happy'},
                                {[styles.sad]: currentEmotion === 'sad'},
                                {[styles.surprise]: currentEmotion === 'surprise'},
                                {[styles.neutral]: currentEmotion === 'neutral'}
                        )}></div>
                }
                {!hasWebcamBeenReactivated &&
                        <div className={styles.backdrop}></div>
                }
            </div>
    );
};

export default Camera;
