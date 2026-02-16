#!/bin/bash
# Fail fast if any command fails
set -e

echo "### 1/5: Puxando código mais recente... ###"
git fetch origin master
git reset --hard origin/master
