#!/usr/bin/env bash
ionic plugin remove cordova-plugin-console
ionic run android --release  --prod --aot
ionic plugin add cordova-plugin-console
