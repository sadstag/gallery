from cli.global_config import get_global_config
from cli.log import err
from cli.args import parseArguments
from cli.exceptions import (
    ArgumentsException,
    ConfigurationException,
    ProcessingException,
)
from cli.command.ingest import run_ingest_command
from cli.command.assets import run_assets_command
from cli.command.terraform_config import run_terraform_config

commandHandler = {
    "ingest": run_ingest_command,
    "assets": run_assets_command,
    "terraform_config": run_terraform_config,
}


def main():

    arguments = parseArguments()

    if arguments.command not in commandHandler:
        # should have been prevented by parseArguments()
        raise Exception(f"Unhandled command {arguments.command}")

    get_global_config()  # for side effect, may global config be loaded at this point

    commandHandler[arguments.command](arguments)

    exit(0)


if __name__ == "__main__":
    try:
        main()
        exit(0)
    except (ConfigurationException, ArgumentsException, ProcessingException) as e:
        err(e)
        exit(1)
