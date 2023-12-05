import * as React from 'react';
import Spinner from '../common/components/spinner/Spinner';
import ActionLog from '../features/action-log/ActionLog';
import {useGetImagesQuery} from '../features/api/apiSlice';
import Camera from '../features/camera/Camera';
import Carousel from '../features/carousel/Carousel';
import Gallery from '../features/gallery/Gallery';
import Help from '../features/help/Help';
import ManualModeSwitch from '../features/manual-mode-switch/ManualModeSwitch';
import UploadArea from '../features/upload-area/UploadArea';
import styles from './App.less';

const App = () => {
    const {isLoading} = useGetImagesQuery();
    return (
            <>
                <div className={styles.header}>
                    <h1>Interaction by Facial Expressions</h1>
                    {isLoading ?
                            <>
                                <Spinner/>
                                <p>Application is loading</p>
                            </> : null
                    }
                </div>
                {!isLoading ?
                        <>
                            <div className={styles.triggerArea}>
                                <Help/>
                                <Camera/>
                                <ActionLog/>
                            </div>
                            <Carousel/>
                            <UploadArea/>
                            <Gallery/>
                            <ManualModeSwitch/>
                        </> : null
                }
            </>
    );
};

export default App;
