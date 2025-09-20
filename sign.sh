cd dist
rm -r checksum.txt checksum.txt.asc doodlewallet-standalone.html
cp index.html doodlewallet-standalone.html
sha256sum doodlewallet-standalone.html >> checksum.txt
gpg --clearsign checksum.txt
cd ..