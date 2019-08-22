#!/bin/bash
rm -r src/assets/library
npm run compodoc
git add docs/
git commit -m 'Updating docs'
git reset --hard