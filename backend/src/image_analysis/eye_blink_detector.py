from typing import NamedTuple, Union

import cv2
import numpy as np

LEFT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
RIGHT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]

BOTH_EYES_CLOSED = 'both-eyes-closed'
LEFT_EYE_CLOSED = 'left-eye-closed'
RIGHT_EYE_CLOSED = 'right-eye-closed'


def determine_mesh_coordinates(img, results):
    img_height, img_width = img.shape[:2]
    # returns list[(x,y), (x,y)...]
    return [(int(point.x * img_width), int(point.y * img_height))
            for point in results.multi_face_landmarks[0].landmark]


def calculate_euclidean_distance(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.linalg.norm(b - a)


def calculate_blink_ratio(mesh_coords, indices):
    right_horizontal_line = mesh_coords[indices[0]]
    left_horizontal_line = mesh_coords[indices[8]]
    top_vertical_line = mesh_coords[indices[12]]
    bottom_vertical_line = mesh_coords[indices[4]]
    horizontal_distance = calculate_euclidean_distance(right_horizontal_line, left_horizontal_line)
    vertical_distance = calculate_euclidean_distance(top_vertical_line, bottom_vertical_line)
    return horizontal_distance / vertical_distance


def detect_eye_blink(image: cv2.typing.MatLike, results: NamedTuple) -> Union[None, str]:
    # noinspection PyUnresolvedReferences
    if results.multi_face_landmarks is None:
        return

    # noinspection PyUnresolvedReferences
    face_landmarks = results.multi_face_landmarks[0]

    if face_landmarks is None:
        return

    # noinspection PyTypeChecker
    mesh_coordinates = determine_mesh_coordinates(image, results)

    left_eye_blink_ratio = calculate_blink_ratio(mesh_coordinates, LEFT_EYE)
    right_eye_blink_ratio = calculate_blink_ratio(mesh_coordinates, RIGHT_EYE)

    if left_eye_blink_ratio > 5 and right_eye_blink_ratio > 5:
        return BOTH_EYES_CLOSED
    elif left_eye_blink_ratio > 5:
        return LEFT_EYE_CLOSED
    elif right_eye_blink_ratio > 5:
        return RIGHT_EYE_CLOSED
