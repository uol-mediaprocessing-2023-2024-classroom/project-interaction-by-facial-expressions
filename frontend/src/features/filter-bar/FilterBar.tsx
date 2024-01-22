import * as classNames from 'classnames';
import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {HeadPoseEvent} from '../../common/enums/HeadPoseEvent';
import {Section} from '../../common/enums/Section';
import {SocketEvent} from '../../common/enums/SocketEvent';
import {useSocketEventOnFocusedSectionHook} from '../../common/hooks/useSocketEventOnFocusedSectionHook';
import {ReturnedHeadPoseEventSchema} from '../../common/schemas/ReturnedHeadPoseEventSchema';
import {mod} from '../../common/utils/mod';
import {ProcessImageAction, selectImages, useProcessImageMutation} from '../api/apiSlice';
import {selectCurrentIndex} from '../carousel/carouselSlice';
import styles from './FilterBar.less';
import {selectFocusedFilter, setFocusedFilter} from './filterBarSlice';

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

    useSocketEventOnFocusedSectionHook(
            SocketEvent.HEAD_POSE,
            (response: any) => {
                const headPoseEvent = ReturnedHeadPoseEventSchema.parse(response);
                if (headPoseEvent.direction === HeadPoseEvent.LEFT) {
                    dispatch(setFocusedFilter(mod(focusedFilter - 1, 4)));
                } else if (headPoseEvent.direction === HeadPoseEvent.RIGHT) {
                    dispatch(setFocusedFilter(mod(focusedFilter + 1, 4)));
                } else if (headPoseEvent.direction === HeadPoseEvent.DOWN) {
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
            },
            [
                isBlurButtonDisabled,
                isInvertButtonDisabled,
                isBlackAndWhiteButtonDisabled,
                focusedFilter,
                currentImage
            ],
            [Section.CAROUSEL]
    );

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
