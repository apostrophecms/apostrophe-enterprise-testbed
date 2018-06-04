#!/bin/bash

# Separate nightwatch invocations to stomp out disparities in behavior,
# an experiment by Tom and Paul.

for scenario in tests/scenarios/*; do
  nightwatch $scenario --config nightwatch.js --env local || exit 1
  # Let sockets go away? Sleeping dogs lie? Something?
  sleep 5
done
