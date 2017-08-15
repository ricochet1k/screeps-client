import {SQUARE_SIZE, TWEEN_DURATION, S} from './const';
import {tween, tweenRotation, interp} from './tween';

export function actionLine(room, action, from, to, color = 0xffff00) {
  let g = new PIXI.Graphics();
  room.g.addChild(g);

  const fx = (from.x + 0.5) * SQUARE_SIZE;
  const fy = (from.y + 0.5) * SQUARE_SIZE;
  const tx = (to.x + 0.5) * SQUARE_SIZE;
  const ty = (to.y + 0.5) * SQUARE_SIZE;

  // console.log('actionLine', fx, fy, tx, ty);

  tween(TWEEN_DURATION, {}, v => {
    if (v === 1) {
      room.g.removeChild(g);
      return;
    }

    g.clear();
    g.lineStyle(3, color, 1);

    if (v < 0.5) {
      v = v * 2;
      g.moveTo(fx, fy);
      g.lineTo(interp(fx, tx, v), interp(fy, ty, v));
    } else {
      v = (v - 0.5) * 2;
      g.moveTo(fx + (tx-fx)*v, fy + (ty-fy)*v);
      g.lineTo(tx, ty);
    }
  });
}

export function bump(g, gRot, obj, a) {
  let {x, y} = obj;
  tweenRotation(TWEEN_DURATION/2, gRot, obj, a);
  tween(TWEEN_DURATION, g, v => {
    if (v < 0.5) {
      v = v;
    } else {
      v = (1 - v);
    }
    g.x = SQUARE_SIZE * interp(x, a.x, v);
    g.y = SQUARE_SIZE * interp(y, a.y, v);
  });
}

export function flash(container, color = 0xffff00) {
  let g = new PIXI.Graphics();
  g.position.set(S(5), S(5));
  g.pivot.set(S(5), S(5));
  container.addChild(g);

  g.clear();
  g.beginFill(color);
  g.drawCircle(S(5), S(5), S(5));
  g.endFill();

  tween(TWEEN_DURATION, {}, v => {
    if (v === 1) {
      container.removeChild(g);
      return;
    }

    if (v < 0.5) {
      v = v;
    } else {
      v = (1 - v);
    }

    g.alpha = v;
  });
}

let fontSize = S(8);

export function say(container, text) {
  const textBubbleStyle = {
    fontSize: fontSize,
  };

  var text = new PIXI.Text(text, textBubbleStyle);

  var bubble = new PIXI.Graphics();
  bubble.beginFill(0xFFFFFF, 1);
  bubble.drawRoundedRect(0, 0, text.width, text.height, 3);
  bubble.endFill();

  bubble.position.set(S(5) - (text.width / 2), -fontSize);
  text.position.set(S(5) - (text.width / 2), -fontSize);

  container.addChild(bubble);
  container.addChild(text);

  tween(TWEEN_DURATION * 2, {}, v => {
    if (v === 1) {
      container.removeChild(text);
      container.removeChild(bubble);
      return;
    }
  });
}
