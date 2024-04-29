from typing import TextIO
from sys import stderr
from colored import Fore, Style  # type: ignore


def log(
    *values: object,
    file: TextIO | None = None,
):
    print(*values, file=file)


def warn(
    *values: object,
    file: TextIO | None = None,
):
    print(*[f"{Fore.yellow}{v}{Style.reset}" for v in values])


def err(
    *values: object,
):
    log(*values, file=stderr)
