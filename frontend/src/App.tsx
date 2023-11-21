import * as React from 'react';
import styles from './App.less';
import ActionLog from './features/action-log/ActionLog';
import Camera from './features/camera/Camera';
import Carousel from './features/carousel/Carousel';
import Help from './features/help/Help';

const App = () => (
    <>
        <div className={styles.top}>
            <h1>Interaction by Facial Expressions</h1>
        </div>
        <div className={styles.center}>
            <div>
                <Help/>
            </div>
            <div>
                <Camera/>
            </div>
            <div>
                <ActionLog/>
            </div>
        </div>
        <div className={styles.bottom}>
            <Carousel/>
        </div>
    </>
);

export default App;
