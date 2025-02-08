#!/usr/bin/env bash
npm install
npm run build
rsync -rtv ./dist/ /Users/rubenarakelyan/SynologyDrive/wackomenace.co.uk/
rm -rf ./dist/
