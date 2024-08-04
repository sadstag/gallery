from typing import TypedDict

from cli.PictureSize import PictureSize


ArtworkId = str


class ArtworkImage(TypedDict):
    width: int
    height: int


class Meta(TypedDict):
    generated: str


ArtworkImages = dict[ArtworkId, dict[PictureSize, ArtworkImage]]


class ArtworkImagesFileContents(TypedDict):
    meta: Meta
    bucketName: str
    images: ArtworkImages
