#!/usr/bin/env bash
rm -r platforms/ node_modules/
npm install
sh installed-plugins.sh
ionic cordova platform add ios
