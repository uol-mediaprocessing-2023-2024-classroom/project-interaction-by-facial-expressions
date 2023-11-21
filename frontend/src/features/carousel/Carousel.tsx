import * as classNames from 'classnames';
import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store';
import {createDataURI} from '../../utils/create-data-uri';
import FilterBar from '../filter-bar/FilterBar';
import styles from './Carousel.less';
import {CarouselState, nextImage, previousImage, resetCurrentImage} from './carouselSlice';

const Carousel = () => {
    const {
        previewLeft,
        currentImage,
        previewRight
    } = useSelector<RootState, CarouselState>(state => state.carousel);
    const dispatch = useDispatch<AppDispatch>();

    const undo = () => {
        if (currentImage.isUnchanged) {
            return;
        }
        dispatch(resetCurrentImage());
    };

    return (
            <>
                <div className={styles.component}>
                    <div className={classNames(styles.preview, styles.left)}>
                        <div className={styles.content}>
                            <h3>Previous Photo</h3>
                            <img src={createDataURI(previewLeft)} alt="Image of a beautiful being"
                                 onClick={() => dispatch(previousImage())}/>
                        </div>
                    </div>
                    <div className={styles.currentImage}>
                        <img src={createDataURI(currentImage)} alt="Image of a beautiful being"/>
                        <FilterBar/>
                    </div>
                    <div className={classNames(styles.preview, styles.right)}>
                        <div className={styles.content}>
                            <h3>Next Photo</h3>
                            <img src={createDataURI(previewRight)} alt="Image of a beautiful being"
                                 onClick={() => dispatch(nextImage())}/>
                        </div>
                    </div>
                </div>
                <div className={classNames(styles.undoButton, currentImage.isUnchanged ? styles.disabled : null)}
                     onClick={undo}>Undo
                </div>
            </>
    );
};

export default Carousel;
