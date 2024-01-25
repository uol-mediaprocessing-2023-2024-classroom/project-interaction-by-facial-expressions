import cv2
from deepface import DeepFace

EMOTION_ANGRY = 'angry'
EMOTION_DISGUST = 'disgust'
EMOTION_FEAR = 'fear'
EMOTION_HAPPY = 'happy'
EMOTION_SAD = 'sad'
EMOTION_SURPRISE = 'surprise'
EMOTION_NEUTRAL = 'neutral'


def detect_face_emotion(image: cv2.typing.MatLike, face_detector_backend: str) -> str:
    try:
        deepface_result = DeepFace.analyze(image, actions=['emotion'], enforce_detection=False,
                                           detector_backend=face_detector_backend, align=False, silent=True)
        # Possible emotions: angry, disgust, fear, happy, sad, surprise, neutral
        emotion = deepface_result[0]['dominant_emotion'][:]
        return emotion

    except Exception as e:
        print(f"Error analyzing facial attributes: {e}")
