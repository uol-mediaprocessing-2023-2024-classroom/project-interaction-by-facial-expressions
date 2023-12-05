import {AxiosProgressEvent} from 'axios';
import * as classNames from 'classnames';
import * as React from 'react';
import {useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {useUploadImageMutation} from '../api/apiSlice';
import styles from './UploadArea.less';

const UploadArea = () => {
    const [uploadImage, {isLoading}] = useUploadImageMutation();
    const [uploadProgress, setUploadProgress] = useState(0);
    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length == 1) {
            setUploadProgress(0);
            const formData = new FormData();
            formData.append('file', acceptedFiles[0]);
            uploadImage({
                formData,
                onUploadProgress: (progressEvent: AxiosProgressEvent) =>
                        setUploadProgress(Math.round((progressEvent.loaded / acceptedFiles[0].size) * 100))
            });
        }
    };
    const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
        maxFiles: 1,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg', '.jpg']
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
                                            <div className={styles.selectPhotoButton} onClick={open}>Select photo</div>
                                            <p>Drag and drop a photo here or click on the button to select a photo</p>
                                            <em>(Only *.jpeg and *.png images will be accepted)</em>
                                        </>
                    }
                </div>
            </div>
    );
};

export default UploadArea;
