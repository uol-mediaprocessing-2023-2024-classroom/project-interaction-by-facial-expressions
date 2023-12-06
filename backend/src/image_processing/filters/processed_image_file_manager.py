import os
import uuid

import cv2

from ..data import image_repository

RESET_FILTER = 'reset'


def create_processed_image(image: dict, applied_filter: str, processed_image_data: cv2.typing.MatLike):
    if image["processed_image_id"] is None:
        image["processed_image_id"] = str(uuid.uuid4())
    image["applied_filter"] = applied_filter

    processed_image_path = image_repository.get_processed_image_path(image)
    cv2.imwrite(processed_image_path, processed_image_data)
    image_repository.update(image)


def delete_processed_image(image: dict):
    processed_image_path = image_repository.get_processed_image_path(image)

    image["processed_image_id"] = None
    image["applied_filter"] = None

    os.remove(processed_image_path)
    image_repository.update(image)
