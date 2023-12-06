import {AxiosProgressEvent} from 'axios';
import * as classNames from 'classnames';
import * as React from 'react';
import {useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {useUploadImagesMutation} from '../api/apiSlice';
import styles from './UploadArea.less';

const UploadArea = () => {
    const [uploadImages, {isLoading}] = useUploadImagesMutation();
    const [uploadProgress, setUploadProgress] = useState(0);
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
                                            <div className={styles.selectPhotosButton} onClick={open}>
                                                Select photos
                                            </div>
                                            <p>Drag and drop photos here or click on the button to select photos</p>
                                            <em>(Only *.jpeg and *.png images will be accepted)</em>
                                        </>
                    }
                </div>
            </div>
    );
};

export default UploadArea;
