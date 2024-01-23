import * as React from 'react';
import {useAppSelector} from '../../app/hooks';
import {selectImages} from '../api/apiSlice';
import styles from './OverlayImage.less';
import {selectIsOverlayImageShown} from './overlayImageSlice';

const OverlayImage = () => {
    const isShown = useAppSelector(state => selectIsOverlayImageShown(state));
    const images = useAppSelector(state => selectImages(state));
    const currentIndex = useAppSelector(state => state.carousel.currentIndex);
    const image = images.find((image, index) => index === currentIndex);
    return isShown && image != null ?
            (<div className={styles.component}>
                <img src={image.url} alt=""/>
            </div>)
            : null;
};

export default OverlayImage;
