from cli.global_config import get_global_config


def getDockerImageNameWithTag(*, dev: bool):
    config = get_global_config()
    return "/".join(
        [
            f"{config.region.lower()}-docker.pkg.dev",
            config.project_id,
            config.artifact_repository_name,
            f"gallery:latest{"-dev" if dev else ''}",
        ]
    )
