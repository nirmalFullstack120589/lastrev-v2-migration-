#!/bin/bash

# Installing envkey-source
VERSION=$(curl https://envkey-releases.s3.amazonaws.com/latest/envkeysource-version.txt) && curl -s https://envkey-releases.s3.amazonaws.com/envkeysource/release_artifacts/$VERSION/install.sh | bash
