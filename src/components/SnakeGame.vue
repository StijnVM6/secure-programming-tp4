<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

interface Position {
  x: number;
  y: number;
}

const snake = ref<Position[]>([{ x: 10, y: 10 }]);
const food = ref<Position>({ x: 5, y: 5 });
const direction = ref<string>('right');
const gameOver = ref<boolean>(false);
const score = ref<number>(0);
const gameLoop = ref<number | null>(null);

const generateFood = () => {
  const x = Math.floor(Math.random() * GRID_SIZE);
  const y = Math.floor(Math.random() * GRID_SIZE);
  food.value = { x, y };
};

const moveSnake = () => {
  if (gameOver.value) return;

  const head = { ...snake.value[0] };
  
  switch (direction.value) {
    case 'up': head.y--; break;
    case 'down': head.y++; break;
    case 'left': head.x--; break;
    case 'right': head.x++; break;
  }

  // Check collision with walls
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    gameOver.value = true;
    return;
  }

  // Check collision with self
  if (snake.value.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver.value = true;
    return;
  }

  snake.value.unshift(head);

  // Check if snake ate food
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10;
    generateFood();
  } else {
    snake.value.pop();
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  const key = e.key.toLowerCase();
  
  if (gameOver.value) {
    if (key === 'r') restartGame();
    return;
  }

  switch (key) {
    case 'arrowup':
    case 'w':
      if (direction.value !== 'down') direction.value = 'up';
      break;
    case 'arrowdown':
    case 's':
      if (direction.value !== 'up') direction.value = 'down';
      break;
    case 'arrowleft':
    case 'a':
      if (direction.value !== 'right') direction.value = 'left';
      break;
    case 'arrowright':
    case 'd':
      if (direction.value !== 'left') direction.value = 'right';
      break;
  }
};

const restartGame = () => {
  snake.value = [{ x: 10, y: 10 }];
  direction.value = 'right';
  gameOver.value = false;
  score.value = 0;
  generateFood();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  gameLoop.value = setInterval(moveSnake, INITIAL_SPEED);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  if (gameLoop.value) clearInterval(gameLoop.value);
});
</script>

<template>
  <div class="game-container">
    <div class="game-screen">
      <div class="game-header">
        <div class="score">SCORE: {{ score }}</div>
      </div>
      <div class="game-board" :style="{ 
        width: GRID_SIZE * CELL_SIZE + 'px', 
        height: GRID_SIZE * CELL_SIZE + 'px' 
      }">
        <div 
          v-for="segment in snake" 
          :key="`${segment.x}-${segment.y}`"
          class="snake-segment"
          :style="{ 
            left: segment.x * CELL_SIZE + 'px',
            top: segment.y * CELL_SIZE + 'px',
            width: CELL_SIZE + 'px',
            height: CELL_SIZE + 'px'
          }"
        ></div>
        <div 
          class="food"
          :style="{ 
            left: food.x * CELL_SIZE + 'px',
            top: food.y * CELL_SIZE + 'px',
            width: CELL_SIZE + 'px',
            height: CELL_SIZE + 'px'
          }"
        ></div>
      </div>
      <div v-if="gameOver" class="game-over">
        <h2>GAME OVER</h2>
        <p>Press R to restart</p>
      </div>
      <div class="controls">
        <p>Use arrow keys or WASD to move</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  font-family: 'Courier New', Courier, monospace;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.game-screen {
  background-color: #9ba657;
  border: 10px solid #464646;
  border-radius: 10px;
  padding: 20px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
}

.game-header {
  margin-bottom: 20px;
  text-align: center;
}

.score {
  font-size: 24px;
  font-weight: bold;
  color: #2d2d2d;
  text-shadow: 2px 2px #c3c3c3;
}

.game-board {
  position: relative;
  background-color: #aab668;
  border: 4px solid #464646;
  margin: 0 auto;
}

.snake-segment {
  position: absolute;
  background-color: #2d2d2d;
  border: 2px solid #1a1a1a;
  box-sizing: border-box;
}

.food {
  position: absolute;
  background-color: #cc0000;
  border: 2px solid #8b0000;
  border-radius: 50%;
  box-sizing: border-box;
}

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 20px;
  border-radius: 10px;
}

.controls {
  margin-top: 20px;
  text-align: center;
  color: #2d2d2d;
  font-size: 14px;
}

@media (prefers-color-scheme: dark) {
  .game-screen {
    background-color: #9ba657;
  }
  
  .score {
    color: #2d2d2d;
  }
  
  .controls {
    color: #2d2d2d;
  }
}
</style>