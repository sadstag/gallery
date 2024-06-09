from cli.command.subprocessRun import subprocessRun
from cli.const import sites_folder_path
from cli.tools.docker import getDockerImageNameWithTag


def unnest(lst: list[list[str]]):
    return [e for sublst in lst for e in sublst]


def buildDockerImage(*, dev: bool):
    docker_args = unnest(
        [
            [
                "docker",
                "build",
                sites_folder_path,
            ],
            [] if dev else ["--platform", "linux/amd64"],
            [
                "--tag",
                getDockerImageNameWithTag(dev=dev),
            ],
        ]
    )

    subprocessRun(docker_args, "building docker image")


def pushDockerImage():
    docker_args = [
        "docker",
        "push",
        getDockerImageNameWithTag(dev=False),
    ]

    subprocessRun(docker_args, "pushing docker image")
