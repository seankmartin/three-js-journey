#!/bin/bash

echo "Creating new project $1"
npm create vite@latest $1 -- --template vanilla-ts
cd $1
npm install --save three
npm install --save-dev @types/three
npm install --save lil-gui
npm install
npx vite