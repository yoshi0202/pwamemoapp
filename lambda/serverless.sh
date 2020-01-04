#!/bin/bash
git clone https://github.com/awslabs/aws-serverless-express.git ase
cp -r ase/examples/basic-starter/scripts .
cp ase/examples/basic-starter/api-gateway-event.json .
cp ase/examples/basic-starter/cloudformation.yaml .
cp ase/examples/basic-starter/lambda.js .
cp ase/examples/basic-starter/simple-proxy-api.yaml .
rm -rf ase
