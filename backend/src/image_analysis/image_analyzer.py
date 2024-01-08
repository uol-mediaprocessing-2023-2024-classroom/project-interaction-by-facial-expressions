import time
from typing import Union

import cv2
import mediapipe as mp
from flask_socketio import SocketIO

from .eye_blink_detector import detect_eye_blink, BOTH_EYES_CLOSED, LEFT_EYE_CLOSED, RIGHT_EYE_CLOSED
from .head_pose_detector import detect_head_pose, HEAD_LOOKS_LEFT, HEAD_LOOKS_RIGHT, HEAD_LOOKS_UP, HEAD_LOOKS_DOWN, \
    HEAD_LOOKS_FORWARD
from .utils.Debouncer import Debouncer

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True,
                                  min_detection_confidence=0.5,
                                  min_tracking_confidence=0.5)

head_pose_debouncer = Debouncer(limit=15)
eye_blink_debouncer = Debouncer(limit=10)


def analyze_image(socketio: SocketIO, image: cv2.typing.MatLike) -> dict:
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    image_height, image_width, _ = image.shape

    results = face_mesh.process(image)

    head_pose_result = detect_head_pose(image, results)
    handle_head_pose(socketio, head_pose_result['direction'])
    handle_eye_blink(socketio, detect_eye_blink(image, results))

    return {
        'headPose': head_pose_result
    }


def handle_head_pose(socketio: SocketIO, result: Union[None, str]):
    if result is None:
        return

    message = None
    if result is HEAD_LOOKS_LEFT:
        message = 'Head looks left'
    elif result is HEAD_LOOKS_RIGHT:
        message = 'Head looks right'
    elif result is HEAD_LOOKS_UP:
        message = 'Head looks up'
    elif result is HEAD_LOOKS_DOWN:
        message = 'Head looks down'
    elif result is HEAD_LOOKS_FORWARD:
        message = 'Head looks forward'

    def head_pose_event():
        if message is not None:
            socketio.emit('action-log', {'timestamp': time.time(), 'message': message})
            socketio.emit('head-pose', {'direction': result})

    head_pose_debouncer(result, head_pose_event)


def handle_eye_blink(socketio: SocketIO, result: Union[None, str]):
    if result is None:
        return

    message = None
    if result is BOTH_EYES_CLOSED:
        message = 'Both eyes are closed'
    elif result is LEFT_EYE_CLOSED:
        message = 'Left eye is closed'
    elif result is RIGHT_EYE_CLOSED:
        message = 'Right eye is closed'

    def eye_blink_event():
        if message is not None:
            socketio.emit('action-log', {'timestamp': time.time(), 'message': message})
            socketio.emit('eye-blink', {'which': result})

    eye_blink_debouncer(result, eye_blink_event)
