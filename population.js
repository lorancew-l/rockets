import { config } from './config.js';
import Rocket from './rocket.js';
import { randomVector2D, getRandomInt } from './vector.js';

export default class Population {
  constructor(size, lifespan, target, ctx, blocks) {
    this.size = size;
    this.dnaSize = lifespan;
    this.newGenerationDna = [];
    this.rockets = [];

    this.target = target;
    this.blocks = blocks;
    this.ctx = ctx;

    this.generation = 1;
    this.bestFintess = 0;
    this.reachedTargetCount = 0;

    this.createRockets();
  }

  createRockets() {
    for (let index = 0; index < this.size; index++) {
      this.rockets.push(
        new Rocket(
          constructDna(this.dnaSize),
          this.target,
          this.blocks,
          () => (this.reachedTargetCount += 1)
        )
      );
    }
  }

  select() {
    this.calcBestFintess();
    this.generation++;

    this.matingPool = [];

    for (let index = 0; index < this.size; index++) {
      const firstRocket = this.rockets[getRandomInt(this.size)];
      const secondRocket = this.rockets[getRandomInt(this.size)];

      const winnerGenom =
        firstRocket.fitness > secondRocket.fitness
          ? firstRocket.dna
          : secondRocket.dna;

      this.matingPool.push(winnerGenom);
    }
  }

  crossover() {
    for (let index = 0; index < this.size; index++) {
      const firstGene = this.matingPool[getRandomInt(this.matingPool.length)];
      const secondGene = this.matingPool[getRandomInt(this.matingPool.length)];

      this.newGenerationDna.push(crossover(firstGene, secondGene));
    }
  }

  mutate() {
    for (let index = 0; index < this.size; index++) {
      this.rockets[index] = new Rocket(
        mutate(this.newGenerationDna[index]),
        this.target,
        this.blocks,
        () => (this.reachedTargetCount += 1)
      );
    }

    this.newGenerationDna = [];
  }

  calcBestFintess() {
    this.bestFintess = 0;
    for (const rocket of this.rockets) {
      if (rocket.fitness > this.bestFintess) this.bestFintess = rocket.fitness;
    }
  }

  runGeneration() {
    for (const rocket of this.rockets) {
      rocket.update();
      rocket.draw(this.ctx);
    }
  }
}

export function constructDna(dnaSize) {
  const dna = [];

  for (let index = 0; index < dnaSize; index++) {
    dna.push(randomVector2D());
  }

  return dna;
}

export function crossover(firstPartner, secondPartner) {
  const crossoverPoint = getRandomInt(firstPartner.length);

  return [
    ...firstPartner.slice(0, crossoverPoint),
    ...secondPartner.slice(crossoverPoint),
  ];
}

export function mutate(dna) {
  const newDna = [];
  for (const gene of dna) {
    const chance = Math.random();

    let newGene;
    if (chance < config.muationChance) {
      newGene = randomVector2D();
    } else {
      newGene = gene;
    }

    newDna.push(newGene);
  }

  return newDna;
}
