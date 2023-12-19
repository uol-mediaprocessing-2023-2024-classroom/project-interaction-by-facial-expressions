import base64

import cv2
import numpy as np
from flask import Flask
from flask_socketio import SocketIO

from image_analysis import image_analyzer

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='http://localhost:3000')


@socketio.on('webcam-stream')
def handle_camera(message):
    mime_type, base64_data = message.split(",", 1)
    image_bytes = base64.b64decode(base64_data)
    opencv_image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    response = image_analyzer.analyze_image(socketio, opencv_image)
    socketio.emit('canvas-update', response)


@socketio.on('action-log-intern')
def handle_action_log(action_log):
    socketio.emit('action-log', action_log)


if __name__ == '__main__':
    socketio.run(app, log_output=True, use_reloader=False)
