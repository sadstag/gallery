from cli.command.subprocessRun import subprocessRun
from cli.log import log
from cli.tools.docker import getDockerImageNameWithTag


def restart_vm(*, vm_name: str, zone: str):

    log("Restarting VM, this may take some time …")

    gcloud_args = [
        "gcloud",
        "compute",
        "instances",
        "update-container",
        vm_name,
        f"--zone={zone}",
        "--container-image",
        getDockerImageNameWithTag(dev=False),
    ]

    subprocessRun(gcloud_args, "VM restart")
