#!/bin/sh

if cat /usr/app/nats.log | grep -q "game.start"; then
  exit 0
else
  exit 1
fi