#!/bin/bash
set -e

npm run dev &
npx mocha --timeout 5500;
kill -SIGINT $!;

