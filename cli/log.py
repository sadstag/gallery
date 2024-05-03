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
    log(*[f"{Fore.yellow}{v}{Style.reset}" for v in values])


def err(
    *values: object,
):
    log(*[f"{Fore.red}{v}{Style.reset}" for v in values], file=stderr)
