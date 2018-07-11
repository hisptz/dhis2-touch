#!/usr/bin/env bash
rm -r platforms/ node_modules/ plugins/
npm install
sh installed-plugins.sh
ionic cordova platform add ios
