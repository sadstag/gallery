from os.path import exists
from typing import Self

from PIL import Image

from cli.PictureSize import PictureSize
from cli.const import (
    get_artwork_images_source_filepaths,
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
                for f in get_artwork_images_source_filepaths(
                    self.site_id, self.artwork_id
                )
            ]
        )

    def get_source_filepath(self: Self) -> str | None:
        for f in get_artwork_images_source_filepaths(self.site_id, self.artwork_id):
            if exists(f):
                return f
        return None

    def resize(self: Self, size: PictureSize, outFilepath: str):
        with Image.open(self.get_source_filepath()) as im:  # type: ignore
            srcW, srcH = im.size
            dstW = resized_picture_width[size]
            dstH = int(srcH * dstW / srcW)
            resizedIm = im.resize((dstW, dstH), resample=Image.Resampling.LANCZOS)  # type: ignore
            resizedIm.save(outFilepath, lossless=False, quality=70, method=6)  # type: ignore
