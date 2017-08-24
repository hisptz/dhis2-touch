#!/usr/bin/env bash
rm -r platforms/ node_modules/
sh installed-plugins.sh
ionic cordova platform add android@6.2.1
