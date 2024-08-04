from os import makedirs
from typing import Self

from PIL import Image

from cli.PictureSize import PictureSize
from cli.const import (
    get_artwork_images_source_filepaths,
    resized_picture_min_dimension,
)
from os.path import dirname, exists

from cli.log import log


class PictureResizer:
    def __init__(self, site_id: str, artwork_id: str):
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

    def resize(self: Self, size: PictureSize, outFilepath: str, force_recreate: bool):
        if exists(outFilepath) and not force_recreate:
            with Image.open(outFilepath) as im:  # type: ignore
                resizedW, resizedH = im.width, im.height
        else:
            makedirs(dirname(outFilepath), exist_ok=True)
            with Image.open(self.get_source_filepath()) as im:  # type: ignore
                srcW, srcH = im.size
                if srcW < srcH:
                    resizedW = resized_picture_min_dimension[size]
                    resizedH = int(srcH * resizedW / srcW)
                else:
                    resizedH = resized_picture_min_dimension[size]
                    resizedW = int(srcW * resizedH / srcH)
                resizedIm = im.resize(  # type: ignore
                    (resizedW, resizedH), resample=Image.Resampling.LANCZOS
                )
                resizedIm.save(outFilepath, lossless=False, quality=70, method=6)  # type: ignore
                log(f"created {outFilepath}")

        return resizedW, resizedH
