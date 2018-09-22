# [Pseudorandom Avatar Generator](https://www.npmjs.com/package/pseudorandom-avatar-generator)

[![npm](https://img.shields.io/npm/v/pseudorandom-avatar-generator.svg)](https://www.npmjs.com/package/pseudorandom-avatar-generator)
[![License](https://img.shields.io/github/license/zitros/pseudorandom-avatar-generator.svg)](LICENSE)
[![Build Status](https://travis-ci.org/ZitRos/pseudorandom-avatar-generator.svg?branch=master)](https://travis-ci.org/ZitRos/pseudorandom-avatar-generator)

Generate beautiful pseudorandom avatars. Same input always gives the same pseudorandom avatar.

Differences from other libraries (...):
+ Input-length-independent. Some libraries only take N first bytes from the input or so.
+ Truly random: even a slight change in the input give completely another avatar.
+ Infinitely random. The only limit is the display resolution.
+ Made smooth and good-looking.

![image](https://user-images.githubusercontent.com/4989256/45922572-4a167800-bed8-11e8-9c28-50351d8835fc.png)

Example
-------

```javascript
import { generateSvgAvatar } from "pseudorandom-avatar-generator";

[
    generateSvgAvatar("Nikita"), // Pseudorandom avatar for your name!
    generateSvgAvatar("Nikita"), // Gives the same picture as above!
    generateSvgAvatar("0x9D889b9c7cc90B7cD2324b3Bb514a2E2ec82aC4F".toLowerCase()), // Avatar for your Ethereum address!
    generateSvgAvatar("13UZ4ByrQHJ3EMh1yL7BTyMHgvWJmuxukE".toLowerCase()) // Avatar for your bitcoin address!
].forEach(avatar => document.body.appendChild(avatar));
```

Licence
-------

[MIT](LICENSE) © [Nikita Savchenko](https://nikita.tk)
