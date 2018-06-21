#!/bin/bash

# Separate nightwatch invocations to stomp out disparities in behavior

for scenario in tests/scenarios/*; do
  npx nightwatch $scenario --config nightwatch.js --env local || exit 1
  # Let sockets go away? Sleeping dogs lie? Something?
  sleep 5
done

echo "Tests PASSED"
