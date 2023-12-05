import cv2

from .processed_image_file_manager import create_processed_image
from ..data import image_repository

BLUR_FILTER = 'blur'


def apply_blur_filter(image: dict):
    image_path = image_repository.get_image_path(image)
    image_data = cv2.imread(image_path)

    processed_image_data = cv2.blur(image_data, (10, 10))

    create_processed_image(image, BLUR_FILTER, processed_image_data)
