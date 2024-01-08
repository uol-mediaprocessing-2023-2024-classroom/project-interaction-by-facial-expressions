import * as classNames from 'classnames';
import * as React from 'react';
import {useEffect} from 'react';
import {z} from 'zod';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {EYE_BLINK_EVENT, socket} from '../../common/socket';
import {mod} from '../../common/utils/mod';
import {ProcessImageAction, selectImages, useProcessImageMutation} from '../api/apiSlice';
import FilterBar from '../filter-bar/FilterBar';
import {selectFocusedFilter} from '../filter-bar/filterBarSlice';
import {selectIsChecked} from '../manual-mode-switch/manualModeSwitchSlice';
import styles from './Carousel.less';
import {setCurrentIndex} from './carouselSlice';

const ReturnedEyeBlinkEventSchema = z.object({
    which: z.string()
});

const Carousel = () => {
    const dispatch = useAppDispatch();
    const images = useAppSelector(state => selectImages(state));
    const isManualModeActivated = useAppSelector(state => selectIsChecked(state));
    const [processImage] = useProcessImageMutation();
    const currentIndex = useAppSelector(state => state.carousel.currentIndex);
    const currentImage = images[currentIndex];
    const previousIndex = mod(currentIndex - 1, images.length);
    const previousImage = images[previousIndex];
    const nextIndex = mod(currentIndex + 1, images.length);
    const nextImage = images[nextIndex];
    const isUndoButtonDisabled = !currentImage?.hasBeenProcessed;
    const focusedFilter = useAppSelector(state => selectFocusedFilter(state));
    useEffect(() => {
        const listener = (response: any) => {
            const eyeBlinkEvent = ReturnedEyeBlinkEventSchema.parse(response);
            if (eyeBlinkEvent.which === 'left-eye-closed') {
                dispatch(setCurrentIndex(previousIndex));
            } else if (eyeBlinkEvent.which === 'right-eye-closed') {
                dispatch(setCurrentIndex(nextIndex));
            } else if (eyeBlinkEvent.which === 'both-eyes-closed') {
                if (focusedFilter === 0) {
                    processImage({id: currentImage.id, action: ProcessImageAction.RESET_FILTER});
                }
            }
        };

        socket.on(EYE_BLINK_EVENT, listener);

        return () => {
            socket.off(EYE_BLINK_EVENT, listener);
        };
    }, [previousIndex, nextIndex, focusedFilter, currentImage]);
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
                        {isManualModeActivated && <FilterBar/>}
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
