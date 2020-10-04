#!/bin/sh

pids=$PWD/pids

end() {
	if [ ! -f $pids ]; then
		return
	fi
	while read pid; do
		kill $pid 2>/dev/null
		wait $pid
	done < $pids
	killall stress
	rm -f $pids
}

purple() {
	tput bold
	tput setaf 5
}

normal() {
	tput setaf 7
	tput sgr0
}

hello() {
	echo
	purple
	echo "hey guy"
	normal
}

sudo apt -y install stress

if [ ! -d gpu-burn ]; then
	git clone https://github.com/wilicc/gpu-burn
fi
cd gpu-burn
make CUDAPATH=/usr
cd ../

if [ ! -d memtester ]; then
	git clone https://github.com/jeremybobbin/memtester
fi
cd memtester
make
cd ../

until printf "How long to run stress, gpu-burn & memtester? (minutes) ";
	purple;
	read min && echo $min | grep -Eq '^[0-9]+$';
do
	normal
	echo try again
done
normal

secs=$((min * 60))
printf "Running for %d minutes(%d seconds)\n" $min $secs

trap "end" INT TERM KILL

sleep "$(awk 'BEGIN{srand(); print int(rand()*200)}')" && hello &
echo $! >> $pids

echo "starting stress"
stress --cpu `nproc` --timeout $secs &
echo $! >> $pids

echo "starting gpu-burn"
(
	cd gpu-burn;
	./gpu_burn $secs &
	echo $! >> $pids;
)

echo "starting memtester"
./memtester/memtester $(free -b | awk '/^Mem:/ { print int($7 * 0.95); exit }')
