import cv2


def calculate_aspect_ratio(width: int, height: int):
    return float(width / height)


def calculate_height(width: int, ratio: float):
    return int(width / ratio)


def resize(image: cv2.typing.MatLike, size: int):
    original_width = image.shape[1]
    original_height = image.shape[0]
    aspect_ratio = calculate_aspect_ratio(original_width, original_height)
    new_width = size
    new_height = calculate_height(new_width, aspect_ratio)
    return cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
