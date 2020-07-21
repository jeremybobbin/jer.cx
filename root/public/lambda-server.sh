LAMBDA_REPO=$(mktemp) && \
wget -O${LAMBDA_REPO} https://lambdalabs.com/static/misc/lambda-stack-repo.deb && \
sudo dpkg -i ${LAMBDA_REPO} && rm -f ${LAMBDA_REPO} && \
sudo apt-get --yes update && \
sudo apt-get --yes upgrade && \
echo "cudnn cudnn/license_preseed select ACCEPT" | sudo debconf-set-selections && \
sudo apt-get install --yes --no-install-recommends lambda-server && \
sudo apt-get install --yes --no-install-recommends nvidia-440 libcuda1-440 nvidia-opencl-icd-440 && \
sudo apt-get install --yes --no-install-recommends lambda-stack-cuda
