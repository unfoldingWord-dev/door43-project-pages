#!/usr/bin/env bash
# -*- coding: utf8 -*-
#
#  Copyright (c) 2016 unfoldingWord
#  http://creativecommons.org/licenses/MIT/
#  See LICENSE file for details.

BKT="s3://test-door43-projects/"

s3cmd --rr -M -F \
    --no-mime-magic --delete-removed \
    --add-header="Cache-Control:max-age=600" \
    "$SOURCE" "$BKT"
