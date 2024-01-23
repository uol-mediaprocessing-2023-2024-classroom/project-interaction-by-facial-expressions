import * as classNames from 'classnames';
import * as React from 'react';
import {createRef, useEffect, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {EyeBlinkEvent} from '../../common/enums/EyeBlinkEvent';
import {Section} from '../../common/enums/Section';
import {SocketEvent} from '../../common/enums/SocketEvent';
import {useSocketEventOnFocusedSectionHook} from '../../common/hooks/useSocketEventOnFocusedSectionHook';
import {ReturnedEyeBlinkEventSchema} from '../../common/schemas/ReturnedEyeBlinkEventSchema';
import {selectImages} from '../api/apiSlice';
import {setCurrentIndex} from '../carousel/carouselSlice';
import OverlayImage from '../overlay-image/OverlayImage';
import {selectIsShown, setIsShown} from '../overlay-image/overlayImageSlice';
import styles from './Gallery.less';

const Gallery = () => {
    const dispatch = useAppDispatch();
    const images = useAppSelector(state => selectImages(state));
    const currentIndex = useAppSelector(state => state.carousel.currentIndex);
    const imageRefs: React.RefObject<HTMLDivElement>[] = useMemo(() => images.map(() => React.createRef()), [images]);
    const galleryRef = createRef<HTMLDivElement>();
    const isOverlayImageShown = useAppSelector(state => selectIsShown(state));

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

    useSocketEventOnFocusedSectionHook(
            SocketEvent.EYE_BLINK,
            (response: any) => {
                const eyeBlinkEvent = ReturnedEyeBlinkEventSchema.parse(response);
                if (eyeBlinkEvent.which === EyeBlinkEvent.BOTH) {
                    dispatch(setIsShown(!isOverlayImageShown));
                }
            },
            [isOverlayImageShown],
            [Section.GALLERY]
    );

    return (
            <div className={styles.component} ref={galleryRef}>
                <OverlayImage/>
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
            </div>
    );
};

export default Gallery;
