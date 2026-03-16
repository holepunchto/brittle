#!/bin/sh
':' // ; exec sh "$(cd "$(dirname "$0")" && pwd -P)/brittle.sh" "$0" --runtime node "$@"
require('./cmd.js')
