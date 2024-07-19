#!/bin/sh

[ "$1" == "" ] && {
    echo "Missing command name"
    exit 1
}

COMMAND="$1"
shift

invoke()
{
    echo "Invoking: " $*
    $*
}

invoke_front()
{
    cd front;
    bun install;
    echo "Invoking: " $*
    $*
    cd -
}

invoke_terraform() {
    cd terraform
    terraform $*
    cd -
}

case "$COMMAND" in
   "terraform_config") invoke "python -m cli terraform_config";;
   "terraform") invoke_terraform $*;;
   "ingest") invoke "python -m cli ingest $*";;
   "resize") invoke "python -m cli resize $*";;
   "sync_bucket") invoke "python -m cli sync_bucket $*";;
   "build_front") invoke_front "bun run build";;
   "dev_front") invoke_front "bun run dev";;
   "preview_front") invoke_front "bun run preview";;
   "build_server") invoke "python -m cli build_server";;
   "build_server_dev") invoke "python -m cli build_server --dev";;
   "deploy_server") invoke "python -m cli deploy_server";;
   *) echo "Unknown command \"$COMMAND\""; exit 3
esac

