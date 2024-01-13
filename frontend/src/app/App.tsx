import * as classNames from 'classnames';
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {z} from 'zod';
import Spinner from '../common/components/spinner/Spinner';
import {HEAD_POSE_EVENT, socket} from '../common/socket';
import {Section} from '../common/types/Section';
import ActionLog from '../features/action-log/ActionLog';
import {useGetImagesQuery} from '../features/api/apiSlice';
import Camera from '../features/camera/Camera';
import Carousel from '../features/carousel/Carousel';
import Gallery from '../features/gallery/Gallery';
import Help from '../features/help/Help';
import UploadArea from '../features/upload-area/UploadArea';
import styles from './App.less';
import {setCurrentSection} from './appSlice';
import {useAppDispatch} from './hooks';

const ReturnedHeadPoseEventSchema = z.object({
    direction: z.string()
});

const App = () => {
    const dispatch = useAppDispatch();
    const {isLoading} = useGetImagesQuery();
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const header = useRef<HTMLDivElement>(null);
    const navigationSection = useRef<HTMLElement>(null);
    const carouselSection = useRef<HTMLElement>(null);
    const uploadAreaSection = useRef<HTMLElement>(null);
    const gallerySection = useRef<HTMLElement>(null);
    const sectionReferences = [
        navigationSection,
        carouselSection,
        uploadAreaSection,
        gallerySection
    ];
    const sections = [
        Section.NAVIGATION,
        Section.CAROUSEL,
        Section.UPLOAD,
        Section.GALLERY
    ];
    const [isNavigationFloating, setIsNavigationFloating] = useState(false);

    useEffect(() => {
        const listener = (response: any) => {
            const headPoseEvent = ReturnedHeadPoseEventSchema.parse(response);
            if (headPoseEvent.direction === 'head-looks-left' && currentSectionIndex > 0) {
                setCurrentSectionIndex(prevIndex => {
                    dispatch(setCurrentSection(sections[--prevIndex]));
                    return prevIndex;
                });
            } else if (headPoseEvent.direction === 'head-looks-right' && currentSectionIndex < sections.length - 1) {
                setCurrentSectionIndex(prevIndex => {
                    dispatch(setCurrentSection(sections[++prevIndex]));
                    return prevIndex;
                });
            }
        };

        socket.on(HEAD_POSE_EVENT, listener);

        return () => {
            socket.off(HEAD_POSE_EVENT, listener);
        };
    }, [currentSectionIndex]);

    useEffect(() => {
        const navigationOffsetHeight = navigationSection.current?.offsetHeight ?? 0;
        const siteOffsetTop = sectionReferences[currentSectionIndex].current?.offsetTop ?? 0;
        window.scrollTo({
            top: siteOffsetTop - navigationOffsetHeight,
            behavior: 'smooth'
        });
    }, [currentSectionIndex]);

    useEffect(() => {
        const eventListener = () => {
            if (navigationSection.current == null) {
                return;
            }
            setIsNavigationFloating(window.scrollY + 1 > navigationSection.current.offsetTop);
        };
        window.addEventListener('scroll', eventListener);
        return () => {
            window.removeEventListener('scroll', eventListener);
        };
    }, []);

    return (
            <div className={styles.app}>
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
                            <section
                                    className={classNames(styles.section, styles.sticky, {[styles.shadow]: isNavigationFloating})}
                                    ref={navigationSection}>
                                <div className={classNames(styles.content, styles.navigation, {[styles.focused]: currentSectionIndex === 0})}>
                                    <Help/>
                                    <Camera/>
                                    <ActionLog/>
                                </div>
                            </section>
                            <section className={styles.section} ref={carouselSection}>
                                <div className={classNames(styles.content, {[styles.focused]: currentSectionIndex === 1})}>
                                    <Carousel/>
                                </div>
                            </section>
                            <section className={styles.section} ref={uploadAreaSection}>
                                <div className={classNames(styles.content, {[styles.focused]: currentSectionIndex === 2})}>
                                    <UploadArea/>
                                </div>
                            </section>
                            <section className={styles.section} ref={gallerySection}>
                                <div className={classNames(styles.content, {[styles.focused]: currentSectionIndex === 3})}>
                                    <Gallery/>
                                </div>
                            </section>
                            {/*<ManualModeSwitch/>*/}
                        </> : null
                }
            </div>
    );
};

export default App;
