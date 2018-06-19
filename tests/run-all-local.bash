#!/bin/bash

# Separate nightwatch invocations to stomp out disparities in behavior,
# an experiment by Tom and Paul.

for scenario in tests/scenarios/*; do
  npx nightwatch $scenario --config nightwatch.js --env local || FAIL=1
  # Let sockets go away? Sleeping dogs lie? Something?
  sleep 5
done

echo "FAIL flag is $FAIL"

if [ "$FAIL" == "1" ]; then
  exit 1
fi
