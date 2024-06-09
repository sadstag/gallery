from cli.command.subprocessRun import subprocessRun


def vm_exists(name: str):
    gcloud_args = [
        "gcloud",
        "compute",
        "instances",
        "list",
        f"--filter=name='{name}'",
    ]

    executionResult = subprocessRun(gcloud_args, "Retrieving service account email")

    return len(executionResult.stdout) > 0
