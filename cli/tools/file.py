from contextlib import contextmanager


@contextmanager
def ctxOpen(filepath: str, mode: str = "r"):
    f = open(filepath, mode)
    try:
        yield f
    finally:
        f.close()
