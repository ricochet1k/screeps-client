
const saved = {};

export default function parseColor(color) {
    color = color.trim().toLowerCase();
    let s = saved[color];
    if (s) return s;
    s = _parseColor(color);
    if (!s) s = [255, 255, 255];

    s = s[0] << 16 | s[1] << 8 | s[2];

    saved[color] = s;
    return s;
}

function _parseColor(c) {
    var color = c;
    color = _colorsByName[color] || color;
    var hex3 = color.match(/^#([0-9a-f]{3})$/i);
    if (hex3) {
        hex3 = hex3[1];
        return [
            parseInt(hex3.charAt(0),16)*0x11,
            parseInt(hex3.charAt(1),16)*0x11,
            parseInt(hex3.charAt(2),16)*0x11, 1
        ];
    }
    var hex6 = color.match(/^#([0-9a-f]{6})$/i);
    if (hex6) {
        hex6 = hex6[1];
        return [
            parseInt(hex6.substr(0,2),16),
            parseInt(hex6.substr(2,2),16),
            parseInt(hex6.substr(4,2),16), 1
        ];
    }
    var rgba = color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+.*\d*)\s*\)$/i) || color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if( rgba ) {
        return [rgba[1],rgba[2],rgba[3], rgba[4]===undefined?1:rgba[4]];
    }
    var rgb = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if( rgb ) {
        return [rgb[1],rgb[2],rgb[3],1];
    }
    if(color.indexOf('hsl')== 0)
        return _hslToRgb(color);
}

function _hslToRgb(hsl){
    if(typeof hsl== 'string'){
        hsl= hsl.match(/(\d+(\.\d+)?)/g);
    }
    var sub, h= hsl[0]/360, s= hsl[1]/100, l= hsl[2]/100, a = hsl[3]===undefined?1:hsl[3], t1, t2, t3, rgb, val;
    if(s== 0){
        val= Math.round(l*255);
        rgb= [val, val, val, a];
    }
    else{
        if(l<0.5)
            t2= l*(1 + s);
        else
            t2= l + s - l*s;
        t1 = 2*l - t2;
        rgb = [0, 0, 0];
        for(var i=0; i<3; i++){
            t3 = h + 1/3 * -(i - 1);
            t3 < 0 && t3++;
            t3 > 1 && t3--;
            if (6 * t3 < 1)
                val= t1 + (t2 - t1) * 6 * t3;
            else if (2 * t3 < 1)
                val= t2;
            else if (3*t3<2)
                val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
            else
                val= t1;
            rgb[i] = Math.round(val*255);
        }
    }
    rgb.push(a);
    return rgb;
}
var _colorsByName = {aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",
    black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",
    chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",
    darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",
    darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",
    darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",
    deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",
    fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",
    greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred :"#cd5c5c",indigo :"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",
    lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",
    lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",
    lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",
    limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",
    mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",
    mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",
    navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",
    orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",
    peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",
    royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",
    silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",
    tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",
    whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"
};