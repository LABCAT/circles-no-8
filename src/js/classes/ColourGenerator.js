export default class ColourGenerator {
    constructor(p) {
        this.p = p;
        this.MIN_SPEED = 0.2;
        this.MAX_SPEED = 0.7;
        this.R = 0;
        this.G = 0;
        this.B = 0;
        this.Rspeed = 0;
        this.Gspeed = 0;
        this.Bspeed = 0;
        this.init();
    }
  
    init() {
        // Starting colour
        this.R = this.p.random(255);
        this.G = this.p.random(255);
        this.B = this.p.random(255);
    
        // Starting transition speed
        this.Rspeed = (this.p.random(1) > 0.5 ? 1 : -1) * this.p.random(this.MIN_SPEED, this.MAX_SPEED);
        this.Gspeed = (this.p.random(1) > 0.5 ? 1 : -1) * this.p.random(this.MIN_SPEED, this.MAX_SPEED);
        this.Bspeed = (this.p.random(1) > 0.5 ? 1 : -1) * this.p.random(this.MIN_SPEED, this.MAX_SPEED);
    }
  
    update() {
        // Use transition to alter original colour (Keep within RGB bounds)
        this.Rspeed = ((this.R += this.Rspeed) > 255 || (this.R < 0)) ? -this.Rspeed : this.Rspeed;
        this.Gspeed = ((this.G += this.Gspeed) > 255 || (this.G < 0)) ? -this.Gspeed : this.Gspeed;
        this.Bspeed = ((this.B += this.Bspeed) > 255 || (this.B < 0)) ? -this.Bspeed : this.Bspeed;
    }
}
