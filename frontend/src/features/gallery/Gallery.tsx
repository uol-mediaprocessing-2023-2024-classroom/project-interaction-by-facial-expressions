import * as classNames from 'classnames';
import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectImages} from '../api/apiSlice';
import {setCurrentIndex} from '../carousel/carouselSlice';
import styles from './Gallery.less';

const Gallery = () => {
    const dispatch = useAppDispatch();
    const images = useAppSelector(state => selectImages(state));
    const currentIndex = useAppSelector(state => state.carousel.currentIndex);
    return (
            <div className={styles.component}>
                <div className={styles.gallery}>
                    {(
                            images.map((image, index) => (
                                    <div key={image.id}
                                         className={classNames(styles.image, index == currentIndex ? styles.selected : null)}
                                         onClick={() => dispatch(setCurrentIndex(index))}>
                                        <img src={image.url} alt=""/>
                                    </div>
                            ))
                    )}
                </div>
                {/*
                Will we use a button to load more images?
                <div className={styles.loadMore}>
                    <div className={styles.button}>Load more</div>
                </div>
                */}
            </div>
    );
};

export default Gallery;
