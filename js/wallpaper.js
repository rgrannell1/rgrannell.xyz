
const CURVE_WAIT = 50;
const STEP_SIZE = 0.1;
const TIME_RANGE = 365 * Math.PI;

function scale(factor, curve) {
  return function(time) {
    const point = curve(time);

    return {
      x: point.x * factor,
      y: point.y * factor
    }
  }
}

function translate(offset, curve) {
  return function(time) {
    const point = curve(time);
    return {
      x: point.x + offset.x,
      y: point.y + offset.y
    }
  }
}

function rose(factor) {
  return function(time) {
    return {
      x: Math.cos(factor * time) * Math.cos(time),
      y: Math.cos(factor * time) * Math.sin(time)
    }
  }
}

function trace(curve) {
  const points = [];

  for (let time = 0; time < TIME_RANGE; time += STEP_SIZE) {
    points.push(curve(time));
  }

  return points;
}

function sleep(ms, signal) {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve();
      return;
    }
    const t = setTimeout(resolve, ms);
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(t);
        resolve();
      }, { once: true });
    }
  });
}

async function animate(ctx, curve, signal) {
  const points = trace(curve);
  if (points.length < 2) return;

  for (let i = 1; i < points.length; i++) {
    if (signal.aborted) return;
    ctx.beginPath();
    ctx.moveTo(points[i - 1].x, points[i - 1].y);
    ctx.lineTo(points[i].x, points[i].y);
    ctx.stroke();
    await sleep(CURVE_WAIT, signal);
  }
}


function syncCanvasToLayout(canvas, ctx) {
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));

  canvas.width = width;
  canvas.height = height;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { width: rect.width, height: rect.height };
}

async function draw(ratio, ctx, signal) {
  const { width, height } = syncCanvasToLayout(ctx.canvas, ctx);

  const curve = translate(
    {x: width / 2, y: height / 2},
    scale(400, rose(ratio)));

  ctx.globalAlpha = 1/18;
  ctx.strokeStyle = '#b29c00';
  ctx.lineWidth = 3;

  await animate(ctx, curve, signal);
}

function main() {
  const canvas = document.getElementById('wallpaper');
  const ctx = canvas.getContext('2d');
  let controller = new AbortController();

  function restartDraw() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width === w && canvas.height === h) return;

    controller.abort();
    controller = new AbortController();
    draw(1 / 1.61803399, ctx, controller.signal);
  }

  let resizeRaf = 0;

  function onResize() {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(restartDraw);
  }

  const ro = new ResizeObserver(onResize);
  ro.observe(canvas);
  onResize();
}

main();
