rm -r dist/checksum.txt dist/checksum.txt.asc dist/doodlewallet-standalone.html
cp dist/index.html dist/doodlewallet-standalone.html
sha256sum dist/doodlewallet-standalone.html >> dist/checksum.txt
gpg --clearsign dist/checksum.txt