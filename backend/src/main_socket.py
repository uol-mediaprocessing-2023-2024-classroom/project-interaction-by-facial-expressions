import base64
import os

import cv2
import numpy as np
from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='http://localhost:3000')


@socketio.on('webcam-stream')
def handle_camera(message):
    mime_type, base64_data = message.split(",", 1)
    image_bytes = base64.b64decode(base64_data)
    opencv_image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)

    face_cascade = cv2.CascadeClassifier(os.getcwd() + '/src/image_analysis/models/haarcascade_frontalface_default.xml')

    gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(30, 30))

    response = []
    for (x, y, w, h) in [(int(x), int(y), int(w), int(h)) for (x, y, w, h) in faces]:
        response.append({"rectangle": {"x": x, "y": y, "w": w, "h": h}})

    socketio.emit('canvas-update', response)


@socketio.on('action-log-intern')
def handle_action_log(action_log):
    socketio.emit('action-log', action_log)


if __name__ == '__main__':
    socketio.run(app)
