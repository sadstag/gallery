from argparse import Namespace

from cli.PictureSize import PictureSize
from cli.artworks import PictureResizer, readArtworks
from cli.command.resize.artworkImage import ArtworkImages
from cli.command.resize.output import writeArtworkImagesDB
from cli.command.site_id import get_target_site_id
from cli.const import (
    get_artwork_images_output_filepath,
    get_site_input_images_folderpath,
)
from cli.log import log, warn
from cli.website import get_website_config


def run(args: Namespace):
    site_id = get_target_site_id()
    site_config = get_website_config(site_id)

    artworks = readArtworks(site_id)

    missing_sources: list[str] = []

    artworkImages: ArtworkImages = {}

    for artwork in artworks:
        aid = artwork["id"]
        resizer = PictureResizer(site_id, aid)
        if not resizer.source_file_exists():
            missing_sources.append(aid)
            continue

        for size in PictureSize:
            resizedPath = get_artwork_images_output_filepath(site_id, aid, size)
            resizedW, resizedH = resizer.resize(size, resizedPath, args.force)
            if aid not in artworkImages:
                artworkImages[aid] = {}
            artworkImages[aid][size] = {"width": resizedW, "height": resizedH}

    log("Done resizing, now saving artwork images DB")

    writeArtworkImagesDB(site_config, artworkImages)

    log("Done")

    if missing_sources:
        warn(
            f"No source picture in {get_site_input_images_folderpath(site_id)} "
            "for the following artworks, "
            f"image processing was skipped : {missing_sources}"
        )
