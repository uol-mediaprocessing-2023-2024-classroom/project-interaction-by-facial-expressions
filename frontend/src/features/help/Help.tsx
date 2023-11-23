import * as React from 'react';

const Help = () => (
        <div>
            <h2>Help</h2>
            <p>Action inputs by mimic and hand gestures:</p>
            <h3>Navigation:</h3>
            <ul>
                <li>Go to next photo: Close your right eye</li>
                <li>Go to previous photo: Close your left eye</li>
            </ul>
            <h3>Actions:</h3>
            <ul>
                <li>Take a photo: Connect thumb and index finger</li>
                <li>Undo changes made to an image: Close both eyes</li>
            </ul>
            <h3>Filters:</h3>
            <ul>
                <li>Apply blur: Hold hand infront of eyes</li>
                <li>Apply invert: Thumbs down</li>
                <li>Apply black and white: Peace sign</li>
            </ul>
        </div>
);

export default Help;
