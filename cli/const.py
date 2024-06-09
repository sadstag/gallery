from os.path import abspath, dirname

from cli.PictureSize import PictureSize

resized_picture_width = {
    PictureSize.SMALL: 200,
    PictureSize.MEDIUM: 800,
    PictureSize.LARGE: 2400,
}


#
# local
#


sites_folder = "sites"
terraform_folder_name = "terraform"

root_path = abspath(f"{dirname(__file__)}/..")

sites_folder_path = f"{root_path}/{sites_folder}"

terraform_variables_filename = "terraform.tfvars.json"
globalconfig_filename = "global_config.json"
siteconfig_filename = "config.json"
artworks_db_filename = "artworks.json"
content_filename = "content.json"


def get_terraform_folder_path():
    return f"{root_path}/{terraform_folder_name}"


def get_terraform_variables_filename():
    return f"{get_terraform_folder_path()}/{terraform_variables_filename}"


def get_global_config_filepath():
    return f"{root_path}/{globalconfig_filename}"


def get_site_filepath(site_id: str):
    return f"{sites_folder_path}/{site_id}"


#
# inputs
#


def get_site_input_folderpath(site_id: str):
    return f"{get_site_filepath(site_id)}/input"


def get_website_config_filepath(site_id: str):
    return f"{get_site_input_folderpath(site_id)}/{siteconfig_filename}"


def get_site_input_images_folderpath(site_id: str):
    return f"{get_site_input_folderpath(site_id)}/images"


accepted_source_asset_extension = ["jpg", "webp"]


# path to the artwork image source file
# return accepted paths, depending on the format
def get_artwork_images_source_filepaths(site_id: str, artwork_id: str):
    return [
        f"{get_site_input_images_folderpath(site_id)}/{artwork_id}.{ext}"
        for ext in accepted_source_asset_extension
    ]


#
# generated
#


def get_site_public_folderpath(site_id: str):
    return f"{get_site_filepath(site_id)}/public"


def get_site_public_artworks_folderpath(site_id: str):
    return f"{get_site_public_folderpath(site_id)}/artworks"


def get_site_public_artworks_images_folderpath(site_id: str):
    return f"{get_site_public_artworks_folderpath(site_id)}/images"


def get_artwork_images_output_filepath(
    site_id: str, artwork_id: str, size: PictureSize
):
    return f"{get_site_public_artworks_images_folderpath(site_id)}/{size}/{artwork_id}.webp"


def get_artworks_db_filepath(site_id: str):
    return f"{get_site_public_folderpath(site_id)}/{artworks_db_filename}"


def get_content_filepath(site_id: str):
    return f"{get_site_public_folderpath(site_id)}/{content_filename}"


#
# built by front
#


def get_site_dist_folderpath(site_id: str):
    return f"{get_site_filepath(site_id)}/dist"


def get_site_dist_artworks_folderpath(site_id: str):
    return f"{get_site_dist_folderpath(site_id)}/artworks"


#
# built by server build
#


def get_server_config_filename():
    return f"{sites_folder_path}/config.toml"


def get_server_docker_filename():
    return f"{sites_folder_path}/Dockerfile"
