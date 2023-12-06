import cv2

from .processed_image_file_manager import create_processed_image
from ..data import image_repository

INVERT_FILTER = 'invert'


def apply_invert_filter(image: dict):
    image_path = image_repository.get_image_path(image)
    image_data = cv2.imread(image_path)

    processed_image_data = cv2.bitwise_not(image_data)

    create_processed_image(image, INVERT_FILTER, processed_image_data)
