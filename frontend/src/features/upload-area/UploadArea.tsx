import {AxiosProgressEvent} from 'axios';
import * as classNames from 'classnames';
import * as React from 'react';
import {useRef, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {EyeBlinkEvent} from '../../common/enums/EyeBlinkEvent';
import {SocketEvent} from '../../common/enums/SocketEvent';
import {useSocketEventHook} from '../../common/hooks/useSocketEventHook';
import {ReturnedEyeBlinkEventSchema} from '../../common/schemas/ReturnedEyeBlinkEventSchema';
import {useUploadImagesMutation} from '../api/apiSlice';
import styles from './UploadArea.less';

const UploadArea = () => {
    const [uploadImages, {isLoading}] = useUploadImagesMutation();
    const [uploadProgress, setUploadProgress] = useState(0);
    const selectPhotosButtonRef = useRef<HTMLDivElement>(null);
    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length >= 1) {
            let uploadLoaded = 0;
            let uploadSize = 0;
            for (let i = 0; i < acceptedFiles.length; i++) {
                uploadSize += acceptedFiles[i].size;
            }
            setUploadProgress(0);
            uploadImages({
                acceptedFiles,
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    setUploadProgress(Math.round(((uploadLoaded + progressEvent.loaded) / uploadSize) * 100));

                    if (progressEvent.loaded === progressEvent.total) {
                        uploadLoaded += progressEvent.loaded;
                    }
                }
            });
        }
    };

    const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
        // maxFiles: 1, Which value should we set here?
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png']
        },
        noClick: true,
        disabled: isLoading,
        onDrop
    });

    useSocketEventHook(
            SocketEvent.EYE_BLINK,
            (response: any) => {
                const eyeBlinkEvent = ReturnedEyeBlinkEventSchema.parse(response);
                if (eyeBlinkEvent.which === EyeBlinkEvent.BOTH) {
                    // selectPhotosButtonRef.current?.click();
                    // TODO: Warning from Chrome: File chooser dialog can only be shown with a user activation.
                }
            }
    );

    return (
            <div className={classNames(styles.component)}>
                <div className={styles.uploadArea} {...getRootProps()}>
                    <input {...getInputProps()} />
                    {
                        isLoading ?
                                <div className={styles.progressBar}>
                                    <div className={styles.progress} style={{width: `${uploadProgress}%`}}>
                                        {uploadProgress >= 99 ? 'Done' : null}
                                    </div>
                                </div> :
                                isDragActive ?
                                        <div>Drop your photo here</div> :
                                        <>
                                            <div className={styles.selectPhotosButton} onClick={open} ref={selectPhotosButtonRef}>
                                                Select photos
                                            </div>
                                            <em className={styles.hint}>(Only *.jpeg and *.png images will be accepted)</em>
                                        </>
                    }
                </div>
            </div>
    );
};

export default UploadArea;
