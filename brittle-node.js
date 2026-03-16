#!/bin/sh
':' // ; exec sh "$(cd "$(dirname "$0")" && pwd -P)/brittle.sh" "$0" --node "$@"
require('./cmd.js')