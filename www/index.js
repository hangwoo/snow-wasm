import { foo } from 'snow-wasm';

function update() {
  angle += 0.01;
  for (let i = 0; i < mp; i++) {
    const p = particles[i];
    p.y += Math.cos(angle + p.d) - 0.5 + p.r / 1.5;
    p.x += Math.sin(angle) * 1.5;

    if (p.x > W + 5 || p.x < -5 || p.y > H) {
      if (i % 3 > 0) {
        particles[i] = { x: Math.random() * W, y: -10, r: p.r, d: p.d };
      } else {
        // eslint-disable-next-line no-lonely-if
        if (Math.sin(angle) > 0) {
          particles[i] = { x: -5, y: Math.random() * H, r: p.r, d: p.d };
        } else {
          particles[i] = { x: W + 5, y: Math.random() * H, r: p.r, d: p.d };
        }
      }
    }
  }
}

const mp = 250;
const particles = [];
const W = window.innerWidth;
const H = window.innerHeight;
for (let i = 0; i < mp; i++) {
  particles.push({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1,
    d: Math.random() * mp,
  });
}

let angle = 0;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

function draw() {
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.beginPath();
  for (let i = 0; i < mp; i++) {
    const p = particles[i];
    ctx.moveTo(p.x, p.y);
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
  }
  ctx.fill();
  const t0 = performance.now();
  update();
  const t1 = performance.now();
  // console.debug(t1 - t0);
  requestAnimationFrame(draw);
}

canvas.width = W;
canvas.height = H;
// draw();

console.debug('foo', foo(0));
console.debug('foo', foo(1));
