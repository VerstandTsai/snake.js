var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var arrCmp = (a, b) => {
  if (a.length !== b.length) { return false; }
  for (var i=0; i<a.length; i++) {
    if (a[i] !== b[i]) { return false; }
  }
  return true;
};

var arrIncludes = (a, b) => {
  for (var i=0; i<a.length; i++) {
    if (arrCmp(a[i], b)) { return true; }
  }
  return false;
};

var getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

function Game(canvasSize, gridNum) {
  this.canvasSize = canvasSize;
  this.gridNum = gridNum;
  this.gridSize = canvasSize / gridNum;

  this.draw = () => {
    ctx.fillStyle = 'rgb(40, 40, 50)';
    ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
    ctx.fillStyle = 'rgb(200, 40, 0)';
    ctx.fillRect(this.food[0]*this.gridSize, this.food[1]*this.gridSize, this.gridSize, this.gridSize);
    for (var i=0; i<this.snake.length; i++) {
      if (i === 0) { ctx.fillStyle = 'rgb(0, 200, 100)'; }
      else { ctx.fillStyle = 'rgb(200, 200, 200)'; }
      ctx.fillRect(this.snake[i][0]*this.gridSize, this.snake[i][1]*this.gridSize, this.gridSize, this.gridSize);
    }
  };

  this.turn = (keyCode) => {
    switch (keyCode) {
      case 37:
        if (!arrCmp(this.direction, [1, 0])) { this.direction = [-1, 0]; }
        break;
      case 38:
        if (!arrCmp(this.direction, [0, 1])) { this.direction = [0, -1]; }
        break;
      case 39:
        if (!arrCmp(this.direction, [-1, 0])) { this.direction = [1, 0]; }
        break;
      case 40:
        if (!arrCmp(this.direction, [0, -1])) { this.direction = [0, 1]; }
        break;
    }
  };

  this.updateScore = () => {
    this.score++;
    document.getElementById('score').innerHTML = this.score.toString();
  };

  this.placeFood = () => {
    while (arrIncludes(this.snake, this.food)) {
      this.food = [getRandomInt(this.gridNum), getRandomInt(this.gridNum)];
    }
  };

  this.update = () => {
    this.snake.unshift([this.snake[0][0] + this.direction[0], this.snake[0][1] + this.direction[1]]);
    if (arrCmp(this.snake[0], this.food)) {
      this.updateScore();
      this.placeFood();
    }
    else { this.snake.pop(); }
    if (this.snake[0][0] < 0 || this.snake[0][0] >= this.gridNum || this.snake[0][1] < 0 || this.snake[0][1] >= this.gridNum || arrIncludes(this.snake.slice(1), this.snake[0])) {
      clearInterval(this.updater);
      setTimeout(this.init, 800);
      return;
    }
    this.draw();
  };

  this.start = () => {
    document.getElementById('score').innerHTML = this.score.toString();
    document.removeEventListener('keydown', this.start);
    document.addEventListener('keydown', e => { this.turn(e.keyCode); });
    this.updater = setInterval(this.update, 150);
  };

  this.init = () => {
    this.snake = [[5, 7], [4, 7], [3, 7]];
    this.food = [9, 7];
    this.direction = [1, 0];
    this.score = 0;
    ctx.fillStyle = 'rgb(40, 40, 50)';
    ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
    ctx.fillStyle = '#cccccc';
    ctx.font = '30px monospace';
    ctx.fillText('Press any key to start', this.canvasSize / 2 - 190, this.canvasSize / 2);
    document.addEventListener('keydown', this.start);
  }
}

var game = new Game(600, 15);
game.init();
