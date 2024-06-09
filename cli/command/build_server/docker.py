from cli.const import artworks_db_filename, content_filename
from cli.exceptions import ProcessingException
from cli.log import log
from cli.tools.file import ctxOpen
from cli.website import get_website_ids


def buildDockerfile(filename: str):
    site_ids = get_website_ids()

    with ctxOpen(filename, "w") as dockerFile:
        try:
            dockerFile.writelines(
                [
                    "FROM joseluisq/static-web-server:2\n",
                    "COPY config.toml /\n",
                ]
            )
            for site_id in site_ids:
                dockerFile.writelines(
                    [
                        f"COPY {site_id}/dist/index.html /gallery/{site_id}/\n",
                        f"COPY {site_id}/dist/{artworks_db_filename} /gallery/{site_id}/\n",
                        f"COPY {site_id}/dist/{content_filename} /gallery/{site_id}/\n",
                        f"COPY {site_id}/dist/assets /gallery/{site_id}/assets/\n",
                    ]
                )
            log(f"Wrote {filename}")
        except Exception as e:
            raise ProcessingException(f"Could not write {filename} : {e}")
