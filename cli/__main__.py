from cli.global_config import get_global_config
from cli.log import err
from cli.args import parseArguments
from cli.exceptions import (
    ArgumentsException,
    ConfigurationException,
    ProcessingException,
)
from cli.command.ingest import run_ingest_command
from cli.command.resize import run_resize_command
from cli.command.sync_bucket import run_sync_bucket_command
from cli.command.terraform_config import run_terraform_config
from cli.command.build_server import run_build_server_command
from cli.command.deploy_server import run_deploy_server_command

commandHandler = {
    "ingest": run_ingest_command,
    "resize": run_resize_command,
    "sync_bucket": run_sync_bucket_command,
    "terraform_config": run_terraform_config,
    "build_server": run_build_server_command,
    "deploy_server": run_deploy_server_command,
}


def main():

    arguments = parseArguments()

    if arguments.command not in commandHandler:
        # should have been prevented by parseArguments()
        raise Exception(f"Unhandled command {arguments.command}")

    get_global_config()  # for side effect, let global config be loaded at this point

    commandHandler[arguments.command](arguments)

    exit(0)


if __name__ == "__main__":
    try:
        main()
        exit(0)
    except (ConfigurationException, ArgumentsException, ProcessingException) as e:
        err(e)
        exit(1)
