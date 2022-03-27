/// <reference path="../node_modules/@types/p5/global.d.ts" />

var data = null;
var opacities = null;
var colors = null;
var raw_data = null;

const OPACITY_DEFAULT = 0.8;
const OPACITY_HIDDEN = 0.3;
const OPACITY_SHOWN = 0.9;


var side_width;
var lang_height;


var hover_index_left = -1;
var hover_index_right = -1;


function preload() {
    colors = loadJSON('colors.json');
    raw_data = loadJSON('results.json');
}

function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);

    data = Object.keys(raw_data).map((key) => (
        {
            'lang': key,
            'color': colors[key].color,
            'opacity_left': OPACITY_DEFAULT,
            'opacity_right': OPACITY_DEFAULT,
            'values': Object.keys(raw_data[key]).map((key_2) => (
                {
                    'lang': key_2,
                    'color': colors[key_2].color,
                    'opacity': OPACITY_DEFAULT,
                    'value': raw_data[key][key_2]
                }
            ))
        }
    ));

    side_width = width * 1 / 5;
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
        element.opacities_left = interpolate(element.opacity_left, hover_index_left == -1 ? OPACITY_DEFAULT : index == hover_index_left ? OPACITY_SHOWN : OPACITY_HIDDEN);
        element.opacities_right = interpolate(element.opacity_right, hover_index_right == -1 ? OPACITY_DEFAULT : index == hover_index_right ? OPACITY_SHOWN : OPACITY_HIDDEN);
        element.values.forEach(element_2 => {
            opacity = hover_index_left == -1 && hover_index_right == -1 ? OPACITY_DEFAULT * element_2.value : index == hover_index_left || findLanguageIndex(element_2.lang) == hover_index_right ? OPACITY_SHOWN : 0;
            element_2.opacity = interpolate(element_2.opacity, opacity);
        });
    });
}

function render() {
    noStroke();
    data.forEach((element, index) => {
        noStroke();

        // Render the Squares
        var fill_color = color(element.color);
        fill_color.setAlpha(255 * element.opacity_left);
        fill(fill_color);
        rect(0, lang_height * index, side_width, lang_height);
        fill_color.setAlpha(255 * element.opacity_right);
        fill(fill_color);
        rect(width - side_width, lang_height * index, side_width, lang_height);

        // Render the Text
        stroke('white');
        fill('black');
        text(element.lang, side_width * 0.1, (index + 1) * lang_height - lang_height * 0.2);
        textSize(15);
        textStyle(BOLD);
        text(element.lang, width - side_width * 0.4, (index + 1) * lang_height - lang_height * 0.2);
        noStroke();



        // Render the connectors
        element.values.forEach((element_2) => {
            const half_height = lang_height * element_2.value / 2;
            const goal_index = findLanguageIndex(element_2.lang);
            const left_height = lang_height * index + lang_height / 2;
            const right_height = lang_height * goal_index + lang_height / 2;

            fill_color.setAlpha(255 * element_2.opacity);
            fill(fill_color);
            quad(side_width, left_height - half_height, side_width, left_height + half_height, width - side_width, right_height + half_height, width - side_width, right_height - half_height);


            noStroke();
        });

    });

    // render the text
    data.forEach((element, index) => {
        if (index == hover_index_left) {
            element.values.forEach((element_2) => {
                stroke('white');
                fill('black');
                textSize(15);
                textStyle(BOLD);
                text(new String(element_2.value).substring(0,4) + "%", width - side_width * 0.9, (findLanguageIndex(element_2.lang) + 1) * lang_height - lang_height * 0.2)
            });
        } else if(hover_index_right != -1) {
            data[hover_index_right].values.forEach((element_2) => {
                if(element_2.lang == element.lang) {
                    stroke('white');
                    fill('black');
                    textSize(15);
                    textStyle(BOLD);
                    text(new String(element_2.value).substring(0,4) + "%",side_width * 0.6, (index + 1) * lang_height - lang_height * 0.2);
                }
            })
        }
    });
}

function findLanguageIndex(language) {
    for (var i = 0; i < data.length; i++) {
        if (data[i]['lang'] == language) {
            return i;
        }
    }
    return -1;
}

function interpolate(initial, goal) {
    return initial + (goal - initial) * 0.075;
}


function mouseMoved() {
    hover_index_left = -1;
    hover_index_right = -1;
    if (mouseX < side_width) {
        hover_index_left = int(mouseY / lang_height);
        if(hover_index_left >= data.length) {
            hover_index_left = -1;
        }
    } else if (mouseX > width - side_width) {
        hover_index_right = int(mouseY / lang_height);
        if(hover_index_right >= data.length) {
            hover_index_right = -1;
        }
    }
}