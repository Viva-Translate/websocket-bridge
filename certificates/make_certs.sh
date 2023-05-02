#!/usr/bin/env bash
set -euo pipefail

KEYNAME="key.pem"
CERTNAME="cert.pem"
CSRNAME="test.csr"
openssl req -new -newkey rsa:4096 -nodes -keyout $KEYNAME -out $CSRNAME
openssl x509 -req -sha256 -days 365 -in $CSRNAME -signkey $KEYNAME -out $CERTNAME
