import Particle from './Particle.js';

export default class ParticleSystem {
    constructor(p, colour) {
        this.p = p;
        this.colour = colour;
        this.particles = [];
        this.count = 0;
        this.particleMinSize = p.width / 48;
        this.particleMaxSize = p.width / 32;
    }

    setColour(colour) {
        this.colour = colour;
    }

    updateParticleMinMaxSize() {
        this.particleMinSize = this.p.width / 32;
        this.particleMaxSize = this.p.width / 20;
    }

    addParticle(loc) {
        this.count++;
        const SPAWN_COUNT = 5; // Assuming SPAWN_COUNT and MAX_PARTICLES are global constants
        const MAX_PARTICLES = 50;

        if (this.particles.length + SPAWN_COUNT < MAX_PARTICLES) {
            for (let i = 0; i < SPAWN_COUNT; i++) {
                this.particles.push(new Particle(this.p, this.colour, loc, this.particleMinSize, this.particleMaxSize));
            }
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let particle = this.particles[i];
            particle.update();
            if (particle.isDead()) {
                this.particles.splice(i, 1);
                this.count--;
            } else {
                particle.display();
            }
        }
    }
}
