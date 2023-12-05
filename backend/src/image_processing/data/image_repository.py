import json
import os
import uuid

DATA_PATH = '/src/image_processing/data/images.json'


def find_all() -> list[dict]:
    return json.load(open(os.getcwd() + DATA_PATH))


def find(image_id: str) -> dict:
    results = [image for image in find_all() if image["id"] == image_id]
    return results[0] if len(results) > 0 else None


def get_image_path(image: dict):
    return f'{os.getcwd()}/images/{image["id"]}{image["file_extension"]}'


def get_processed_image_path(image: dict):
    return f'{os.getcwd()}/images-processed/{image["processed_image_id"]}{image["file_extension"]}'


def update_data(images: list[dict]):
    with open(os.getcwd() + DATA_PATH, 'w') as f:
        json.dump(images, f, indent=4)


def update(image: dict):
    images = find_all()
    for index, obj in enumerate(images):
        if obj["id"] == image["id"]:
            images[index] = image
            update_data(images)
            break


def create(file_extension: str, mime_type: str) -> str:
    images = find_all()
    image_id = str(uuid.uuid4())
    images.append({
        "id": image_id,
        "file_extension": file_extension,
        "mime_type": mime_type,
        "processed_image_id": None,
        "applied_filter": None
    })
    update_data(images)
    return image_id
