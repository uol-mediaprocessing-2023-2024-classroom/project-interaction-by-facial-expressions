import * as React from 'react';
import Webcam from 'react-webcam';
import styles from './Camera.less';

const cameraWidth = 480;
const cameraHeight = 360;

const Camera = () => (
    <Webcam
        className={styles.component}
        audio={false}
        mirrored={true}
        width={cameraWidth}
        height={cameraHeight}
    />
);

export default Camera;
