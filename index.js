
var Perspective = [
    [1,0,0,0],
    [0,1,0,0],
    [0,0,1,1],
    [0,0,0,0]
];

function R(axis, dedree) {
    switch (axis) {
        case 'x':
            return [
                [1,0,0,0],
                [0,Math.sin(dedree),Math.cos(dedree),0],
                [0,-Math.cos(dedree),Math.sin(dedree),0],
                [0,0,0,1]
            ];
            break;
        case 'y':
            return [
                [Math.sin( dedree ),0,Math.cos( dedree ),0],
                [0,1,0,0],
                [-Math.cos( dedree ),0,Math.sin( dedree ),0],
                [0,0,0,1]
            ];
            break;
        case 'z':
            return [
                [Math.sin( dedree ),Math.cos( dedree ),0,0],
                [-Math.cos( dedree ),Math.sin( dedree ),0,0],
                [0,0,1,0],
                [0,0,0,1]
            ];
            break;
    }

    return [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1]
    ];
}

function S(kx,ky,kz) {
    return [
        [kx,0,0,0],
        [0,ky,0,0],
        [0,0,kz,0],
        [0,0,0,1]
    ];
}

function T(x,y,z) {
    return [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [x,y,z,1]
    ];
}


function TM(T,M) {
    var newT = [];
    
    for (let j = 0; j < M.length; j++) {
        var newElem = 0;
        const Mj = M[j];
        for (let l = 0; l < Mj.length; l++) {
            const Ml = M[l][j];
            newElem += T[l]*Ml;
        }
        newT[j] = newElem;
    }
        
    return newT;
}

function startGame() {
    GameArea.start();
    GameArea.draw();
}

var GameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
        this.Items = [];
        this.addCube(50,50,50);
        document.getElementById("GameArea").appendChild(this.canvas);
        this.Interval = setInterval(() => {
            this.clear();
            this.draw();
        }, 1000/30);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    draw : function() {
        for (let i = 0; i < this.Items.length; i++) {
            Item = this.Items[i];
            var itemLines = Item.lines;

            for (let j = 0; j < itemLines.length; j++) {
                var line = itemLines[j];

                var p1 = line[0];
                var p2 = line[1];
                p1[3] = 1;
                p2[3] = 1;

                p1 = TM(p1, S(Item.transform.scale[0],Item.transform.scale[1],Item.transform.scale[2]));
                p1 = TM(p1, R('x',Math.PI * Item.transform.rotation[0] / 180));
                p1 = TM(p1, R('y',Math.PI * Item.transform.rotation[1] / 180));
                p1 = TM(p1, R('z',Math.PI * Item.transform.rotation[2] / 180));
                p1 = TM(p1, T(Item.transform.translation[0],Item.transform.translation[1],Item.transform.translation[2]));
                //p1 = TM(p1, Perspective);

                p2 = TM(p2, S(Item.transform.scale[0],Item.transform.scale[1],Item.transform.scale[2]));
                p2 = TM(p2, R('x',Math.PI * Item.transform.rotation[0] / 180));
                p2 = TM(p2, R('y',Math.PI * Item.transform.rotation[1] / 180));
                p2 = TM(p2, R('z',Math.PI * Item.transform.rotation[2] / 180));
                p2 = TM(p2, T(Item.transform.translation[0],Item.transform.translation[1],Item.transform.translation[2]));
                //p2 = TM(p2, Perspective);


                this.context.beginPath();
                this.context.moveTo(p1[0], p1[1]);
                this.context.lineTo(p2[0], p2[1]);
                this.context.stroke();
            }
        }
    },
    addCube(W, H, D) {
        this.Items.push(new Cube(W, H, D));

        document.getElementById("Items").innerHTML = '';

        for (let i = 0; i < this.Items.length; i++) {
            document.getElementById("Items").innerHTML += `
            <div>
            <h1>`+this.Items[i].constructor.name+` `+i+`</h1>
            <details>
                <table>
                    <tr>
                        <th></th>
                        <th>X</th>
                        <th>Y</th>
                        <th>Z</th>
                    </tr>
                    <tr>
                        <th>Translation</th>
                        <td><input type="number" id="i`+i+`tx" oninput="GameArea.changeItem(`+i+`)" value="`+this.Items[i].transform.translation[0]+`"></td>
                        <td><input type="number" id="i`+i+`ty" oninput="GameArea.changeItem(`+i+`)" value="`+this.Items[i].transform.translation[1]+`"></td>
                        <td><input type="number" id="i`+i+`tz" oninput="GameArea.changeItem(`+i+`)" value="`+this.Items[i].transform.translation[2]+`"></td>
                    </tr>
                    <tr>
                        <th>Scale</th>
                        <td><input type="number" id="i`+i+`sx" oninput="GameArea.changeItem(`+i+`)" value="`+this.Items[i].transform.scale[0]+`"></td>
                        <td><input type="number" id="i`+i+`sy" oninput="GameArea.changeItem(`+i+`)" value="`+this.Items[i].transform.scale[1]+`"></td>
                        <td><input type="number" id="i`+i+`sz" oninput="GameArea.changeItem(`+i+`)" value="`+this.Items[i].transform.scale[2]+`"></td>
                    </tr>
                    <tr>
                        <th>Rotation</th>
                        <td><input type="range" min="0" max="360" id="i`+i+`rx" oninput="GameArea.changeItem(`+i+`)" value="`+this.Items[i].transform.rotation[0]+`"><span id="i`+i+`rsx"></span></td>
                        <td><input type="range" min="0" max="360" id="i`+i+`ry" oninput="GameArea.changeItem(`+i+`)" value="`+this.Items[i].transform.rotation[1]+`"><span id="i`+i+`rsy"></span></td>
                        <td><input type="range" min="0" max="360" id="i`+i+`rz" oninput="GameArea.changeItem(`+i+`)" value="`+this.Items[i].transform.rotation[2]+`"><span id="i`+i+`rsz"></span></td>
                    </tr>
                </table>
            </details>
        </div>
            `;
        }

    },
    changeItem(i) {
        var translation = [
            parseFloat(document.getElementById("i"+i+"tx").value),
            parseFloat(document.getElementById("i"+i+"ty").value),
            parseFloat(document.getElementById("i"+i+"tz").value)
        ];

        var scale = [
            parseFloat(document.getElementById("i"+i+"sx").value),
            parseFloat(document.getElementById("i"+i+"sy").value),
            parseFloat(document.getElementById("i"+i+"sz").value)
        ];

        var rotation = [
            parseFloat(document.getElementById("i"+i+"rx").value),
            parseFloat(document.getElementById("i"+i+"ry").value),
            parseFloat(document.getElementById("i"+i+"rz").value)
        ];

        document.getElementById("i"+i+"rsx").innerHTML = rotation[0];
        document.getElementById("i"+i+"rsy").innerHTML = rotation[1];
        document.getElementById("i"+i+"rsz").innerHTML = rotation[2];
        
        this.Items[i].setTranslation(translation);
        this.Items[i].setScale(scale);
        this.Items[i].setRotation(rotation);
    },
}


