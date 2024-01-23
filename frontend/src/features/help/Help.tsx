import * as React from 'react';
import {selectCurrentSection} from '../../app/appSlice';
import {useAppSelector} from '../../app/hooks';
import {Section} from '../../common/enums/Section';
import styles from '../help/Help.less';

const Help = () => {
    const currentSection = useAppSelector(state => selectCurrentSection(state));
    return (
            <div className={styles.component}>
                <h2>Help</h2>
                <div className={styles.content}>
                    {currentSection === Section.NAVIGATION &&
                            <>
                                <h3>Navigate through the page:</h3>
                                <ul>
                                    <li>Unlock area/Lock area: Tilt you head up (or close both eyes)</li>
                                    <li>Scroll to next area: tilt your head to the right</li>
                                    <li>Scroll to previous area: tilt your head to the left</li>
                                </ul>
                            </>
                    }
                    {currentSection === Section.CAROUSEL &&
                            <>
                                <h3>Navigate through the page:</h3>
                                <ul>
                                    <li>Unlock area/Lock area: Tilt you head up (or close both eyes)</li>
                                    <li>Scroll to next area: tilt your head to the right</li>
                                    <li>Scroll to previous area: tilt your head to the left</li>
                                </ul>
                                <h3>Navigate the carousel:</h3>
                                <ul>
                                    <li>Go to next photo: Close your right eye</li>
                                    <li>Go to previous photo: Close your left eye</li>
                                </ul>
                                <h3>Navigate the filters:</h3>
                                <ul>
                                    <li>
                                        Select filter or undo: tilt your head to the right/left to go to next/previous filter
                                    </li>
                                    <li>Apply filter or undo: tilt your head down</li>
                                </ul>
                            </>
                    }
                    {currentSection === Section.UPLOAD &&
                            <>
                                <h3>Navigate through the page:</h3>
                                <ul>
                                    <li>Unlock area/Lock area: Tilt you head up (or close both eyes)</li>
                                    <li>Scroll to next area: tilt your head to the right</li>
                                    <li>Scroll to previous area: tilt your head to the left</li>
                                </ul>
                                <p>This area can't be navigated by facial expression due to browser safety measures</p>
                            </>
                    }
                    {currentSection === Section.GALLERY &&
                            <>
                                <h3>Navigate through the page:</h3>
                                <ul>
                                    <li>Unlock area/Lock area: Tilt you head up (or close both eyes)</li>
                                    <li>Scroll to next area: tilt your head to the right</li>
                                    <li>Scroll to previous area: tilt your head to the left</li>
                                </ul>
                                <h3>Navigate the gallery:</h3>
                                <ul>
                                    <li>Go to next photo: Close your right eye</li>
                                    <li>Go to previous photo: Close your left eye</li>
                                    <li>View photo bigger: tilt your head down</li>
                                </ul>
                            </>
                    }
                </div>
            </div>
    );
};

export default Help;
