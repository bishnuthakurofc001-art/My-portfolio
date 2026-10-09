const fs = require('fs');

const js = fs.readFileSync('/tmp/slater_main.js', 'utf-8');
const audioRe = /https?:\/\/[^\s"'`]+\.(?:mp3|wav|ogg|m4a)/gi;
const audioMatches = js.match(audioRe) || [];
console.log('Audio URLs:', [...new Set(audioMatches)]);

const imgRe = /https?:\/\/[^\s"'`]+\.(?:png|jpg|jpeg|webp|avif|svg)/gi;
const imgMatches = js.match(imgRe) || [];
console.log('Img count in JS:', imgMatches.length);
console.log('Sample Imgs:', [...new Set(imgMatches)].slice(0, 10));

const html = fs.readFileSync('/tmp/bleibtgleich.html', 'utf-8');
const htmlImgs = html.match(imgRe) || [];
console.log('Img count in HTML:', htmlImgs.length);
console.log('Sample HTML Imgs:', [...new Set(htmlImgs)].slice(0, 10));
