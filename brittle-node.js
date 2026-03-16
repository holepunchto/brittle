#!/bin/sh
':' // ; exec sh "$(dirname "$0")/brittle.sh" "$0" --runtime node "$@"
require('./cmd.js')
