import base64

import cv2
import numpy as np

BLUR_FILTER = 'blur'
INVERT_FILTER = 'invert'
BLACK_AND_WHITE_FILTER = 'black-and-white'


def apply_blur(base64_str: str):
    image = base64_to_image(base64_str)
    blurred_image = cv2.blur(image, (10, 10))
    return image_to_base64(blurred_image)


def apply_invert(base64_str: str):
    image = base64_to_image(base64_str)
    inverted_image = cv2.bitwise_not(image)
    return image_to_base64(inverted_image)


def apply_black_and_white(base64_str: str):
    image = base64_to_image(base64_str)
    grayed_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, binary_image = cv2.threshold(grayed_image, 25, 255, cv2.THRESH_TOZERO)
    return image_to_base64(binary_image)


def base64_to_image(base64_str: str):
    image_data = base64.b64decode(base64_str)
    image_cv = np.frombuffer(image_data, dtype=np.uint8)
    return cv2.imdecode(image_cv, cv2.IMREAD_COLOR)


def image_to_base64(image: cv2.typing.MatLike):
    _, encoded_image = cv2.imencode('.jpg', image)
    return base64.b64encode(encoded_image).decode('utf-8')
