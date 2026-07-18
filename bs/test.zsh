#! /usr/bin/env zsh
# check no tracked image leaks GPS or device metadata

python3 tests/check_image_privacy.py
