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