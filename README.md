#Running locally

Do `npm install` followed by `npm start`. It will start a local S3 and you can use the node server URL to check for images. The directory for placing images for testing is trunk-road-assets-dev-local

#For deploying on AWS
Keep your AWS credentials handy.

We use docker for building the nodejs package to run as lambda. For that the following commands need to be executed.
First install docker and then run 
`docker pull amazonlinux`

Then run 
`docker run -v $(pwd):/lambda-project -it amazonlinux`

This will place you inside the docker container. The rest of the commands need to be run from inside the docker container.

`yum install sudo`

`curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -`

`sudo yum -y install nodejs`

`npm install -g serverless`

`cd lambda-project`

`npm install`

Once this is done you have to use the serverless command like so
`serverless`
And set the AWS credentials

After this dependending on whether you are using to deploy into dev or for travis test you run
`npm run deploy-dev`

OR 

`npm run deploy-test`