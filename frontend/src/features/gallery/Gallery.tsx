import * as classNames from 'classnames';
import * as React from 'react';
import {createRef, useEffect, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectImages} from '../api/apiSlice';
import {setCurrentIndex} from '../carousel/carouselSlice';
import styles from './Gallery.less';

const Gallery = () => {
    const dispatch = useAppDispatch();
    const images = useAppSelector(state => selectImages(state));
    const currentIndex = useAppSelector(state => state.carousel.currentIndex);
    const imageRefs: React.RefObject<HTMLDivElement>[] = useMemo(() => images.map(() => React.createRef()), [images]);
    const galleryRef = createRef<HTMLDivElement>();

    useEffect(() => {
        if (imageRefs[currentIndex] && galleryRef.current) {
            const selectedImageElement = imageRefs[currentIndex].current;
            const galleryElement = galleryRef.current;

            if (galleryElement == null || selectedImageElement == null) {
                return;
            }

            // TODO: galleryElement.scrollTop = selectedImageElement.offsetTop - galleryElement.offsetTop;
            galleryElement.scrollTo({
                top: selectedImageElement.offsetTop - galleryElement.offsetTop,
                behavior: 'smooth'
            });
        }
    }, [galleryRef, currentIndex]);

    return (
            <div className={styles.component} ref={galleryRef}>
                <div className={styles.gallery}>
                    {(
                            images.map((image, index) => (
                                    <div key={image.id}
                                         ref={imageRefs[index]}
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
