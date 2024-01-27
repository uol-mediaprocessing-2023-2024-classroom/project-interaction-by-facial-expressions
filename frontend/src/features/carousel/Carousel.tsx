import * as classNames from 'classnames';
import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {EyeBlinkEvent} from '../../common/enums/EyeBlinkEvent';
import {HeadPoseEvent} from '../../common/enums/HeadPoseEvent';
import {Section} from '../../common/enums/Section';
import {SocketEvent} from '../../common/enums/SocketEvent';
import {useSocketEventOnFocusedSectionHook} from '../../common/hooks/useSocketEventOnFocusedSectionHook';
import {ReturnedEyeBlinkEventSchema} from '../../common/schemas/ReturnedEyeBlinkEventSchema';
import {ReturnedHeadPoseEventSchema} from '../../common/schemas/ReturnedHeadPoseEventSchema';
import {mod} from '../../common/utils/mod';
import {ProcessImageAction, selectImages, useProcessImageMutation} from '../api/apiSlice';
import FilterBar from '../filter-bar/FilterBar';
import {selectFocusedFilter} from '../filter-bar/filterBarSlice';
import styles from './Carousel.less';
import {setCurrentIndex} from './carouselSlice';

const Carousel = () => {
    const dispatch = useAppDispatch();
    const images = useAppSelector(state => selectImages(state));
    const [processImage] = useProcessImageMutation();
    const currentIndex = useAppSelector(state => state.carousel.currentIndex);
    const currentImage = images[currentIndex];
    const previousIndex = mod(currentIndex - 1, images.length);
    const previousImage = images[previousIndex];
    const nextIndex = mod(currentIndex + 1, images.length);
    const nextImage = images[nextIndex];
    const isUndoButtonDisabled = !currentImage?.hasBeenProcessed;
    const focusedFilter = useAppSelector(state => selectFocusedFilter(state));

    useSocketEventOnFocusedSectionHook(
            SocketEvent.EYE_BLINK,
            (response: any) => {
                const eyeBlinkEvent = ReturnedEyeBlinkEventSchema.parse(response);
                if (eyeBlinkEvent.which === EyeBlinkEvent.LEFT) {
                    dispatch(setCurrentIndex(previousIndex));
                } else if (eyeBlinkEvent.which === EyeBlinkEvent.RIGHT) {
                    dispatch(setCurrentIndex(nextIndex));
                }
            },
            [previousIndex, nextIndex],
            [Section.CAROUSEL, Section.GALLERY]
    );

    useSocketEventOnFocusedSectionHook(
            SocketEvent.HEAD_POSE,
            (response: any) => {
                const headPoseEvent = ReturnedHeadPoseEventSchema.parse(response);
                if (headPoseEvent.direction === HeadPoseEvent.DOWN) {
                    if (focusedFilter === 0) {
                        processImage({id: currentImage.id, action: ProcessImageAction.RESET_FILTER});
                    }
                }
            },
            [focusedFilter, currentImage],
            [Section.CAROUSEL]
    );

    return (
            <div className={styles.component}>
                <div className={styles.carousel}>
                    <div className={classNames(styles.preview, styles.left)}>
                        <div className={styles.content}>
                            <h3>Previous Photo</h3>
                            <img src={previousImage?.url} alt=""
                                 onClick={() => dispatch(setCurrentIndex(previousIndex))}/>
                        </div>
                    </div>
                    <div className={styles.currentImage}>
                        <img src={currentImage?.url} alt=""/>
                        <FilterBar/>
                    </div>
                    <div className={classNames(styles.preview, styles.right)}>
                        <div className={styles.content}>
                            <h3>Next Photo</h3>
                            <img src={nextImage?.url} alt="" onClick={() => dispatch(setCurrentIndex(nextIndex))}/>
                        </div>
                    </div>
                </div>
                <div
                        className={classNames(styles.undoButton, isUndoButtonDisabled ? styles.disabled : null, {[styles.focused]: focusedFilter === 0})}
                        onClick={() => processImage({id: currentImage.id, action: ProcessImageAction.RESET_FILTER})}>
                    Undo
                </div>
            </div>
    );
};

export default Carousel;
