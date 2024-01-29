export enum FaceDetectorBackend {
    OPENCV = 'opencv',
    MTCNN = 'mtcnn',
    MEDIAPIPE = 'mediapipe',
    SSD = 'ssd',
    DLIB = 'dlib', //pip install dlib
    //RETINAFACE = 'retinaface', //crashes the application
    YOLOV8 = 'yolov8', //pip install ultralytics
    YUNET = 'yunet',
    FASTMTCNN = 'fastmtcnn' //pip install facenet-pytorch
}
