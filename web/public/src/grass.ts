export function startGrassAnimation() {
  const canvas = document.getElementById('background-canvas')
  if (!canvas) {
    console.error('Canvas element not found.');
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get 2D context.');
    return;
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resize);
  resize();

  let swayPhase = 0;

  function drawGrassBlades() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;

    const bladeCount = 100;
    for (let i = 0; i < bladeCount; i++) {
      const x = (canvas.width / bladeCount) * i + Math.random() * 5;
      const sway = Math.sin(swayPhase + i * 0.3) * 10;
      const bladeHeight = 50 + Math.random() * 30;

      ctx.beginPath();
      ctx.moveTo(x, canvas.height);
      ctx.lineTo(x + sway, canvas.height - bladeHeight);
      ctx.stroke();
    }
  }

  function animate() {
    swayPhase += 0.05;
    drawGrassBlades();
    requestAnimationFrame(animate);
  }

  animate();
}
