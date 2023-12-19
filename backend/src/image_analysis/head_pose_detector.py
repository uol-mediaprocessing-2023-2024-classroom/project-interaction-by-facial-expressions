from typing import NamedTuple, Union

import cv2

OUTER_CORNER_OF_THE_LEFT_EYE = 33
OUTER_CORNER_OF_THE_RIGHT_EYE = 263
TIP_OF_THE_NOSE = 1

HEAD_LOOKS_LEFT = 'head-looks-left'
HEAD_LOOKS_RIGHT = 'head-looks-right'
HEAD_LOOKS_UP = 'head-looks-up'
HEAD_LOOKS_DOWN = 'head-looks-down'
HEAD_LOOKS_FORWARD = 'head-looks-forward'


def determine_coordinates(landmark, img_width: int, img_height: int) -> tuple[int, int]:
    return int(landmark.x * img_width), int(landmark.y * img_height)


def determine_direction(eyes_pos: float, nose_pos: float, eyes_threshold=0.05, nose_threshold=0.075) -> str:
    if eyes_pos < -eyes_threshold:
        return HEAD_LOOKS_LEFT
    elif eyes_pos > eyes_threshold:
        return HEAD_LOOKS_RIGHT
    elif nose_pos > nose_threshold:
        return HEAD_LOOKS_UP
    elif nose_pos < -nose_threshold:
        return HEAD_LOOKS_DOWN
    else:
        return HEAD_LOOKS_FORWARD


def calculate_center_of_bounding_box(bounding_box: tuple[int, int, int, int]) -> tuple[int, int]:
    return (bounding_box[0] + (bounding_box[2] - bounding_box[0]) // 2,
            bounding_box[1] + (bounding_box[3] - bounding_box[1]) // 2)


def calculate_bounding_box_size(bounding_box: tuple[int, int, int, int]):
    return bounding_box[2] - bounding_box[0], bounding_box[3] - bounding_box[1]


def calculate_position_relative_to_bounding_box(
        bounding_box: tuple[int, int, int, int],
        obj: tuple[int, int]
) -> tuple[float, float]:
    center_of_bounding_box = calculate_center_of_bounding_box(bounding_box)
    bounding_box_width, bounding_box_height = calculate_bounding_box_size(bounding_box)

    relative_x = (obj[0] - center_of_bounding_box[0]) / bounding_box_width
    relative_y = (center_of_bounding_box[1] - obj[1]) / bounding_box_height
    return relative_x, relative_y


def detect_head_pose(image: cv2.typing.MatLike, results: NamedTuple) -> Union[None, dict]:
    # noinspection PyUnresolvedReferences
    if results.multi_face_landmarks is None:
        return

    # noinspection PyUnresolvedReferences
    face_landmarks = results.multi_face_landmarks[0]

    if face_landmarks is None:
        return

    image_height, image_width, _ = image.shape

    # noinspection DuplicatedCode
    x_coordinates = [int(landmark.x * image_width) for landmark in face_landmarks.landmark]
    y_coordinates = [int(landmark.y * image_height) for landmark in face_landmarks.landmark]
    bbox = (min(x_coordinates), min(y_coordinates), max(x_coordinates), max(y_coordinates))

    left_eye_landmark = face_landmarks.landmark[OUTER_CORNER_OF_THE_LEFT_EYE]
    left_eye_coordinates = determine_coordinates(left_eye_landmark, image_width, image_height)

    right_eye_landmark = face_landmarks.landmark[OUTER_CORNER_OF_THE_RIGHT_EYE]
    right_eye_coordinates = determine_coordinates(right_eye_landmark, image_width, image_height)

    nose_landmark = face_landmarks.landmark[TIP_OF_THE_NOSE]
    nose_coordinates = determine_coordinates(nose_landmark, image_width, image_height)

    eyes = ((left_eye_coordinates[0] + right_eye_coordinates[0]) // 2,
            (left_eye_coordinates[1] + right_eye_coordinates[1]) // 2)
    eyes_x, _ = calculate_position_relative_to_bounding_box(bbox, eyes)
    _, nose_y = calculate_position_relative_to_bounding_box(bbox, nose_coordinates)

    center_of_bbox = calculate_center_of_bounding_box(bbox)
    bbox_width, bbox_height = calculate_bounding_box_size(bbox)

    return {
        'direction': determine_direction(eyes_x, nose_y),
        'boundingBox': {
            'width': bbox_width,
            'height': bbox_height,
            'minX': bbox[0],
            'minY': bbox[1],
            'centerX': center_of_bbox[0],
            'centerY': center_of_bbox[1]
        },
        'leftEye': {
            'x': left_eye_coordinates[0],
            'y': left_eye_coordinates[1]
        },
        'rightEye': {
            'x': right_eye_coordinates[0],
            'y': right_eye_coordinates[1]
        },
        'nose': {
            'x': nose_coordinates[0],
            'y': nose_coordinates[1]
        }
    }
