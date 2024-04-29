from os.path import exists
from typing import Self

from PIL import Image

from cli.PictureSize import PictureSize
from cli.const import (
    get_artwork_pictures_source_filepaths,
    get_artwork_picture_blobname,
    resized_picture_width,
)


class PictureResizer:
    def __init__(self: Self, site_id: str, artwork_id: str):
        self.site_id = site_id
        self.artwork_id = artwork_id

    def source_file_exists(self: Self) -> bool:
        return any(
            [
                exists(f)
                for f in get_artwork_pictures_source_filepaths(
                    self.site_id, self.artwork_id
                )
            ]
        )

    def get_source_filepath(self: Self) -> str | None:
        for f in get_artwork_pictures_source_filepaths(self.site_id, self.artwork_id):
            if exists(f):
                return f
        return None

    def get_resized_picture_blobname(self: Self, size: PictureSize):
        return get_artwork_picture_blobname(self.artwork_id, size)

    def get_all_resized_pictures_blobnames(self: Self):
        return [(size, self.get_resized_picture_blobname(size)) for size in PictureSize]

    def resize(self: Self, size: PictureSize):
        with Image.open(self.get_source_filepath()) as im:  # type: ignore
            srcW, srcH = im.size
            dstW = resized_picture_width[size]
            dstH = int(srcH * dstW / srcW)
            resizedIm = im.resize((dstW, dstH), resample=Image.Resampling.LANCZOS)  # type: ignore
            tmpFile = f"/tmp/{self.artwork_id}-{size}.webp"
            resizedIm.save(tmpFile, lossless=False, quality=70, method=6)  # type: ignore
            return tmpFile
