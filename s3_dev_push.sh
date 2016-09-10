#!/usr/bin/env bash
# -*- coding: utf8 -*-
#
#  Copyright (c) 2016 unfoldingWord
#  http://creativecommons.org/licenses/MIT/
#  See LICENSE file for details.

BKT="s3://test-door43-projects/"
SOURCE="./"

s3cmd sync --exclude-from s3_excludes "$SOURCE" "$BKT"
