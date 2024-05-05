# setting up your dev environment

## python

install pyenv : https://github.com/pyenv/pyenv?tab=readme-ov-file#installation

```shell
$ pyenv install 3.12.2
$ pyenv local 3.12.2
$ pyenv virtualenv 3.12.2 gallery-3.12.2
$ pyenv activate gallery-3.12.2
```

- install pipx : https://pipx.pypa.io/stable/installation/
- install poetry : https://python-poetry.org/docs/#installing-with-pipx, TDLR : `pipx install poetry`

```shell
$ cd ingest/ && poetry install
```

## front

First [Install bun](https://bun.sh/docs/installation)

```shell
$ cd [gallery_root_folder]/front
$ bun install
```