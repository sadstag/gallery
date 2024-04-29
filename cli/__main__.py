from cli.log import err
from cli.args import parseArguments
from cli.exceptions import (
    ArgumentsException,
    ConfigurationException,
    ProcessingException,
)
from cli.command.ingest import runIngestCommand
from cli.command.assets import runAssetsCommand
from cli.command.backup import runBackupCommand

commandHandler = {
    "ingest": runIngestCommand,
    "assets": runAssetsCommand,
    "backup": runBackupCommand,
}


def main():

    arguments = parseArguments()

    if arguments.command not in commandHandler:
        # should have been prevented by parseArguments()
        raise Exception(f"Unhandled command {arguments.command}")

    commandHandler[arguments.command](arguments)

    exit(0)


if __name__ == "__main__":
    try:
        main()
        exit(0)
    except (ConfigurationException, ArgumentsException, ProcessingException) as e:
        err(e)
        exit(1)
