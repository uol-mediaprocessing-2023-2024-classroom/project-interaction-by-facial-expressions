import * as React from 'react';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import Webcam from 'react-webcam';
import {z} from 'zod';
import {CANVAS_UPDATE_EVENT, socket, WEBCAM_STREAM_EVENT} from '../../common/socket';
import styles from './Camera.less';

const width = 480;
const height = 360;
const fps = 15;

const ReturnedFaceDataSchema = z.object({
    rectangle: z.object({
        x: z.number(),
        y: z.number(),
        w: z.number(),
        h: z.number()
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

            const faceDataSet = ReturnedFaceDataSchema.array().parse(response);
            navigator.mediaDevices.getUserMedia({video: true})
                    .then(_ => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        faceDataSet.forEach(({rectangle}) => {
                            ctx.strokeStyle = 'lime';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
                        });
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
