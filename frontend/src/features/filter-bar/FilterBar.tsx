import * as classNames from 'classnames';
import * as React from 'react';
import {useEffect} from 'react';
import {z} from 'zod';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {EYE_BLINK_EVENT, HEAD_POSE_EVENT, socket} from '../../common/socket';
import {mod} from '../../common/utils/mod';
import {ProcessImageAction, selectImages, useProcessImageMutation} from '../api/apiSlice';
import {selectCurrentIndex} from '../carousel/carouselSlice';
import styles from './FilterBar.less';
import {selectFocusedFilter, setFocusedFilter} from './filterBarSlice';

const ReturnedHeadPoseEventSchema = z.object({
    direction: z.string()
});

const ReturnedEyeBlinkEventSchema = z.object({
    which: z.string()
});

const FilterBar = () => {
    const [processImage] = useProcessImageMutation();
    const dispatch = useAppDispatch();
    const focusedFilter = useAppSelector(state => selectFocusedFilter(state));
    const currentIndex = useAppSelector(state => selectCurrentIndex(state));
    const images = useAppSelector(state => selectImages(state));
    const currentImage = images[currentIndex];
    const isBlurButtonDisabled = currentImage?.appliedFilter == ProcessImageAction.BLUR_FILTER;
    const isInvertButtonDisabled = currentImage?.appliedFilter == ProcessImageAction.INVERT_FILTER;
    const isBlackAndWhiteButtonDisabled = currentImage?.appliedFilter == ProcessImageAction.BLACK_AND_WHITE_FILTER;

    useEffect(() => {
        const listener = (response: any) => {
            const eyeBlinkEvent = ReturnedHeadPoseEventSchema.parse(response);
            if (eyeBlinkEvent.direction === 'head-looks-up') {
                dispatch(setFocusedFilter(mod(focusedFilter - 1, 4)));
            } else if (eyeBlinkEvent.direction === 'head-looks-down') {
                dispatch(setFocusedFilter(mod(focusedFilter + 1, 4)));
            }
        };

        socket.on(HEAD_POSE_EVENT, listener);

        return () => {
            socket.off(HEAD_POSE_EVENT, listener);
        };
    }, [focusedFilter]);

    useEffect(() => {
        const listener = (response: any) => {
            const eyeBlinkEvent = ReturnedEyeBlinkEventSchema.parse(response);
            if (eyeBlinkEvent.which === 'both-eyes-closed') {
                if (!isBlurButtonDisabled && focusedFilter === 1) {
                    processImage({
                        id: currentImage.id,
                        action: ProcessImageAction.BLUR_FILTER
                    });
                } else if (!isInvertButtonDisabled && focusedFilter === 2) {
                    processImage({
                        id: currentImage.id,
                        action: ProcessImageAction.INVERT_FILTER
                    });
                } else if (!isBlackAndWhiteButtonDisabled && focusedFilter === 3) {
                    processImage({
                        id: currentImage.id,
                        action: ProcessImageAction.BLACK_AND_WHITE_FILTER
                    });
                }
            }
        };

        socket.on(EYE_BLINK_EVENT, listener);

        return () => {
            socket.off(EYE_BLINK_EVENT, listener);
        };
    }, [isBlurButtonDisabled, isInvertButtonDisabled, isBlackAndWhiteButtonDisabled, focusedFilter, currentImage]);

    return (
            <div className={styles.component}>
                <div className={classNames(styles.button, isBlurButtonDisabled ? styles.disabled : null, {[styles.focused]: focusedFilter === 1})}
                     onClick={() => {
                         if (!isBlurButtonDisabled) {
                             processImage({
                                 id: currentImage.id,
                                 action: ProcessImageAction.BLUR_FILTER
                             });
                         }
                     }}>
                    Blur
                </div>
                <div className={classNames(styles.button, isInvertButtonDisabled ? styles.disabled : null, {[styles.focused]: focusedFilter === 2})}
                     onClick={() => {
                         if (!isInvertButtonDisabled) {
                             processImage({
                                 id: currentImage.id,
                                 action: ProcessImageAction.INVERT_FILTER
                             });
                         }
                     }}>
                    Invert
                </div>
                <div className={classNames(styles.button, isBlackAndWhiteButtonDisabled ? styles.disabled : null, {[styles.focused]: focusedFilter === 3})}
                     onClick={() => {
                         if (!isBlackAndWhiteButtonDisabled) {
                             processImage({
                                 id: currentImage.id,
                                 action: ProcessImageAction.BLACK_AND_WHITE_FILTER
                             });
                         }
                     }}>
                    Black and white
                </div>
            </div>
    );
};

export default FilterBar;
