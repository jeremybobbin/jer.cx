<center>
OpenVPN-based Virtual Private Network
</center>


### These are the NICs on my laptop:


![NICs](https://www.jer.cx/public/nics.png)


__tap0__ and __tap1__ are virtual NICs, that act as if they're connected
to network switches.

In this instance, __tap0__ is connected to the VPN _'LAN'_
(I want to call it 'VLAN' but that generally refers to virtualized instances
of a physical LAN).

__tap1__ is for my QEMU VMs. It's enstantiated by this script:

![tap1](https://www.jer.cx/public/tap1.png)


All it does is create the tap device, enable it and run a DHCP server on it.
And here is the routing table on my VPS. The VPS is connect on the VPN via its tap device, __tap0__.

![tap1](https://www.jer.cx/public/vps_routes.png)

_Now_, you may be wondering,
"how in the _heck_ does the VPS know about __172.20.0.0/16__?!"
Actually, probably not. If you know how to _read_ the routing table, you probably know what's going on.

You see how it says _Zebra_ on the __172.20.0.0/16__ and the __192.168.0.0/24__ routes?
That segment is indicative of _how_ the kernel learned about the route, which is, in this case
due to [Quagga's](https://www.quagga.net/) Zebra daemon.

[Quagga](https://www.quagga.net/) is a routing software suite for Unix platforms. It's `vtysh`
shell _closely_ emulates that of the Cisco IOS, which I quite like. Quagga comes with the `ospfd`,
which I've configured like so:

![tap1](https://www.jer.cx/public/ospf.png)

That's the OSPF configuration for my ThinkPad.
Quagga is _super_ easy to configure and get running properly,
and it saves time.

I can send my VMs' logs to the VPS, copy files
from the VPS to the VMs, I can create an SSH tunnel from the VMs to the VPS, etc, etc;

