from os.path import abspath, dirname

from cli.PictureSize import PictureSize

resized_picture_width = {
    PictureSize.SMALL: 200,
    PictureSize.MEDIUM: 400,
    PictureSize.LARGE: 1600,
}


#
# local
#


sites_folder = "sites"
assets_folder_name = "assets"
terraform_folder_name = "terraform"

root_path = abspath(f"{dirname(__file__)}/..")

sites_folder_path = f"{root_path}/{sites_folder}"

terraform_variables_filename = "terraform.tfvars.json"
globalconfig_filename = "global_config.json"
siteconfig_filename = "config.json"
artworks_db_filename = "artworks.json"


def get_terraform_folder_path():
    return f"{root_path}/{terraform_folder_name}"


def get_terraform_variables_filename():
    return f"{get_terraform_folder_path()}/{terraform_variables_filename}"


def get_global_config_filepath():
    return f"{root_path}/{globalconfig_filename}"


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


def get_artwork_picture_blobname(artwork_id: str, size: PictureSize):
    return f"artworks/{size}/{artwork_id}.webp"
