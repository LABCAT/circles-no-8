export default class Particle {
    constructor(p, colour, loc2) {
        this.p = p;
        this.colour = colour;
        this.START_SIZE = 50;
        this.PARTICLE_START_FORCE = 100;
        this.PARTILE_MAX_VEL = 20; ///7;//4;
        this.PARTICLE_MAX_ACC = 10; // Max particle acceleration
        this.SHRINK_RATE = 1;//2;//5;
        this.loc = this.p.createVector(loc2.x, loc2.y);
        this.vel = this.p.createVector(0, 0);
        this.acc = this.p.createVector(0, 0);
        this.size = this.START_SIZE;
        this.angle = 0;
    }
  
    update() {
        this.angle += this.p.random(0, this.p.TWO_PI);
        let magnitude = this.p.random(0, this.PARTICLE_START_FORCE);
    
        this.acc.x += this.p.cos(this.angle) * magnitude;
        this.acc.y += this.p.sin(this.angle) * magnitude;
    
        this.acc.limit(this.PARTICLE_MAX_ACC);
    
        this.vel.add(this.acc);
        this.vel.limit(this.PARTICLE_MAX_VEL);
    
        this.loc.add(this.vel);
    
        if (this.loc.x > this.p.width)
            this.loc.x -= this.p.width;
        if (this.loc.x < 0)
            this.loc.x += this.p.width;
        if (this.loc.y > this.p.height)
            this.loc.y -= this.p.height;
        if (this.loc.y < 0)
            this.loc.y += this.p.height;
    
        this.size -= this.SHRINK_RATE;
    }
  
    display() {
        this.colour.update();
        this.p.fill(this.colour.R, this.colour.G, this.colour.B);
        this.p.ellipse(this.loc.x, this.loc.y, this.size, this.size);
    }
  
    isDead() {
        return this.size < 0;
    }
}
