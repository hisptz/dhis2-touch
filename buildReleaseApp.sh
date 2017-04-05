#!/usr/bin/env bash
ionic plugin remove cordova-plugin-console
ionic build android --release  --prod --aot
