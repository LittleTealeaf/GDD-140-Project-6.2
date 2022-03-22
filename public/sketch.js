/// <reference path="../node_modules/@types/p5/global.d.ts" />

var data = null;

fetch('./results.json').then(response => response.json()).then(json => {
    data = json
});

function setup() {
    createCanvas(800,600);
}

function draw() {
    background(225);
}