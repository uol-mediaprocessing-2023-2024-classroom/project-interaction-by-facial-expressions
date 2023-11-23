import * as React from 'react';
import styles from './App.less';
import ActionLog from './features/action-log/ActionLog';
import Camera from './features/camera/Camera';
import Carousel from './features/carousel/Carousel';
import Gallery from './features/gallery/Gallery';
import Help from './features/help/Help';

const App = () => {
    return (
            <>
                <div className={styles.header}>
                    <h1>Interaction by Facial Expressions</h1>
                </div>
                <div className={styles.triggerArea}>
                    <Help/>
                    <Camera/>
                    <ActionLog/>
                </div>
                <Carousel/>
                <Gallery/>
            </>
    );
};

export default App;
