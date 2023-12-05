import * as classNames from 'classnames';
import * as React from 'react';
import {useAppSelector} from '../../app/hooks';
import {ProcessImageAction, selectImages, useProcessImageMutation} from '../api/apiSlice';
import {selectCurrentIndex} from '../carousel/carouselSlice';
import styles from './FilterBar.less';

const FilterBar = () => {
    const [processImage] = useProcessImageMutation();
    const currentIndex = useAppSelector(state => selectCurrentIndex(state));
    const images = useAppSelector(state => selectImages(state));
    const currentImage = images[currentIndex];
    const isBlurButtonDisabled = currentImage?.appliedFilter == ProcessImageAction.BLUR_FILTER;
    const isInvertButtonDisabled = currentImage?.appliedFilter == ProcessImageAction.INVERT_FILTER;
    const isBlackAndWhiteButtonDisabled = currentImage?.appliedFilter == ProcessImageAction.BLACK_AND_WHITE_FILTER;
    return (
            <div className={styles.component}>
                <div className={classNames(styles.button, isBlurButtonDisabled ? styles.disabled : null)}
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
                <div className={classNames(styles.button, isInvertButtonDisabled ? styles.disabled : null)}
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
                <div className={classNames(styles.button, isBlackAndWhiteButtonDisabled ? styles.disabled : null)}
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
