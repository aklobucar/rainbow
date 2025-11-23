// Neon Iris Gate v2 — Detailed Mechanical Aperture
// by Tristan
// Interlocking neon rings that open/close with depth and motion

let particles = [];
let t = 0;

function setup() {
  createCanvas(1200, 600);
  colorMode(HSB);
  angleMode(DEGREES);
  noStroke();

  // starfield / depth particles
  for (let i = 0; i < 400; i++) {
    particles.push({
      x: random(-width, width),
      y: random(-height, height),
      z: random(width),
      hue: random([190, 260, 315])
    });
  }
}

function draw() {
  background(0, 0.08);
  translate(width / 2, height / 2);

  let speed = 25;

  // ✨ background star particles (depth)
  for (let p of particles) {
    p.z -= speed;
    if (p.z < 1) {
      p.z = width;
      p.x = random(-width, width);
      p.y = random(-height, height);
    }
    let sx = map(p.x / p.z, 0, 1, 0, width);
    let sy = map(p.y / p.z, 0, 1, 0, height);
    let size = map(p.z, 0, width, 5, 0);
    fill(p.hue, 100, 100, 0.7);
    ellipse(sx - width / 2, sy - height / 2, size);
  }

  //  Iris parameters
  let openAmount = sin(frameCount * 2) * 0.5 + 0.5; // aperture
  let blades = 16;
  let baseRadius = 300;
  let innerRadius = 60 + openAmount * 120;
  let ringHue = (frameCount * 2) % 360;

  push();
  rotate(frameCount * 0.3);

  //  Outer rotating segmented ring (slow)
  noFill();
  strokeWeight(4);
  for (let r = baseRadius; r < baseRadius + 60; r += 20) {
    let rotOffset = sin(t * 100 + r) * 10;
    stroke((ringHue + r * 0.4) % 360, 100, 100, 0.6);
    beginShape();
    for (let a = 0; a < 360; a += 10) {
      let x = (r + sin(a * 3 + frameCount * 0.5) * 5) * cos(a + rotOffset);
      let y = (r + sin(a * 3 + frameCount * 0.5) * 5) * sin(a + rotOffset);
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  // Mechanical iris blades
  for (let i = 0; i < blades; i++) {
    let startAngle = i * (360 / blades);
    let endAngle = startAngle + (360 / blades) * 0.6;
    let shift = sin(frameCount * 2 + i * 20) * 10;
    let hue = (ringHue + i * 20) % 360;
    fill(hue, 100, 100, 0.7);
    arc(0, 0, baseRadius * 2 + shift, baseRadius * 2 + shift, startAngle, endAngle, PIE);
  }

  // Inner rotating energy rings (parallax illusion)
  strokeWeight(3);
  noFill();
  for (let i = 0; i < 3; i++) {
    let r = innerRadius + i * 40 + sin(frameCount * 3 + i * 60) * 10;
    let hue = (ringHue + i * 60) % 360;
    stroke(hue, 100, 100, 0.5);
    rotate(sin(frameCount * 0.5 + i * 30) * 2);
    ellipse(0, 0, r * 2);
  }

  //  Shading & depth (gives 3D illusion)
  noStroke();
  for (let i = 0; i < 10; i++) {
    let fade = map(i, 0, 10, 0.6, 0);
    fill((ringHue + i * 10) % 360, 90, 100, fade * 0.4);
    ellipse(0, 0, (innerRadius + i * 15) * 2);
  }

  //  Central void (energy hole)
  fill(0, 0, 0, 1);
  ellipse(0, 0, innerRadius * 1.6);

  //  Energy flare and glow
  blendMode(ADD);
  for (let i = 0; i < 5; i++) {
    fill((ringHue + i * 50) % 360, 90, 100, 0.08);
    ellipse(0, 0, baseRadius * 2.5 + i * 60 + sin(t * 8) * 20);
  }
  blendMode(BLEND);
  pop();

  t += 0.01;
}
