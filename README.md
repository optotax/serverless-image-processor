docker pull amazonlinux

docker run -v $(pwd):/lambda-project -it amazonlinux

yum install sudo

curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -

sudo yum -y install nodejs

npm install -g serverless

cd lambda-project

npm install

serverless
#### set credentials

serverless deploy