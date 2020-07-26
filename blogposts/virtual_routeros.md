<center>

Virtualize Mikrotik's RouterOS with QEMU
</center>


Before you can start the VM, you need to create the virtual disk.
This will be the disk upon which the RouterOS will install itself.

Create the virtual disk image like this:

`> qemu-img create -f qcow2 mikrotik.qcow2 256M`

This script starts up the Mikrotik virtual machine and initializes the
virtual NIC to be connected to our host machine:

![mikrotik vm script](https://www.jer.cx/public/mikrotik_vm_script.png)


Assuming the script is called `vm`, run it passing both the virtual disk
and the Mikrotik ISO as arguments, like so:

`> ./vm  mikrotik.qcow2 mikrotik-6.43.16.iso`

And proceed to install RouterOS on the `qcow2` file.

Once installed, you can run the script without the ISO, like this:

`> ./vm  mikrotik.qcow2`

This is the script I use to initialize the virtual NIC on the host machine:

![mikrotik nic script](https://www.jer.cx/public/mikrotik_nic_script.png)

The **tap0** tap device acts as a virtual ethernet cable,
to which our host machine is connected. We establish the connection between
the tap device and the virtual machine in the `vm` script mentioned above.



And bingo **bango** ***bongo***
![Ferris Bongo](https://jer.cx/public/ferris.gif)


We have a *virtual* NIC in our *virtual* machine.

![virtual nic](https://www.jer.cx/public/virtual_nic.png)


After setting the address of the RouterOS NIC,
we can ping our *host* machine(the address for which is specified in the tap device initialization script)

![vm ping](https://www.jer.cx/public/vm_ping.png)


And we can run Wireshark's `tshark` utility on the **tap1** device to see the pings.

![tshark ping](https://www.jer.cx/public/tshark_ping.png)

(The OSPF *Hello* Packet *is* intentional, but outside of the scope of this blog. For more, see [My VPN](https://jer.cx/blog/My_Virtual_Private_Network) )

With virtualization over Linux, we could theoretically:
* Connect VMs' tap devices with virtual bridges(via `bridge-utils`)
* Bridge remote VMs over IP tunnel
* Bridge VMs' tap devices with a *physical* NIC
* Exchange OSPF routes with the host machine and other VMs
* Source NAT the VMs to give them internet access

This is a *far* more elegant solution to network labbing than virtualizing Cisco equipment via GNS3.

* *Zero* PITA GUIs
* Easily Scriptable
* 100% **Free**

