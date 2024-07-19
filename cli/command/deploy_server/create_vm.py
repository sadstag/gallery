from re import search

from cli.command.subprocessRun import subprocessRun
from cli.const import get_terraform_folder_path
from cli.exceptions import ProcessingException
from cli.tools.docker import getDockerImageNameWithTag


def create_vm(*, vm_name: str, zone: str, server_cos_image_name: str):
    #
    # getting external static ip
    #
    terraform_args = ["terraform", f"-chdir={get_terraform_folder_path()}", "output"]

    executionResult = subprocessRun(terraform_args, "Retrieving gallery server IP")

    match = search(r"(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})", executionResult.stdout)
    if match is None:
        raise ProcessingException("Could not find gallery server IP")

    ip = match[1]

    #
    # getting service account email
    #
    # gcloud_args = [
    #     "gcloud",
    #     "iam",
    #     "service-accounts",
    #     "list",
    #     "--filter=display_name='Gallery Service Account'",
    #     "--format=value(email)",
    # ]

    # executionResult = subprocessRun(gcloud_args, "Retrieving service account email")

    # service_account_email = executionResult.stdout

    # if not len(service_account_email):
    #     raise ProcessingException(
    #         "Service account is not defined yet: configure terraform and apply"
    #     )

    #
    # creating VM instance
    #

    # this can be done via terraform but it is not yet public and can change anytime
    gcloud_args = [
        "gcloud",
        "compute",
        "instances",
        "create-with-container",
        vm_name,
        f"--zone={zone}",
        "--machine-type=e2-micro",
        "--maintenance-policy=MIGRATE",
        "--provisioning-model=STANDARD",
        "--tags=http-server",
        f"--image=projects/cos-cloud/global/images/{server_cos_image_name}",
        "--boot-disk-size=10GB",
        "--boot-disk-type=pd-standard",
        "--boot-disk-device-name=gallery-server-boot-disk",
        f"--container-image={getDockerImageNameWithTag(dev=False)}",
        "--container-restart-policy=always",
        "--container-tty",
        "--no-shielded-secure-boot",
        "--shielded-vtpm",
        "--shielded-integrity-monitoring",
        f"--labels=goog-ec-src=vm_add-gcloud,container-vm={server_cos_image_name}",
        f"--address={ip}",
        "--network-tier=STANDARD",
    ]

    subprocessRun(gcloud_args, "VM creation")
