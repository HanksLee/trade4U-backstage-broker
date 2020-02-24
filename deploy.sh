#!/bin/bash

echo $BRANCH
npm install
npm run lint
if [ $BRANCH == "origin/develop" ]
then
  echo "develop branch building..."
  npm run build:qa
elif [ $BRANCH == "origin/master" ]
then
  echo "master branch building..."
  npm run build:prod
else
  echo "develop branch building..."
  npm run build:qa
fi

