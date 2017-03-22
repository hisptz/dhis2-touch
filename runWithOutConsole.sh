#!/usr/bin/env bash
ionic plugin remove cordova-plugin-console
ionic run android  --prod --aot
ionic plugin add cordova-plugin-console
