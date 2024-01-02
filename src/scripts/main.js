'use strict';
/* eslint-disable */
// #region globalVars
const gameTable = document.getElementById('game-table');
const tableRows = gameTable.getElementsByTagName('tr');
const start = document.getElementById('start');
const messageStart = document.getElementById('message-start');
const messageWin = document.getElementById('message-win');
const messageLose = document.getElementById('message-lose');
const gameScore = document.getElementById('game-score');
// #endregion

// #region game

class Game {
  constructor() {
    this.size = 4;
    this.chipsArray = [];
    this.status = false;
    this.score = 0;
    this.win = false;
    this.gameOver = false;
  }

  startGame() {
    this.status = true;
    this.chipsArray = [];
    this.score = 0;
    this.win = false;
    this.gameOver = false;

    for (let i = 0; i < this.size; i++) {
      const row = [];
      for (let j = 0; j < this.size; j++) {
        row.push( new Chip(0));
      }
      this.chipsArray.push(row);
    }

    for (let i = 0; i < 2; i++) {
      this.addChip(new Chip(gen2or4()));
    }
  }

  addChip(chip) {
    const freeSpaces = findFreeSpaces(this.chipsArray);

    if (freeSpaces.length) {
      const { x, y } = genRandomPosition(freeSpaces);

      this.chipsArray[y][x] = chip;
    } else {
      console.log('no free space');
    }
  }

  restart() {
    this.startGame();
  }

  moveLeft() {
    const chips = this.chipsArray;
    let isMove = false;

    for (let i = 0; i < chips.length; i++) {
      for (let j = 1; j < chips.length; j++) {
        const current = chips[i][j];

        if (current.value !== 0) {
          let targetCellIndex = j - calcTargetCellIndex(j, chips[i], 'left');
          const moved = this.moveTiles(current, chips[i][targetCellIndex]);

          if (moved === true && isMove === false) {
            isMove = true;
          }
        }
      }
    }

    if (isMove === true) {
      this.addChip(new Chip(gen2or4()));
    } else {
      this.isGameOver();
    }

    this.resetTiles();
  };

  moveUp() {
    const chips = this.chipsArray;
    let isMove = false;

    for (let i = 1; i < chips.length; i++) {
      for (let j = 0; j < chips.length; j++) {
        const current = chips[i][j];

        if (current.value !== 0) {
          let targetCellIndex = i - calcTargetCellIndex({y: i, x: j}, chips, 'up');
          const moved = this.moveTiles(current, chips[targetCellIndex][j]);

          if (moved === true && isMove === false) {
            isMove = true;
          }
        }
      }
    }

    if (isMove === true) {
      this.addChip(new Chip(gen2or4()));
    } else {
      this.isGameOver();
    }

    this.resetTiles();
  };

  moveDown() {
    const chips = this.chipsArray;
    let isMove = false;

    for (let i = this.size - 2; i >= 0; i--) {
      for (let j = 0; j < chips.length; j++) {
        const current = chips[i][j];

        if (current.value !== 0) {
          let targetCellIndex = i + calcTargetCellIndex({y: i, x: j}, chips, 'down');
          const moved = this.moveTiles(current, chips[targetCellIndex][j]);

          if (moved === true && isMove === false) {
            isMove = true;
          }
        }
      }
    }

    if (isMove === true) {
      this.addChip(new Chip(gen2or4()));
    } else {
      this.isGameOver();
    }

    this.resetTiles();
  };

  moveRight() {
    const chips = this.chipsArray;
    let isMove = false;

    for (let i = 0; i < this.size; i++) {
      for (let j = this.size - 2; j >= 0; j--) {
        const current = chips[i][j];

        if (current.value !== 0) {
          let targetCellIndex = j + calcTargetCellIndex(j, chips[i], 'right');
          const moved = this.moveTiles(current, chips[i][targetCellIndex]);

          if (moved === true && isMove === false) {
            isMove = true;
          }
        }
      }
    }

    if (isMove === true) {
      this.addChip(new Chip(gen2or4()));
    } else {
      this.isGameOver();
    }

    this.resetTiles();
  };

  moveTiles(currentTile, nextTile) {
    if (currentTile !== nextTile) {
      const res = nextTile.merge(currentTile);
      game.score += res;

      if (res === 2048) {
        this.win = true;
      }

      return true;
    }

    return false;
  };

  isGameOver() {
    let over = true;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const currentTile = this.chipsArray[i][j];

        const closestTiles = Game.getClosestTiles(i, j, this.chipsArray);
        over = closestTiles.every(
          tile => tile.value !== currentTile.value
          );
        if (over === false) {
          this.gameOver = false;

          return over;
        }
      }
    }

    this.gameOver = true;
    return true;
  }

  resetTiles() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.chipsArray[i][j].resetMerge();
      }
    }
  }

  static getClosestTiles(i, j, arr) {
    const res = [];

    if (j > 0) {
      res.push(arr[i][j - 1]);
    }

    if (j < arr[0].length - 1) {
      res.push(arr[i][j + 1]);
    }

    if (i > 0) {
      res.push(arr[i - 1][j]);
    }

    if (i < arr.length - 1) {
      res.push(arr[i + 1][j]);
    }

    return res;
  }
}

class Chip {
  constructor(num) {
    this.value = num;
    this.ableToUnion = true;
  }

  merge(chip) {
    let res = 0;

    if (this.value === 0 || this.value === chip.value) {
      if (this.value > 0 && chip.value > 0) {
        res += this.value + chip.value;
        this.ableToUnion = false;
      }

      this.value += chip.value;

      chip.value = 0;
    }

    return res;
  }

  resetMerge() {
    this.ableToUnion = true;
  }
}
// #endregion

const game = new Game();

// #region pageFunc
start.addEventListener('click', () => {
  if (game.status === false) {
    startGame();
    syncWithTable();

    messageStart.classList.add('hidden');

    start.classList.remove('start');
    start.classList.add('restart');
    start.innerText = 'restart';
  } else {
    clearTable();
    restartGame();
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
});

document.addEventListener('keydown', (event) => {
  if (game.status === true) {
    switch (event.key) {
      case 'ArrowUp':
        game.moveUp();
        syncWithTable();
        break;
      case 'ArrowDown':
        game.moveDown();
        syncWithTable();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        syncWithTable();
        break;
      case 'ArrowRight':
        game.moveRight();
        syncWithTable();
        break;
      default:
    }
  }
});

function syncWithTable() {
  const chips = game.chipsArray;

  for (let i = 0; i < chips.length; i++) {
    for (let j = 0; j < chips[i].length; j++) {
      const cell = tableRows[i].children[j];
      const chip = chips[i][j];
      const prevChipValue = cell.innerText;
      const merge = prevChipValue * 2 === chip.value ? 'merged ' : '';

      if (chip.value !== 0) {
        cell.innerHTML = chip.value;
        cell.className = `field-cell ${merge}field-cell--${chip.value}`;
      } else {
        cell.innerHTML = '';
        cell.className = 'field-cell';
      }
    }
  }

  gameScore.innerText = game.score;

  if (game.win) {
    messageWin.classList.remove('hidden');
  }

  if (game.gameOver) {
    messageLose.classList.remove('hidden');
  }
}

function clearTable() {
  for (let i = 0; i < tableRows.length; i++) {
    for (let j = 0; j < tableRows.length; j++) {
      const cell = tableRows[i].children[j];

      cell.innerHTML = '';
      cell.className = 'field-cell';
    }
  }
}

function startGame() {
  game.startGame();
}

function restartGame() {
  game.restart();
  syncWithTable();
}

// #endregion

// #region heplFunc
function gen2or4(zero) {
  const numsArr = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];

  if (zero === 0) {return 0}

  return numsArr[Math.floor(Math.random() * 10)];
}

function findFreeSpaces(arr) {
  const freeSpacesArr = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      const freeCell = {
        x: null, y: null,
      };

      if (arr[i][j].value === 0) {
        freeCell.x = j;
        freeCell.y = i;

        freeSpacesArr.push(freeCell);
      }
    }
  }

  return freeSpacesArr;
}

function genRandomPosition(positionsArr) {
  const min = 0;
  const max = positionsArr.length;

  const randPos = Math.floor(Math.random() * (max - min) + min);

  return positionsArr[randPos];
}

/* function calcFreeCount(currenIndex, targetArray) {
  let result = 0;

  for (let i = currenIndex - 1; i >= 0; i--) {
    if (targetArray[i] === 0) {
      result++;
    } else {
      return result;
    }
  }

  return result;
} */

function calcTargetCellIndex(currIndex, array, direction) {
  let res = 0;

  if (direction === 'left') {
    for (let i = currIndex - 1; i >= 0; i--) {
      if (array[i].value === 0) {
        res++;
      } else {
        if (array[i].value === array[currIndex].value && array[i].ableToUnion) {
          res++;
        } else {
        return res;
        }
      }
    }
  }

  if (direction === 'up') {
    const {y, x} = currIndex;

    for (let i = y - 1; i >= 0; i--) {
      if (array[i][x].value === 0) {
        res++;
      } else {
        if (array[i][x].value === array[y][x].value && array[i][x].ableToUnion) {
          res++;
        } else {
        return res;
        }
      }
    }
  }
  if (direction === 'down') {
    const {y, x} = currIndex;

    for (let i = y + 1; i < array.length; i++) {
      if (array[i][x].value === 0) {
        res++;
      } else {
        if (array[i][x].value === array[y][x].value && array[i][x].ableToUnion) {
          res++;
        } else {
        return res;
        }
      }
    }
  }

  if (direction === 'right') {
    for (let i = currIndex + 1; i < array.length; i++) {
      if (array[i].value === 0) {
        res++;
      } else {
        if (array[i].value === array[currIndex].value && array[i].ableToUnion) {
          res++;
        } else {
        return res;
        }
      }
    }
  }


  return res;
}

// #endregion
