from os import getenv

from cli.exceptions import ProcessingException


def get_target_site_id():
    site_id = getenv("SITE")
    if site_id is None or site_id == "":
        raise ProcessingException("Missing env var 'SITE'")
    return site_id
