export function renderGame(main) {
  main.innerHTML = `
    <div class="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 class="text-4xl font-bold mb-6">Game Screen</h1>
      <canvas id="gameCanvas" width="480" height="270" class="border mb-6"></canvas>
      <div class="flex space-x-4 mb-8">
        <button id="btn-up" class="rounded bg-amber-400 px-4 py-2 text-white">UP</button>
        <button id="btn-down" class="rounded bg-amber-400 px-4 py-2 text-white">DOWN</button>
        <button id="btn-left" class="rounded bg-amber-400 px-4 py-2 text-white">LEFT</button>
        <button id="btn-right" class="rounded bg-amber-400 px-4 py-2 text-white">RIGHT</button>
      </div>
      <a
        href="/"
        data-link
        id="back-btn"
        class="mt-4 py-3 px-8 rounded-full border-1 border-black bg-gradient-to-br from-[#ffcc00] to-[#ea9800] shadow-md hover:scale-105 transition-all text-white text-lg font-semibold"
      >
        Back
      </a>
    </div>
  `;

  // 2. Canvas context setup
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  // 3. Game piece class & instance
  class Component {
    width: number;
    height: number;
    color: string;
    x: number;
    y: number;
    speedX: number = 0;
    speedY: number = 0;
    constructor(width: number, height: number, color: string, x: number, y: number) {
      this.width = width;
      this.height = height;
      this.color = color;
      this.x = x;
      this.y = y;
    }
    update() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    newPos() {
      this.x += this.speedX;
      this.y += this.speedY;
    }
    stop() {
      this.speedX = 0;
      this.speedY = 0;
    }
  }

  let myGamePiece = new Component(30, 30, "#ffcc00", 10, 120);

  // 4. Game update loop
  function updateGameArea() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    myGamePiece.newPos();
    myGamePiece.update();
  }
  let intervalId = setInterval(updateGameArea, 20);

  // 5. Movement functions
  function moveup() { myGamePiece.speedY = -1; }
  function movedown() { myGamePiece.speedY = 1; }
  function moveleft() { myGamePiece.speedX = -1; }
  function moveright() { myGamePiece.speedX = 1; }
  function stopMove() { myGamePiece.stop(); }

  // 6. Attach events to control buttons
  (document.getElementById('btn-up') as HTMLButtonElement).onmousedown = moveup;
  (document.getElementById('btn-down') as HTMLButtonElement).onmousedown = movedown;
  (document.getElementById('btn-left') as HTMLButtonElement).onmousedown = moveleft;
  (document.getElementById('btn-right') as HTMLButtonElement).onmousedown = moveright;

  (document.getElementById('btn-up') as HTMLButtonElement).onmouseup = stopMove;
  (document.getElementById('btn-down') as HTMLButtonElement).onmouseup = stopMove;
  (document.getElementById('btn-left') as HTMLButtonElement).onmouseup = stopMove;
  (document.getElementById('btn-right') as HTMLButtonElement).onmouseup = stopMove;

  // 7. Keyboard mapping for arrow keys
  function keyDownHandler(e: KeyboardEvent) {
    switch (e.key) {
      case "w":
      case "W":
        moveup();
        break;
      case "s":
      case "S":
        movedown();
        break;
      case "a":
      case "A":
        moveleft();
        break;
      case "d":
      case "D":
        moveright();
        break;
    }
  }

  // 8. Attach & clean up keyboard listeners
  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', stopMove);
};
