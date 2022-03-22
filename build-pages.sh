#!/bin/sh

mkdir public/node_modules/
cp -R node_modules/* public/node_modules/
cp python/tmp/results.json public/results.json
cp tmp/results.json public/results.json