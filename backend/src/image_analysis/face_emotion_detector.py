from deepface import DeepFace

backends = ['opencv', 'ssd', 'dlib', 'mtcnn', 'retinaface', 'mediapipe', 'yolov8', 'yunet', 'fastmtcnn']

#Possible emotions:  angry, disgust, fear, happy, sad, surprise, neutral

def detect_face_emotion(img):
    try:
        deepface_result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False,
                                           detector_backend=backends[5])  # 5 is MediaPipe
        emotion = deepface_result[0]['dominant_emotion'][:]
        return emotion

    except Exception as e:
        print(f"Error analyzing face: {e}")