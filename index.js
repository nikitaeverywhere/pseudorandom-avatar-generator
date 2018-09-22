const { rand } = require("./prng.js");

module.exports.generateSvgAvatar = generateSvgAvatar;

const maxColor = parseInt("fff", 16);
const defaultSize = 128;
const defaultSvgNs = "http://www.w3.org/2000/svg";
const minShapes = 2;
const randomShapes = 2; // inclusive, from 2 to 8 shapes total
const minDir = Math.PI / 2 * 0.10;
const minDist = 0.20;
const maxDist = 0.60;
const minSpreadDist = 0.1;
const colorSpread = 0.15;

function generateSvgAvatar (seed = "", {
    size = defaultSize,
    svgNs = defaultSvgNs
} = {}) {
    const svg = document.createElementNS(svgNs, "svg");
    svg.setAttributeNS(null, "width", size);
    svg.setAttributeNS(null, "height", size);
    svg.appendChild(generateSvgGAvatar(seed, { size, svgNs }));
    return svg;
}

function generateSvgGAvatar (seed = "", options) {
    options.size = options.size || defaultSize;
    const g = document.createElementNS(options.svgNs, "g");
    const rect = document.createElementNS(options.svgNs, "rect");
    const random = rand(seed).double;
    const shapes = minShapes + Math.floor(random() * (randomShapes + 1));
    const color = new ColorGen(random);
    rect.setAttributeNS(null, "width", options.size);
    rect.setAttributeNS(null, "height", options.size);
    rect.setAttributeNS(null, "fill", randomColor(random));
    g.appendChild(rect);
    for (let shape = 0; shape < shapes; ++shape) {
        g.appendChild(genShape(random, color, options));
    }
    return g;
}

function genShape (random, color, options) {
    let aX = random() * options.size;
    let aY = random() * options.size;
    let bX = random() * options.size;
    let bY = random() * options.size;
    let d = distance(aX, aY, bX, bY);
    const dir = Math.atan2(aY - bY, bX - aX);
    if (d < minDist * options.size || d > maxDist * options.size) {
        const delta = d < minDist * options.size
            ? (minDist * options.size - d) / 2
            : (maxDist * options.size - d) / 2;
        aX += Math.cos(dir + Math.PI) * delta;
        aY -= Math.sin(dir + Math.PI) * delta;
        bX += Math.cos(dir) * delta;
        bY -= Math.sin(dir) * delta;
        d = distance(aX, aY, bX, bY);
    }
    const sAa = minSpreadDist * options.size + random() * Math.max(0, d - minSpreadDist * options.size);
    const sBa = minSpreadDist * options.size + random() * Math.max(0, d - minSpreadDist * options.size);
    const sAb = minSpreadDist * options.size + random() * Math.max(0, d - minSpreadDist * options.size);
    const sBb = minSpreadDist * options.size + random() * Math.max(0, d - minSpreadDist * options.size);
    const dir1a = dir + minDir + (Math.PI - minDir * 2) * random();
    const dir2a = dir + minDir + (Math.PI - minDir * 2) * random();
    const dir1b = dir1a + Math.PI;
    const dir2b = dir2a + Math.PI;
    const path = `M ${ aX } ${ aY } `
        + `C ${ aX + Math.cos(dir1b) * sAb } ${ aY - Math.sin(dir1b) * sAb } `
        + `${ bX + Math.cos(dir2b) * sBb } ${ bY - Math.sin(dir2b) * sBb } `
        + `${ bX } ${ bY } `
        + `C ${ bX + Math.cos(dir2a) * sBa } ${ bY - Math.sin(dir2a) * sBa } `
        + `${ aX + Math.cos(dir1a) * sAa } ${ aY - Math.sin(dir1a) * sAa } `
        + `${ aX } ${ aY }`;
    const element = document.createElementNS(options.svgNs, "path");
    element.setAttributeNS(null, "d", path);
    element.setAttributeNS(null, "fill", color.next(random));
    // debug(g, [aX, aY]);
    // debug(g, [aX + Math.cos(dir1b) * sAb, aY - Math.sin(dir1b) * sAb], "#0f0");
    // debug(g, [aX + Math.cos(dir1a) * sAa, aY - Math.sin(dir1a) * sAa], "#00f");
    // debug(g, [bX, bY]);
    // debug(g, [bX + Math.cos(dir2b) * sBb, bY - Math.sin(dir2b) * sBb], "#0f0");
    // debug(g, [bX + Math.cos(dir2a) * sBa, bY - Math.sin(dir2a) * sBa], "#00f");
    // debugLine(g, [aX, aY, dir]);
    return element;
}

// function debug (element, [x, y], color = "#f00") {
//     setTimeout(() => {
//         const circle = document.createElementNS(defaultSvgNs, "circle");
//         circle.setAttributeNS(null, "cx", x);
//         circle.setAttributeNS(null, "cy", y);
//         circle.setAttributeNS(null, "r", 3);
//         circle.setAttributeNS(null, "fill", color);
//         return element.appendChild(circle);
//     }, 0);
// }

// function debugLine (element, [x, y, dir], color = "#f00") {
//     setTimeout(() => {
//         const line = document.createElementNS(defaultSvgNs, "line");
//         line.setAttributeNS(null, "x1", x);
//         line.setAttributeNS(null, "y1", y);
//         line.setAttributeNS(null, "x2", x + Math.cos(dir) * 100);
//         line.setAttributeNS(null, "y2", y - Math.sin(dir) * 100);
//         line.setAttributeNS(null, "stroke", color);
//         return element.appendChild(line);
//     }, 0);
// }

class ColorGen {

    constructor (random) {
        this.random = random;
        this.colors = [-1, -1, -1];
    }

    next () {
        this.colors = this.colors.map(c =>
            Math.max(0, Math.min(255.999,
                (c === -1 ? this.random() * 256 : c - colorSpread * 256 + this.random() * (2 * colorSpread * 256))
            ))
        );
        return `rgb(${ Math.floor(this.colors[0]) },${ Math.floor(this.colors[1]) },${
            Math.floor(this.colors[2]) })`;
    }

}

function randomColor (random) {
    return `#${ Math.floor(random() * maxColor).toString(16) }`;
}

function distance (x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}