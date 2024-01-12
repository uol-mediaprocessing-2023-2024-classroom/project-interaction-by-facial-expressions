import * as classNames from 'classnames';
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {z} from 'zod';
import Spinner from '../common/components/spinner/Spinner';
import {HEAD_POSE_EVENT, socket} from '../common/socket';
import ActionLog from '../features/action-log/ActionLog';
import {useGetImagesQuery} from '../features/api/apiSlice';
import Camera from '../features/camera/Camera';
import Carousel from '../features/carousel/Carousel';
import Gallery from '../features/gallery/Gallery';
import Help from '../features/help/Help';
import UploadArea from '../features/upload-area/UploadArea';
import styles from './App.less';

const ReturnedHeadPoseEventSchema = z.object({
    direction: z.string()
});

const App = () => {
    const {isLoading} = useGetImagesQuery();
    const [siteMapIndex, setSiteMapIndex] = useState(0);
    const header = useRef<HTMLDivElement>(null);
    const navigationSection = useRef<HTMLElement>(null);
    const carouselSection = useRef<HTMLElement>(null);
    const uploadAreaSection = useRef<HTMLElement>(null);
    const gallerySection = useRef<HTMLElement>(null);
    const siteMap = [
        header,
        carouselSection,
        uploadAreaSection,
        gallerySection
    ];

    useEffect(() => {
        const listener = (response: any) => {
            const headPoseEvent = ReturnedHeadPoseEventSchema.parse(response);
            if (headPoseEvent.direction === 'head-looks-left' && siteMapIndex > 0) {
                setSiteMapIndex(prevIndex => prevIndex - 1);
            } else if (headPoseEvent.direction === 'head-looks-right' && siteMapIndex < siteMap.length - 1) {
                setSiteMapIndex(prevIndex => prevIndex + 1);
            }
        };

        socket.on(HEAD_POSE_EVENT, listener);

        return () => {
            socket.off(HEAD_POSE_EVENT, listener);
        };
    }, [siteMapIndex]);

    useEffect(() => {
        const navigationOffsetHeight = navigationSection.current?.offsetHeight ?? 0;
        const siteOffsetTop = siteMap[siteMapIndex].current?.offsetTop ?? 0;
        window.scrollTo({
            top: siteOffsetTop - navigationOffsetHeight,
            behavior: 'smooth'
        });
    }, [siteMapIndex]);

    return (
            <>
                <div className={styles.header} ref={header}>
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
                            <div className={styles.shadow}/>
                            <section
                                    className={classNames(styles.section, {[styles.focused]: siteMapIndex === 0}, styles.stickyTriggerArea)}
                                    ref={navigationSection}>
                                <div className={styles.triggerArea}>
                                    <Help/>
                                    <Camera/>
                                    <ActionLog/>
                                </div>
                            </section>
                            <section className={classNames(styles.section, {[styles.focused]: siteMapIndex === 1})}
                                     ref={carouselSection}>
                                <Carousel/>
                            </section>
                            <section className={classNames(styles.section, {[styles.focused]: siteMapIndex === 2})}
                                     ref={uploadAreaSection}>
                                <UploadArea/>
                            </section>
                            <section className={classNames(styles.section, {[styles.focused]: siteMapIndex === 3})}
                                     ref={gallerySection}>
                                <Gallery/>
                            </section>
                            {/*<ManualModeSwitch/>*/}
                        </> : null
                }
            </>
    );
};

export default App;
