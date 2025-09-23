#!/bin/sh

if cat /usr/app/nats.log | grep -q "pregame.quickMatch.local.2.create"; then
  exit 0
else
  exit 1
fi