((d) => {d.body.innerHTML='<div id=app>';
var S$ = x => {s = d.createElement('script');
s.setAttribute('src', 'http://localhost:8091/'+x);
d.body.appendChild(s);};
S$('static/lib/pixi.js');
var B = () => { window.PIXI? S$('dist/build.js') : T()};
var T = () => setTimeout(B, 10);
T();
})(document);