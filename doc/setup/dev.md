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

Install [pnpm](https://pnpm.io/installation)

### issues

biome does not work when opening vscode on the project root.

because: biome 1.8.3 has issue with workspaces and/or monorepo.

open front/ in vscode directly.