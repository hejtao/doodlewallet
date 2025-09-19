# Doodle Wallet

A tool for generating mnemonic words by your own random behavior.

## Online version

[https://doodlewallet.netlify.app/](https://doodlewallet.netlify.app/)

## Offline version

- Download `doodlewallet-standalone.html` from the [releases page](https://github.com/hejtao/doodlewallet/releases).
- Open it in your browser.

## The randomness of the generated mnemonic words

Each stroke determines a bit of the entropy which is then determines the final mnemonic words. Doodlewallet tries to guarantee each stroke half possibility of bit 0 or 1, just like a coin flip.

Suppose (x1, y1), (x2, y2) and (x3, y3) are three points sampled from a stroke, then the bit of the entropy is determined by Math.round((x1+x2+x3+y1+y2+y3)/3)%2.
