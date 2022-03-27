class Cube {
    translation = [100,100,50];
    scale = [1,1,1]; 
    rotation =  [45,45,0];
    constructor(H,W,D) {
        this.height = H;
        this.width = W;
        this.depth = D;
    }

    setTranslation(t) {
        this.translation = t;
    }

    setScale(s) {
        this.scale = s;
    }

    setRotation(r) {
        this.rotation = r;
    }

    get transform() {
        return {translation: this.translation, scale: this.scale, rotation: this.rotation};
    }

    get lines() {
        var H = this.height;
        var W = this.width;
        var D = this.depth;

        return [
            [[0,0,0],[H,0,0]],
            [[0,0,0],[0,W,0]],
            [[0,0,0],[0,0,D]],
            [[H,0,0],[H,W,0]],
            [[H,0,0],[H,0,D]],
            [[0,W,0],[H,W,0]],
            [[0,W,0],[0,W,D]],
            [[0,0,D],[H,0,D]],
            [[0,0,D],[0,W,D]],
            [[H,W,D],[H,W,0]],
            [[H,W,D],[H,0,D]],
            [[H,W,D],[0,W,D]]
        ];
    }
}

class Cylinder {
    translation = [100,100,50];
    scale = [1,1,1]; 
    rotation =  [0,0,0];
    constructor(R, H) {
        this.radius = R;
        this.height = H;
    }

    setTranslation(t) {
        this.translation = t;
    }

    setScale(s) {
        this.scale = s;
    }

    setRotation(r) {
        this.rotation = r;
    }

    get transform() {
        return {translation: this.translation, scale: this.scale, rotation: this.rotation};
    }

    get lines() {
        var R = this.radius;
        var H = this.height

        var lines = [];

        var steps = 10;
        for (let j = 0; j < 360; j+=steps) {
            var x = Math.cos(Math.PI * j / 180)*R;
            var z = Math.sin(Math.PI * j / 180)*R;

            var nx = Math.cos(Math.PI * (j+steps) / 180)*R;
            var nz = Math.sin(Math.PI * (j+steps) / 180)*R;

            lines.push([[x,0,z],[nx,0,nz]])
            lines.push([[x,H,z],[nx,H,nz]])
            lines.push([[x,0,z],[x,H,z]])            
        }
        return lines;
    }
}

class Sphere {
    translation = [100,100,50];
    scale = [1,1,1]; 
    rotation =  [0,0,0];
    constructor(R) {
        this.radius = R;
    }

    setTranslation(t) {
        this.translation = t;
    }

    setScale(s) {
        this.scale = s;
    }

    setRotation(r) {
        this.rotation = r;
    }

    get transform() {
        return {translation: this.translation, scale: this.scale, rotation: this.rotation};
    }

    get lines() {
        var R = Math.PI * this.radius / 180;
        var result = [];

        for (let i = 0; i < 10; i++) {
            
        }

        return result;
    }
}