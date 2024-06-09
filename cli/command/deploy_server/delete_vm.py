from re import search

from cli.command.subprocessRun import subprocessRun
from cli.log import log


def delete_vm(*, vm_name: str, zone: str):
    gcloud_args = [
        "gcloud",
        "compute",
        "instances",
        "list",
        f"--filter=name=('{vm_name}')",
        f"--zones={zone}",
    ]

    executionResult = subprocessRun(gcloud_args, "VM existence test")

    match = search(rf"{vm_name}\s+{zone}", executionResult.stdout)

    if match is not None:
        gcloud_args = [
            "gcloud",
            "compute",
            "instances",
            "delete",
            vm_name,
            f"--zone={zone}",
            "--quiet",
        ]

        log("Deleting previous VM instance, this may take like 2 minutes ...")
        subprocessRun(gcloud_args, "VM deletion")
