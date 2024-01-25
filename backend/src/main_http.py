import os
import time
from io import BytesIO

import cv2
import numpy as np
import socketio
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

from image_processing.data import image_repository
from image_processing.filters.black_and_white_filter import BLACK_AND_WHITE_FILTER, apply_black_and_white_filter
from image_processing.filters.blur_filter import BLUR_FILTER, apply_blur_filter
from image_processing.filters.invert_filter import INVERT_FILTER, apply_invert_filter
from image_processing.filters.processed_image_file_manager import delete_processed_image, RESET_FILTER
from image_processing.utils import image_scaler

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

UPLOAD_FOLDER = os.getcwd() + '/images/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

sio = socketio.SimpleClient()
while True:
    try:
        sio.connect('http://localhost:9001')
        if sio.connected:
            print("Connected with socket server.")
            break
    except Exception as e:
        print(f"Failed to connect with socket server, error: {str(e)}. Retrying in 1 second...")
        time.sleep(1)


@app.route('/images')
def get_images():
    try:
        return jsonify(image_repository.find_all()), 200
    except Exception as exception:
        error_message = f'Error loading images: {str(exception)}'
        return jsonify({'error': error_message}), 400


@app.route('/images/<image_id>')
def get_image(image_id):
    try:
        if image_id is None:
            raise Exception('The id is missing.')

        image = image_repository.find(image_id)
        if image is None:
            raise Exception(f'Image with id: {image_id} not found.')

        return_processed_image = True if 'processed_image' in request.args else False
        if return_processed_image and image["processed_image_id"] is None:
            raise Exception(f'Image with id: {image_id} has no processed image that can be returned.')

        if return_processed_image:
            image_path = image_repository.get_processed_image_path(image)
        else:
            image_path = image_repository.get_image_path(image)

        preferred_image_size = request.args.get('size')
        if preferred_image_size is not None and preferred_image_size.isdigit() is False:
            raise Exception('The size must be of type int')

        if preferred_image_size is not None:
            original_image = cv2.imread(image_path)
            resized_image = image_scaler.resize(original_image, int(preferred_image_size))
            _, buffer = cv2.imencode(image["file_extension"], resized_image)
            return send_file(BytesIO(buffer.tobytes()), mimetype=image["mime_type"])

        return send_file(image_path, mimetype=image["mime_type"])
    except Exception as exception:
        error_message = f'Error loading an image: {str(exception)}'
        return jsonify({'error': error_message}), 400


@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        data = request.get_json()
        image_id = data.get('id')

        if image_id is None:
            raise Exception('The id is missing.')

        image = image_repository.find(image_id)
        if image is None:
            raise Exception(f'Image with id: {image_id} not found.')

        action = data.get('action')
        if action is None or action not in [BLUR_FILTER, INVERT_FILTER, BLACK_AND_WHITE_FILTER, RESET_FILTER]:
            raise Exception('The action is invalid or missing.')

        if action == BLUR_FILTER:
            apply_blur_filter(image)
            sio.emit('action-log-intern', {
                'timestamp': time.time(),
                'message': 'Apply blur filter'
            })
        elif action == INVERT_FILTER:
            apply_invert_filter(image)
            sio.emit('action-log-intern', {
                'timestamp': time.time(),
                'message': 'Apply invert filter'
            })
        elif action == BLACK_AND_WHITE_FILTER:
            apply_black_and_white_filter(image)
            sio.emit('action-log-intern', {
                'timestamp': time.time(),
                'message': 'Apply black and white filter'
            })
        elif action == RESET_FILTER:
            delete_processed_image(image)
            sio.emit('action-log-intern', {
                'timestamp': time.time(),
                'message': 'Reset filter'
            })

        success_message = 'Image processing was successful'
        return jsonify({'success': success_message}), 200
    except Exception as exception:
        error_message = f'Errors during image processing: {str(exception)}'
        return jsonify({'error': error_message}), 400


@app.route('/upload-image', methods=['POST'])
def upload_image():
    maximum_image_width = 960
    mime_type_to_file_extension = {
        'image/jpeg': '.jpeg',
        'image/png': '.png'
    }

    def is_file_allowed(mimetype: str):
        return mimetype in mime_type_to_file_extension

    if len(request.files) == 0:
        error_message = 'No file included in the request'
        return jsonify({'error': error_message}), 400

    file = request.files['file']
    if file and is_file_allowed(file.mimetype):
        file_extension = mime_type_to_file_extension[file.mimetype]
        image_id = image_repository.create(file_extension, file.mimetype)
        filename = image_id + file_extension

        content = file.read()
        nparr = np.frombuffer(content, np.uint8)
        original_image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        height, width, _ = original_image.shape

        file_path = app.config['UPLOAD_FOLDER'] + filename
        if width > maximum_image_width:
            resized_image = image_scaler.resize(original_image, maximum_image_width)
            cv2.imwrite(file_path, resized_image)
        else:
            cv2.imwrite(file_path, original_image)

        success_message = 'File uploaded successfully'
        return jsonify({'success': success_message}), 200

    error_message = 'File type is not allowed, therefore the upload process is canceled'
    return jsonify({'error': error_message}), 400
