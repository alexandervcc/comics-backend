#!/bin/bash

if [ -z "$1" ]; then
  echo "Error: No service directory provided."
  echo "Usage: ./build.sh <directory>"
  exit 1
fi

# Assign the directory argument to a variable
DIR=$1

if [ ! -d "$DIR" ]; then
  echo "Error: Directory '$DIR' does not exist."
  exit 1
fi

cd "$DIR"

echo "Switched to directory: $(pwd)"

echo "Starting Maven package build..."
cd 
./mvnw package

if [ $? -eq 0 ]; then
  echo "Build successful!"
else
  echo "Build failed!"
fi
