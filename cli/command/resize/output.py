from json import dump
from datetime import datetime, timezone
from os import makedirs
from os.path import dirname

from cli.command.resize.artworkImage import ArtworkImages, ArtworkImagesFileContents
from cli.const import get_artwork_images_db_filepath
from cli.exceptions import ProcessingException
from cli.log import log
from cli.tools import ctxOpen
from cli.website import WebsiteConfig


def writeArtworkImagesDB(site_config: WebsiteConfig, artworkImages: ArtworkImages):
    contents: ArtworkImagesFileContents = {
        "meta": {
            "generated": datetime.now(timezone.utc).isoformat(),
        },
        "bucketName": site_config.tech.bucket_name,
        "images": artworkImages,
    }

    path = get_artwork_images_db_filepath(site_config.id)
    makedirs(dirname(path), exist_ok=True)

    with ctxOpen(path, "w") as artworkImagesFile:
        try:
            dump(contents, artworkImagesFile, indent="\t")
            log(f"Wrote {path}")
        except Exception as e:
            raise ProcessingException(f"Could not write {path} : {e}")
