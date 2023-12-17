import cv2
import dlib
from imutils import face_utils
from scipy.spatial import distance as dist

class EyeDetector:
    def __init__(self):
        self.detector = dlib.get_frontal_face_detector()
        self.landmark_predict = dlib.shape_predictor('shape_predictor_68_face_landmarks.dat')
        (self.lStart, self.lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
        (self.rStart, self.rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]

    def eye_aspect_ratio(self, eye):
        A = dist.euclidean(eye[1], eye[5])
        B = dist.euclidean(eye[2], eye[4])
        C = dist.euclidean(eye[0], eye[3])
        ear = (A + B) / (2.0 * C)
        return ear

    def getEyeShape(self, faces, img_gray):
        self.shapes = []

        for (i, face) in enumerate(faces):
            shape = self.landmark_predict(img_gray, face)
            shape = face_utils.shape_to_np(shape)

            self.shapes.append(shape)

        return self.shapes

    def getEyeEAR(self, faces, img_gray):
        ear_values = []

        for (i, face) in enumerate(faces):
            shape = self.landmark_predict(img_gray, face)
            shape = face_utils.shape_to_np(shape)

            leftEye = shape[self.lStart:self.lEnd]
            leftEAR = self.eye_aspect_ratio(leftEye)

            rightEye = shape[self.rStart:self.rEnd]
            rightEAR = self.eye_aspect_ratio(rightEye)

            ear_values.append({
                'leftEAR': leftEAR,
                'rightEAR': rightEAR
            })
        return ear_values

    def isLeftEyeClosed(self, faces, img_gray):
        ear_values = self.getEyeEAR(faces, img_gray)

        leftEAR = ear_values[0]['leftEAR']
        rightEAR = ear_values[0]['rightEAR']

        return (rightEAR < 0.23) and (leftEAR > rightEAR)

    def isRightEyeClosed(self, faces, img_gray):
        ear_values = self.getEyeEAR(faces, img_gray)

        leftEAR = ear_values[0]['leftEAR']
        rightEAR = ear_values[0]['rightEAR']

        return (leftEAR < 0.27) & (rightEAR > leftEAR)
