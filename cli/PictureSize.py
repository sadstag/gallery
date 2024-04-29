from enum import UNIQUE, StrEnum, auto, verify


@verify(UNIQUE)
class PictureSize(StrEnum):
    SMALL = auto()
    MEDIUM = auto()
    LARGE = auto()
