#!/bin/sh

if cat /usr/app/nats.log | grep -q "pregame.local.2players.create"; then
  exit 0
else
  exit 1
fi