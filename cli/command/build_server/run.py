from argparse import Namespace

from cli.command.build_server.config import buildSWSConfig
from cli.command.build_server.docker import buildDockerfile
from cli.command.build_server.image import buildDockerImage, pushDockerImage
from cli.const import (
    get_server_config_filename,
    get_server_docker_filename,
)
from cli.log import log


from cli.tools.docker import getDockerImageNameWithTag


def run(args: Namespace):
    dev = args.dev

    buildSWSConfig(get_server_config_filename(), dev=dev)
    buildDockerfile(get_server_docker_filename())

    buildDockerImage(dev=dev)

    if dev:
        docker_args = [
            "docker",
            "run",
            "--rm",
            "--name",
            "gallery_dev",
            "--publish",
            "8080:80",
            getDockerImageNameWithTag(dev=True),
        ]
        log("---\n--- Build done\n---\n\nTo test this image :\n")
        log(
            "- trick dns :manage to have your OS resolve your site domains to localhost "
            "(/etc/hosts on linux/mac)"
        )

        log("- run: ", " ".join(docker_args))
        log("- browse: http://<your_domain>:8080")
    else:
        pushDockerImage()
