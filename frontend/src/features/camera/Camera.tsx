import * as React from 'react';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import Webcam from 'react-webcam';
import {z} from 'zod';
import {CANVAS_UPDATE_EVENT, socket, WEBCAM_STREAM_EVENT} from '../../common/socket';
import styles from './Camera.less';

const width = 480;
const height = 360;
const fps = 15;

const ReturnedImageAnalysisSchema = z.object({
    headPose: z.object({
        direction: z.string(),
        boundingBox: z.object({
            width: z.number(),
            height: z.number(),
            minX: z.number(),
            minY: z.number(),
            centerX: z.number(),
            centerY: z.number()
        }),
        leftEye: z.object({
            x: z.number(),
            y: z.number()
        }),
        rightEye: z.object({
            x: z.number(),
            y: z.number()
        }),
        nose: z.object({
            x: z.number(),
            y: z.number()
        })
    })
});

const Camera = () => {
    const [webcamKey, setWebcamKey] = useState(0);
    const webcamRef = useRef<Webcam>(null);
    const [hasWebcamBeenReactivated, setHasWebcamBeenReactivated] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.setAttribute('width', String(width));
            canvas.setAttribute('height', String(height));
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const data = webcamRef.current?.getScreenshot();
            if (data && hasWebcamBeenReactivated) {
                socket.emit(WEBCAM_STREAM_EVENT, data);
            }
        }, 1000 / fps);

        socket.on(CANVAS_UPDATE_EVENT, response => {
            const canvas = canvasRef.current;
            if (canvas == null) {
                return;
            }

            const ctx = canvas.getContext('2d');
            if (ctx == null) {
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

                        ctx.strokeStyle = 'green';
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
        });

        return () => {
            socket.off(CANVAS_UPDATE_EVENT);
            clearInterval(intervalId);
        };
    }, [hasWebcamBeenReactivated]);

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
            </div>
    );
};

export default Camera;
