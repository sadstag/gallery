from subprocess import run

from cli.exceptions import ProcessingException
from cli.log import err, log


def subprocessRun(args: list[str], taskDescription: str):

    log(f"    => executing : {" ".join(args)}")
    completedProcess = run(args, text=True, capture_output=True)

    if completedProcess.returncode != 0:
        err(completedProcess.stderr)
        raise ProcessingException(
            f"{taskDescription} failed with code {completedProcess.returncode}"
        )

    log(completedProcess.stdout)
    log(completedProcess.stderr)

    return completedProcess
