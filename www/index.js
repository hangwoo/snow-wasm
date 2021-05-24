import { SnowCanvas } from 'snow-wasm';

const count = 10000;
const W = window.innerWidth / 2;
const H = window.innerHeight;

function jsSnow() {
  const pfDom = document.getElementById('performance1');
  const canvas1 = document.getElementById('canvas2');
  const ctx = canvas1.getContext("2d");

  function update() {
    angle += 0.01;
    for (let i = 0; i < count; i++) {
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

  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random(),
      d: Math.random() * count,
    });
  }

  let angle = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
    }
    ctx.fill();
    performanceChecker(update, pfDom);
    requestAnimationFrame(draw);
  }

  canvas1.width = W;
  canvas1.height = H;

  draw();
}

function wasmSnow() {
  const pfDom = document.getElementById('performance2');
  const snowCanvas = SnowCanvas.new(W, H, count);
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext("2d");

  canvas.width = W;
  canvas.height = H;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      ctx.moveTo(snowCanvas.get_particle_x(i), snowCanvas.get_particle_y(i));
      ctx.arc(snowCanvas.get_particle_x(i), snowCanvas.get_particle_y(i), snowCanvas.get_particle_r(i), 0, Math.PI * 2, true);
    }
    ctx.fill();
    performanceChecker(() => snowCanvas.update(), pfDom);
    requestAnimationFrame(draw);
  }

  draw();
}

function performanceChecker(cb, pfDom) {
  const t0 = performance.now();
  cb();
  const t1 = performance.now();
  const pf = t1 - t0;
  pfDom.textContent = pf.toString();
  pfDom.style.width = `${pf * 500}px`;
}


jsSnow();
wasmSnow();