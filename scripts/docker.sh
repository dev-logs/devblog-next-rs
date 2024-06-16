#!/bin/bash

docker run -p 3000:3000 --rm -v $(pwd):/app node:20.11.0 yarn --cwd /app $@