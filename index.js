import Block from './block.js';
import { config } from './config.js';
import Population from './population.js';
import Target from './target.js';

const fitness = document.getElementById('fitness');
const progressBar = document.getElementById('progressBar-bar');
const generationCount = document.getElementById('generationCount');
const reachedTargetCount = document.getElementById('reachedTargetCount');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = config.canvasWidth;
canvas.height = config.canvasHeight;

const target = new Target(config.canvasWidth / 2, config.canvasHeight / 10, 20);
const blocks = [new Block(300, 300, 200, 30)];

const populationSize = 20;
let tick = config.lifespan;
const population = new Population(
  populationSize,
  config.lifespan,
  target,
  ctx,
  blocks
);

function draw() {
  drawBackground();

  tick--;
  if (tick == 0) {
    population.select();
    population.crossover();
    population.mutate();
    tick = config.lifespan;

    updateMetrics();
    population.reachedTargetCount = 0;
  }

  progressBar.style.width = `${(tick / config.lifespan) * 100}%`;
  population.runGeneration();
  drawBlocks();
  drawTarget(population.reachedTargetCount > 0 ? '#3ed12b' : '#ffffff');
}

function drawBackground(color = '#333333') {
  ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
}

function drawTarget(color = '#ffffff') {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(target.position.x, target.position.y, target.size, 0, 2 * Math.PI);
  ctx.fill();
}

function drawBlocks() {
  for (const block of blocks) {
    block.draw(ctx);
  }
}

function updateMetrics() {
  generationCount.innerHTML = `Generation: ${population.generation}`;
  fitness.innerHTML = `Fitness: ${population.bestFintess}`;
  reachedTargetCount.innerHTML = `Rockets reached target: ${population.reachedTargetCount}`;
}

function loop() {
  draw();
  window.requestAnimationFrame(loop);
}

window.onload = () => loop();
