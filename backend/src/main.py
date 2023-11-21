from flask import Flask, request, jsonify
from flask_cors import CORS

from filter import apply_blur, apply_invert, apply_black_and_white, BLUR_FILTER, INVERT_FILTER, BLACK_AND_WHITE_FILTER

app = Flask(__name__)
CORS(app, origins=["http://localhost:9000"])


@app.route("/filter", methods=["POST"])
def main():
    try:
        data = request.get_json()

        action = data.get('action')
        if action is None or action not in [BLUR_FILTER, INVERT_FILTER, BLACK_AND_WHITE_FILTER]:
            raise Exception("The action is invalid or missing.")

        original = data.get('image')
        if original is None:
            raise Exception("The image is missing.")

        new = None
        if action == BLUR_FILTER:
            new = apply_blur(original)
        elif action == INVERT_FILTER:
            new = apply_invert(original)
        elif action == BLACK_AND_WHITE_FILTER:
            new = apply_black_and_white(original)

        response_data = {'image': new}
        return jsonify(response_data)
    except Exception as exception:
        error_message = f'Errors during image processing: {str(exception)}'
        return jsonify({'error': error_message}), 400
