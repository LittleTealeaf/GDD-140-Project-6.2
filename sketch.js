/// <reference path="../node_modules/@types/p5/global.d.ts" />

var data = null;
var opacities = null;

const OPACITY_DEFAULT = 0.8;
const OPACITY_HIDDEN = 0.3;
const OPACITY_SHOWN = 0.9;

fetch('https://raw.githubusercontent.com/ozh/github-colors/master/colors.json').then(response => response.json()).then(colors => {
    colors['HTML/CSS'] = colors['HTML'];
    colors['Bash/Shell'] = colors['Shell'];
    colors['Node.js'] = colors['JavaScript'];
    colors['Matlab'] = colors['MATLAB'];
    colors['Delphi'] = { 'color': 'pink' };
    colors['LISP'] = colors['NewLisp'];
    colors['COBOL'].color = 'orange';

    fetch('./results.json').then(response => response.json()).then(data_json => {
        data = Object.keys(data_json).map((key) => (
            {
                'lang': key,
                'color': colors[key]['color'],
                'opacity_left': OPACITY_DEFAULT,
                'opacity_right': OPACITY_DEFAULT,
                'values': Object.keys(data_json[key]).map((key_2) => (
                    {
                        'lang': key_2,
                        'color': colors[key_2]['color'],
                        'opacity': OPACITY_DEFAULT,
                        'value': data_json[key][key_2]
                    }
                ))
            }
        ));
    });
});



var side_width;
var lang_height;


var hover_index_left = -1;
var hover_index_right = -1;



function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);

    side_width = width * 1 / 5;

    while (data == null);
    
    lang_height = height / Object.keys(data).length;
}

var test = 0;

function draw() {
    background(250);
    updateOpacities();
    render();
}

function updateOpacities() {
    data.forEach((element, index) => {
        element['opacity_left'] = interpolate(element['opacity_left'], hover_index_left == -1 ? OPACITY_DEFAULT : index == hover_index_left ? OPACITY_SHOWN : OPACITY_HIDDEN);
        element['opacity_right'] = interpolate(element['opacity_right'], hover_index_right == -1 ? OPACITY_DEFAULT : index == hover_index_right ? OPACITY_SHOWN : OPACITY_HIDDEN);
        element['values'].forEach(element_2 => {
            opacity = hover_index_left == -1 && hover_index_right == -1 ? OPACITY_DEFAULT : index == hover_index_left || data.indexOf(element_2['lang']) == hover_index_right ? OPACITY_SHOWN : OPACITY_HIDDEN;
            element_2['opacity'] = interpolate(element_2['opacity'],opacity);
        });
    });
}

function render() {
    noStroke();
    data.forEach((element,index) => {
        fill_color = color(element['color']);
        fill_color.setAlpha(255 * element['opacity_left']);
        fill(fill_color);
        rect(0,lang_height * index,side_width,lang_height);
        fill_color.setAlpha(255 * element['opacity_right']);
        fill(fill_color);
        rect(width - side_width,lang_height * index,side_width,lang_height);
    });
}

function interpolate(initial, goal) {
    return initial + (goal - initial) * 0.075;
}


function mouseMoved() {
    hover_index_left = -1;
    hover_index_right = -1;
    if (mouseX < side_width) {
        hover_index_left = int(mouseY / lang_height);
    } else if (mouseX > width - side_width) {
        hover_index_right = int(mouseY / lang_height);
    }
}