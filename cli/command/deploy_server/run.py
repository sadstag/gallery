from argparse import Namespace

from cli.global_config import get_global_config

from cli.command.deploy_server.vm_exists import vm_exists
from cli.command.deploy_server.restart_vm import restart_vm
from cli.command.deploy_server.create_vm import create_vm
from cli.command.deploy_server.delete_vm import delete_vm
from cli.log import log


def run(args: Namespace):
    config = get_global_config()

    vm_name = "gallery-server"
    zone = config.server_zone

    does_vm_exists = vm_exists(vm_name)
    log(f"VM exists : {does_vm_exists}")

    if does_vm_exists:
        restart_vm(vm_name=vm_name, zone=zone)
    else:
        delete_vm(vm_name=vm_name, zone=zone)
        create_vm(
            vm_name=vm_name,
            zone=zone,
            server_cos_image_name=config.server_cos_image_name,
        )
