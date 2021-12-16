# Infrastructure

## Table of content

- [Infrastructure](#infrastructure)
  - [Table of content](#table-of-content)
  - [EC2](#ec2)
  - [GitHub](#github)
  - [Amplify](#amplify)
  - [Load Balancer and Route53](#load-balancer-and-route53)
  - [Cognito](#cognito)
  - [Amplify lib](#amplify-lib)
    - [Useful links:](#useful-links)


## EC2
Only Sportfolios-Stable run on a EC2. Each EC2 have a Crontab for every day at 3am. The Cron job pull the script updateDockerBuild.sh from S3 bucket (sportfolios-conf).

Script contents:
```bash
# Update Database
cd sportfolios-data
git reset --hard
git pull
db-migrate up
cd ..
# Clean up old image
sudo docker image prune -a -f
# Pull last Docker image version with tag
sudo docker pull sportfoliosapp/sportfolios-stable:tag
# Close Sportfolio Docker and remove it
sudo docker stop sportfolios-stable
sudo docker rm sportfolios-stable
#Run new image
sudo docker run --name sportfolios-stable -p 1337:1337 --restart unless-stopped sportfoliosapp/sportfolios-stable:tag
```
If you need to update the EC2, you need to create a new image first. After you can update the auto scaling group config with the new image.

## GitHub
In the repository Sportfolios-Stable, the folder /.github/workflows/ containts the action script to create docker images when something is push on develop and on master. The script build a new image and use the tag staging for develop branch and production for master branch. After, the Docker image is push on sportfoliosapp/sportfolios-stable repository on DockerHub.

```bash
name: Docker Image CI

on:
  push:
    branches: [master]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Log in to Docker Hub
        uses: docker/login-action@f054a8b539a109f9f41c372932f1ae047eff08c9
        with:
          username: ${{ secrets.USERNAME_DOCKER }}
          password: ${{ secrets.PASSWORD_DOCKER }}
      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@98669ae865ea3cffbcbaa878cf57c20bbf1c6c38
        with:
          images: sportfoliosapp/sportfolios-stable
      - name: Build and push Docker image prod
        uses: docker/build-push-action@v2
        with:
          username: ${{ secrets.USERNAME_DOCKER }}
          password: ${{ secrets.PASSWORD_DOCKER }}
          repository: sportfoliosapp/sportfolios-stable
          context: .
          push: true
          tags: sportfoliosapp/sportfolios-stable:staging
          labels: ${{ steps.meta.outputs.labels }}
          file: Dockerfile.staging
```
Each script use is onw Dockerfile. You can find the Dockerfile inside Sportfolios-Stable repository. You can change node version in that file or the command which start the docker (cmd ...). To change the path for the config file you need to update startStaging.sh or startProduction.sh. Every config files are in the bucket S3 sportfolios-config.

## Amplify
Amplify pull the config file from Sportfolios-config bucket. To define the path of the folder, you need to redefine the environment variables for a specific branch.

Each time something is push on the branch develop of sportfolios-next, Amplify will try to redeploy the frontend with the new code. For the production frontend, Amplify watch the master branch.

## Load Balancer and Route53
All entries of sportfolios.app or the API inside Route53, now point directly to a service. For the API, Route53 point to Load Balancer and for the frontend, Route53 point to Amplify.

For production, the security group of Load balancer is updated by the Auto Scaling group. For staging environment, if you change the machine, you need to update the security group and add the new EC2.

## Cognito
If you need to change the template of email, two lambda function create the email (custom_email_cognito and production_custom_email_cognito). 
https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-message.html

## Amplify lib
All federated login and cognito login in frontend use Amplify library and JWT token.
### Useful links:
https://aws-amplify.github.io/amplify-js/api/classes/authclass.html#verifycurrentuserattribute
https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#custom-attributes
