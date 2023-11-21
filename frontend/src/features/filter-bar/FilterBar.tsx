import * as classNames from 'classnames';
import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store';
import {CarouselState, changeCurrentImage} from '../carousel/carouselSlice';
import styles from './FilterBar.less';

const BLUR_FILTER = 'blur';
const INVERT_FILTER = 'invert';
const BLACK_AND_WHITE_FILTER = 'black-and-white';

const FilterBar = () => {
    const {currentImage} = useSelector<RootState, CarouselState>(state => state.carousel);
    const dispatch = useDispatch<AppDispatch>();

    const apply = (action: string) => {
        fetch('http://127.0.0.1:5000/filter', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({action, image: currentImage.originalData})
        })
                .then(response => response.json())
                .then(data => dispatch(changeCurrentImage({data: data.image, filter: action})));
    };

    return (
            <div className={styles.component}>
                <div className={classNames(styles.button, currentImage.filter == BLUR_FILTER ? styles.disabled : null)}
                     onClick={() => apply(BLUR_FILTER)}>Blur
                </div>
                <div className={classNames(styles.button, currentImage.filter == INVERT_FILTER ? styles.disabled : null)}
                     onClick={() => apply(INVERT_FILTER)}>Invert
                </div>
                <div className={classNames(styles.button, currentImage.filter == BLACK_AND_WHITE_FILTER ? styles.disabled : null)}
                     onClick={() => apply(BLACK_AND_WHITE_FILTER)}>Black and white
                </div>
            </div>
    );
};

export default FilterBar;
