import * as React from 'react';

const Help = () => (
        <div>
            <h2>Help</h2>
            <h3>Navigate through the page:</h3>
            <ul>
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
                <li>Select filter or undo: tilt your head down to go to next filter,<br/>
                    tilt your head up to go the previous filter
                </li>
                <li>Apply filter or undo: close both of your eyes once</li>
            </ul>
        </div>
);

export default Help;
