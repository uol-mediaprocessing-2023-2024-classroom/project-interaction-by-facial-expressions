import * as classNames from 'classnames';
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import Spinner from '../common/components/spinner/Spinner';
import {EyeBlinkEvent} from '../common/enums/EyeBlinkEvent';
import {HeadPoseEvent} from '../common/enums/HeadPoseEvent';
import {Section} from '../common/enums/Section';
import {SocketEvent} from '../common/enums/SocketEvent';
import {useSocketEventHook} from '../common/hooks/useSocketEventHook';
import {ReturnedEyeBlinkEventSchema} from '../common/schemas/ReturnedEyeBlinkEventSchema';
import {ReturnedHeadPoseEventSchema} from '../common/schemas/ReturnedHeadPoseEventSchema';
import ActionLog from '../features/action-log/ActionLog';
import {useGetImagesQuery} from '../features/api/apiSlice';
import Camera from '../features/camera/Camera';
import Carousel from '../features/carousel/Carousel';
import Gallery from '../features/gallery/Gallery';
import Help from '../features/help/Help';
import SettingsMenu from '../features/settings-menu/SettingsMenu';
import UploadArea from '../features/upload-area/UploadArea';
import styles from './App.less';
import {selectIsSectionFocused, setCurrentSection, setIsSectionFocused} from './appSlice';
import {useAppDispatch, useAppSelector} from './hooks';

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
    const isSectionFocused = useAppSelector(state => selectIsSectionFocused(state));
    const [isNavigationFloating, setIsNavigationFloating] = useState(false);

    useSocketEventHook(
            SocketEvent.HEAD_POSE,
            (response: any) => {
                if (isSectionFocused) {
                    return;
                }

                const headPoseEvent = ReturnedHeadPoseEventSchema.parse(response);
                if (headPoseEvent.direction === HeadPoseEvent.LEFT && currentSectionIndex > 0) {
                    setCurrentSectionIndex(prevIndex => {
                        dispatch(setCurrentSection(sections[--prevIndex]));
                        return prevIndex;
                    });
                } else if (headPoseEvent.direction === HeadPoseEvent.RIGHT && currentSectionIndex < sections.length - 1) {
                    setCurrentSectionIndex(prevIndex => {
                        dispatch(setCurrentSection(sections[++prevIndex]));
                        return prevIndex;
                    });
                }
            },
            [currentSectionIndex, isSectionFocused]
    );

    useEffect(() => {
        const navigationOffsetHeight = navigationSection.current?.offsetHeight ?? 0;
        const siteOffsetTop = sectionReferences[currentSectionIndex].current?.offsetTop ?? 0;
        window.scrollTo({
            top: siteOffsetTop - navigationOffsetHeight,
            behavior: 'smooth'
        });
    }, [currentSectionIndex]);

    useSocketEventHook(
            SocketEvent.EYE_BLINK,
            (response: any) => {
                const eyeBlinkEvent = ReturnedEyeBlinkEventSchema.parse(response);
                if (eyeBlinkEvent.which === EyeBlinkEvent.BOTH) {
                    dispatch(setIsSectionFocused(!isSectionFocused));
                }
            },
            [isSectionFocused]
    );

    useSocketEventHook(
            SocketEvent.HEAD_POSE,
            (response: any) => {
                const headPoseEvent = ReturnedHeadPoseEventSchema.parse(response);
                if (headPoseEvent.direction === HeadPoseEvent.UP) {
                    dispatch(setIsSectionFocused(!isSectionFocused));
                }
            },
            [isSectionFocused]
    );

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
                                <div className={classNames(
                                        styles.content,
                                        styles.navigation,
                                        {[styles.focused]: currentSectionIndex === 0},
                                        {[styles.fixed]: currentSectionIndex === 0 && isSectionFocused}
                                )}>
                                    <Help/>
                                    <Camera/>
                                    <ActionLog/>
                                </div>
                            </section>
                            <section className={styles.section} ref={carouselSection}>
                                <div className={classNames(
                                        styles.content,
                                        {[styles.focused]: currentSectionIndex === 1},
                                        {[styles.fixed]: currentSectionIndex === 1 && isSectionFocused}
                                )}>
                                    <Carousel/>
                                </div>
                            </section>
                            <section className={styles.section} ref={uploadAreaSection}>
                                <div className={classNames(
                                        styles.content,
                                        {[styles.focused]: currentSectionIndex === 2},
                                        {[styles.fixed]: currentSectionIndex === 2 && isSectionFocused}
                                )}>
                                    <UploadArea/>
                                </div>
                            </section>
                            <section className={styles.section} ref={gallerySection}>
                                <div className={classNames(
                                        styles.content,
                                        {[styles.focused]: currentSectionIndex === 3},
                                        {[styles.fixed]: currentSectionIndex === 3 && isSectionFocused}
                                )}>
                                    <Gallery/>
                                </div>
                            </section>
                            {/*<ManualModeSwitch/>*/}
                            <SettingsMenu/>
                        </> : null
                }
            </div>
    );
};

export default App;
