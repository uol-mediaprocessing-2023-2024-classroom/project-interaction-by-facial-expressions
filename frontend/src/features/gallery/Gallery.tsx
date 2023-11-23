import * as classNames from 'classnames';
import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {v4 as uuid} from 'uuid';
import {AppDispatch, RootState} from '../../store';
import {createDataURI} from '../../utils/create-data-uri';
import {CarouselState, selectImage} from '../carousel/carouselSlice';
import styles from './Gallery.less';

const Gallery = () => {
    const {
        images,
        index
    } = useSelector<RootState, CarouselState>(state => state.carousel);
    const dispatch = useDispatch<AppDispatch>();
    return (
            <div className={styles.component}>
                <div className={styles.gallery}>
                    {
                        images.map((image, currentIndex) => (
                                <div key={uuid()}
                                     className={classNames(styles.image, currentIndex == index ? styles.selected : null)}
                                     onClick={() => dispatch(selectImage(currentIndex))}>
                                    <img src={createDataURI(image)} alt={''}/>
                                </div>
                        ))
                    }
                </div>
                {/*<div className={styles.loadMore}>
                    <div className={styles.button}>Load more</div>
                </div>*/}
            </div>
    );
};

export default Gallery;
