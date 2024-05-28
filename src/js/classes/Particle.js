export default class Particle {
    constructor(p, colour, loc2, minSize, maxSize) {
        this.p = p;
        this.colour = colour;
        this.PARTICLE_START_FORCE = 50;
        this.PARTILE_MAX_VEL = 4; ///7;//4;
        this.PARTICLE_MAX_ACC = 10; // Max particle acceleration
        this.SHRINK_RATE = 5;//2;//5;
        this.loc = this.p.createVector(loc2.x, loc2.y);
        this.vel = this.p.createVector(0, 0);
        this.acc = this.p.createVector(0, 0);
        this.size = this.p.random(minSize, maxSize);
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
        // this.colour.update();
        this.p.stroke(255, 255, 255);
        this.p.fill(this.colour.R, this.colour.G, this.colour.B, 63);
        this.p.ellipse(this.loc.x, this.loc.y, this.size, this.size);
        this.colour.update();
        this.colour.update();
        this.p.fill(this.colour.R, this.colour.G, this.colour.B, 127);
        this.p.ellipse(this.loc.x, this.loc.y, this.size / 2, this.size / 2);
        this.colour.update();
        this.p.fill(this.colour.R, this.colour.G, this.colour.B, 193);
        this.p.ellipse(this.loc.x, this.loc.y, this.size / 5, this.size / 4);
    }
  
    isDead() {
        return this.size < 0;
    }
}
