#!/bin/bash

npm run dev &
npx mocha --timeout 10000;
kill -SIGINT $!

