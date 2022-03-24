/// <reference path="../node_modules/@types/p5/global.d.ts" />

var data = null;
var colors = null;
var opacities = null;

fetch('./results.json').then(response => response.json()).then(json => {
    data = json;

    opacities = {};
    Object.keys(data).forEach((lang) => {
        opacities[lang] = {
            'left': OPACITY_DEFAULT,
            'right': OPACITY_DEFAULT
        };
        Object.keys(data[lang]).forEach((lang_2) => {
            opacities[lang][lang_2] = OPACITY_DEFAULT;
        })
    })
});

fetch('https://raw.githubusercontent.com/ozh/github-colors/master/colors.json').then(response => response.json()).then(json => {
    colors = json;
    colors['HTML/CSS'] = colors['HTML'];
    colors['Bash/Shell'] = colors['Shell'];
    colors['Node.js'] = colors['JavaScript'];
    colors['Matlab'] = colors['MATLAB'];
    colors['Delphi'] = {'color':'pink'};
    colors['LISP'] = colors['NewLisp'];
    colors['COBOL'].color = 'orange';
});



var side_width;
var lang_height;

const OPACITY_DEFAULT = 0.8;
const OPACITY_HIDDEN = 0.1;
const OPACITY_SHOWN = 0.9;

var hover_index_left = -1;
var hover_index_right = -1;

function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);

    side_width = width * 1 / 5;


    while (data == null || colors == null);
    lang_height = height / Object.keys(data).length;
}

function draw() {
    background(250);
    updateOpacities();


    push();
    noStroke();
    Object.keys(data).forEach((lang_1) => {

        Object.keys(data[lang_1]).forEach((lang_2) => {
            
        });
        fill(colors[lang_1].color);
        rectMode(CORNER);
        rect(0,0,side_width,lang_height);
        rect(width - side_width,0,side_width,lang_height);
        translate(0,lang_height);
        fill((lang_1 == 'Crystal' || lang_1 == 'PowerShell') ? 'white' : 'black');
        text(lang_1,10,-lang_height / 3);
        text(lang_1,width - side_width + 10,-lang_height / 3);
    });
    pop();
}

function updateOpacities() {
    if(hover_index_left != -1) {
        Object.keys(opacities).forEach((lang_1,index) => {
            opacities[lang_1]['left'] = smooth(opacities[lang_1]['left'],hover_index_left == index ? OPACITY_SHOWN : OPACITY_HIDDEN);
            opacities[lang_1]['right'] = smooth(opacities[lang_1]['right'],OPACITY_DEFAULT);

            Object.keys(opacities).forEach((lang_2) => {
                opacities[lang_1][lang_2] = smooth(opacities[lang_1][lang_2],hover_index_left == index ? OPACITY_SHOWN : OPACITY_HIDDEN);
            });
        });
    } else if(hover_index_right != -1) {
        Object.keys(opacities).forEach((lang_1,index) => {
            opacities[lang_1]['right'] = smooth(opacities[lang_1]['right'],hover_index_right == index ? OPACITY_SHOWN : OPACITY_HIDDEN);
            opacities[lang_1]['left'] = smooth(opacities[lang_1]['left'],OPACITY_DEFAULT);

            Object.keys(opacities).forEach((lang_2,index_2) => {
                opacities[lang_1][lang_2] = smooth(opacities[lang_1][lang_2],hover_index_right == index_2 ? OPACITY_SHOWN : OPACITY_HIDDEN);
            });
        });
    } else {
        Object.keys(opacities).forEach((lang_1) => {
            opacities[lang_1]['left'] = smooth(opacities[lang_1]['left'],OPACITY_DEFAULT);
            opacities[lang_1]['right'] = smooth(opacities[lang_1]['right'].OPACITY_DEFAULT);

            Object.keys(opacities).forEach((lang_2) => {
                opacities[lang_1][lang_2] = smooth(opacities[lang_1][lang_2],OPACITY_DEFAULT);
            });
        })
    }
}

function smooth(initial,goal) {
    return initial + (goal - initial) * 0.1;
}



function mouseMoved() {
    hover_index_left = -1;
    hover_index_right = -1;
    if(mouseX < side_width) {
        hover_index_left = int(mouseY / lang_height);
    } else if(mouseY > width - side_width) {
        hover_index_right = int(mouseY / lang_height);
    }
}