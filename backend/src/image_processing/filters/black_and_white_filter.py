import cv2

from .processed_image_file_manager import create_processed_image
from ..data import image_repository

BLACK_AND_WHITE_FILTER = 'black-and-white'


def apply_black_and_white_filter(image: dict):
    image_path = image_repository.get_image_path(image)
    image_data = cv2.imread(image_path)

    processed_image_data = cv2.cvtColor(image_data, cv2.COLOR_BGR2GRAY)
    _, processed_image_data = cv2.threshold(processed_image_data, 25, 255, cv2.THRESH_TOZERO)

    create_processed_image(image, BLACK_AND_WHITE_FILTER, processed_image_data)
