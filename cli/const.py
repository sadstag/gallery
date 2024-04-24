from os.path import abspath, dirname

from cli.PictureSize import PictureSize

sites_folder = "sites"
assets_folder_name = "assets"

sites_folder_path = abspath(f"{dirname(__file__)}/../{sites_folder}")

siteconfig_filename = "config.json"
artworks_db_filename = "artworks.json"

bucket_id_prefix = "gallery-assets"

resized_picture_width = {
    PictureSize.SMALL: 200,
    PictureSize.MEDIUM: 400,
    PictureSize.LARGE: 1600,
}

#
# local
#


def get_site_filepath(site_id: str):
    return f"{sites_folder_path}/{site_id}"


def get_artworks_db_filepath(site_id: str):
    return f"{get_site_filepath(site_id)}/{artworks_db_filename}"


def get_website_config_filepath(site_id: str):
    return f"{get_site_filepath(site_id)}/{siteconfig_filename}"


def get_assets_filepath(site_id: str):
    return f"{get_site_filepath(site_id)}/{assets_folder_name}"


accepted_source_asset_extension = ["jpg", "webp"]


# path to the artwork picture source file in the local assets/ folder
# return accepted paths, depending on the format
def get_artwork_pictures_source_filepaths(site_id: str, artwork_id: str):
    return [
        f"{get_assets_filepath(site_id)}/{artwork_id}.{ext}"
        for ext in accepted_source_asset_extension
    ]


#
# GCP storage
#


def get_assets_bucketname(site_id: str):
    return f"{bucket_id_prefix}-{site_id}"


def get_assets_source_backup_bucketname(site_id: str):
    return f"{bucket_id_prefix}-{site_id}-source-backup"


def get_artwork_picture_blobname(artwork_id: str, size: PictureSize):
    return f"{size}/{artwork_id}.webp"
