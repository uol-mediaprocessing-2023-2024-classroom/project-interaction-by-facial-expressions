import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import styles from './ManualModeSwitch.less';
import {selectIsChecked, setIsChecked} from './manualModeSwitchSlice';

const ManualModeSwitch = () => {
    const dispatch = useAppDispatch();
    const isChecked = useAppSelector(state => selectIsChecked(state));
    return (
            <div className={styles.component}>
                <label className={styles.label}>Manual mode: </label>
                <label className={styles.switch}>
                    <input type="checkbox"
                           className={styles.checkbox}
                           onChange={event => dispatch(setIsChecked(event.target.checked))}
                           checked={isChecked}
                    />
                    <span className={styles.slider}></span>
                </label>
            </div>
    );
};

export default ManualModeSwitch;
