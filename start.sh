#!/bin/bash

export PORT=5300

cd ~/www/checkers
./bin/checkers stop || true
./bin/checkers start

