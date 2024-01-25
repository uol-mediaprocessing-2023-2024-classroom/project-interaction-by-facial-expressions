import * as classNames from 'classnames';
import * as React from 'react';
import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {FaceDetectorBackend} from '../../common/enums/FaceDetectorBackend';
import styles from './SettingsMenu.less';
import {
    selectFaceDetectorBackend,
    selectIsEmojiShown,
    selectIsGridShown,
    setFaceDetectorBackend,
    setIsEmojiShown,
    setIsGridShown
} from './settingsMenuSlice';

const SettingsMenu = () => {
    const [isShown, setIsShown] = useState(false);
    const dispatch = useAppDispatch();
    const isGridShown = useAppSelector(state => selectIsGridShown(state));
    const isEmojiShown = useAppSelector(state => selectIsEmojiShown(state));
    const faceDetectorBackend = useAppSelector(state => selectFaceDetectorBackend(state));
    return (
            <div className={classNames(styles.component, {[styles.show]: isShown})}>
                <div className={styles.grid}>
                    <div className={styles.row}>
                        <label>Show Grid:</label>
                        <input type="checkbox" checked={isGridShown}
                               onClick={() => dispatch(setIsGridShown(!isGridShown))}/>
                    </div>
                    <div className={styles.row}>
                        <label>Show Emoji:</label>
                        <input type="checkbox" checked={isEmojiShown}
                               onClick={() => dispatch(setIsEmojiShown(!isEmojiShown))}/>
                    </div>
                    <div className={styles.row}>
                        <label>Face detector backend:</label>
                        <select onChange={event => {
                            dispatch(setFaceDetectorBackend(event.target.value));
                        }} value={faceDetectorBackend}>
                            {Object.values(FaceDetectorBackend).map(value =>
                                    <option value={value}>{value}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className={styles.button} onClick={() => setIsShown(!isShown)}></div>
            </div>
    );
};

export default SettingsMenu;
