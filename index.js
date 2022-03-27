var Perspective = [
    [1,0,0,0],
    [0,1,0,0],
    [0,0,1,0],
    [0,0,0,0]
];


function P() {
    return [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,1/90],
        [0,0,0,0]
    ]
}


/**
 * Returns a 4x4 Rotation-Matrix
 * @param {string} axis x,y or z
 * @param {number} dedree 
 * @returns 4x4 Matrix
 */
function R(axis, dedree) {
    switch (axis) {
        case 'x':
            return [
                [1,0,0,0],
                [0,Math.cos(dedree),Math.sin(dedree),0],
                [0,-Math.sin(dedree),Math.cos(dedree),0],
                [0,0,0,1]
            ];
            break;
        case 'y':
            return [
                [Math.cos( dedree ),0,Math.sin( dedree ),0],
                [0,1,0,0],
                [-Math.sin( dedree ),0,Math.cos( dedree ),0],
                [0,0,0,1]
            ];
            break;
        case 'z':
            return [
                [Math.cos( dedree ),Math.sin( dedree ),0,0],
                [-Math.sin( dedree ),Math.cos( dedree ),0,0],
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


/**
 * Returns a 4x4 Scale-Matrix
 * @param {number} kx Scale in x-Axis
 * @param {number} ky Scale in y-Axis
 * @param {number} kz Scale in z-Axis
 * @returns 4x4 Matrix
 */
function S(kx,ky,kz) {
    return [
        [kx,0,0,0],
        [0,ky,0,0],
        [0,0,kz,0],
        [0,0,0,1]
    ];
}


/**
 * Returns a 4x4 Translation-Matrix
 * @param {number} x Translation in x-Axis
 * @param {number} y Translation in y-Axis
 * @param {number} z Translation in z-Axis
 * @returns 4x4 Matrix
 */
function T(x,y,z) {
    return [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [x,y,z,1]
    ];
}


/**
 * Multipies Point with Transformation-Matrix to apply transformation.
 * @param {Point} T 1x4 Array Representing a Point
 * @param {Matrix} M 4x4 Transformation Matrix
 * @returns 1x4 Point
 */
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


/**
 * start Engine
 */
function start() {
    JS3DGeometry.start();
    JS3DGeometry.draw();
}

var JS3DGeometry = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.ctx = this.canvas.getContext("2d");
        this.Items = [];
        this.addCube(50,50,50);
        this.addCylinder(50,50);
        this.addCone(50,100);
        document.getElementById("JS3DGeometry").appendChild(this.canvas);
        this.Interval = setInterval(() => {
            this.clear();
            this.draw();
        }, 1000/30);
    },
    /**
     * Clear Canvas
     */
    clear : function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    /**
     * Draw Items on Canvas
     */
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
                //p1 = TM(p1, P());
                p1 = TM(p1, T(Item.transform.translation[0],Item.transform.translation[1],Item.transform.translation[2]));
                
                p2 = TM(p2, S(Item.transform.scale[0],Item.transform.scale[1],Item.transform.scale[2]));
                p2 = TM(p2, R('x',Math.PI * Item.transform.rotation[0] / 180));
                p2 = TM(p2, R('y',Math.PI * Item.transform.rotation[1] / 180));
                p2 = TM(p2, R('z',Math.PI * Item.transform.rotation[2] / 180));
                //p2 = TM(p2, P());
                p2 = TM(p2, T(Item.transform.translation[0],Item.transform.translation[1],Item.transform.translation[2]));
                


                this.ctx.beginPath();
                this.ctx.moveTo(p1[0], p1[1]);
                this.ctx.lineTo(p2[0], p2[1]);
                this.ctx.stroke();
            }
        }
    },
    /**
     * Add Basic Cube
     * @param {number} W Width
     * @param {number} H Height
     * @param {number} D Depth
     */
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
                        <td><input type="number" id="i`+i+`tx" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.translation[0]+`"></td>
                        <td><input type="number" id="i`+i+`ty" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.translation[1]+`"></td>
                        <td><input type="number" id="i`+i+`tz" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.translation[2]+`"></td>
                    </tr>
                    <tr>
                        <th>Scale</th>
                        <td><input type="number" id="i`+i+`sx" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.scale[0]+`"></td>
                        <td><input type="number" id="i`+i+`sy" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.scale[1]+`"></td>
                        <td><input type="number" id="i`+i+`sz" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.scale[2]+`"></td>
                    </tr>
                    <tr>
                        <th>Rotation</th>
                        <td><input type="range" min="0" max="360" id="i`+i+`rx" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.rotation[0]+`"><span id="i`+i+`rsx"></span></td>
                        <td><input type="range" min="0" max="360" id="i`+i+`ry" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.rotation[1]+`"><span id="i`+i+`rsy"></span></td>
                        <td><input type="range" min="0" max="360" id="i`+i+`rz" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.rotation[2]+`"><span id="i`+i+`rsz"></span></td>
                    </tr>
                </table>
            </details>
        </div>
            `;
        }

    },

    addCylinder(R, H) {
        this.Items.push(new Cylinder(R,H));

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
                        <td><input type="number" id="i`+i+`tx" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.translation[0]+`"></td>
                        <td><input type="number" id="i`+i+`ty" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.translation[1]+`"></td>
                        <td><input type="number" id="i`+i+`tz" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.translation[2]+`"></td>
                    </tr>
                    <tr>
                        <th>Scale</th>
                        <td><input type="number" id="i`+i+`sx" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.scale[0]+`"></td>
                        <td><input type="number" id="i`+i+`sy" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.scale[1]+`"></td>
                        <td><input type="number" id="i`+i+`sz" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.scale[2]+`"></td>
                    </tr>
                    <tr>
                        <th>Rotation</th>
                        <td><input type="range" min="0" max="360" id="i`+i+`rx" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.rotation[0]+`"><span id="i`+i+`rsx"></span></td>
                        <td><input type="range" min="0" max="360" id="i`+i+`ry" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.rotation[1]+`"><span id="i`+i+`rsy"></span></td>
                        <td><input type="range" min="0" max="360" id="i`+i+`rz" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.rotation[2]+`"><span id="i`+i+`rsz"></span></td>
                    </tr>
                </table>
            </details>
        </div>
            `;
        }

    },


    addCone(R, H) {
        this.Items.push(new Cone(R,H));

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
                        <td><input type="number" id="i`+i+`tx" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.translation[0]+`"></td>
                        <td><input type="number" id="i`+i+`ty" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.translation[1]+`"></td>
                        <td><input type="number" id="i`+i+`tz" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.translation[2]+`"></td>
                    </tr>
                    <tr>
                        <th>Scale</th>
                        <td><input type="number" id="i`+i+`sx" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.scale[0]+`"></td>
                        <td><input type="number" id="i`+i+`sy" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.scale[1]+`"></td>
                        <td><input type="number" id="i`+i+`sz" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.scale[2]+`"></td>
                    </tr>
                    <tr>
                        <th>Rotation</th>
                        <td><input type="range" min="0" max="360" id="i`+i+`rx" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.rotation[0]+`"><span id="i`+i+`rsx"></span></td>
                        <td><input type="range" min="0" max="360" id="i`+i+`ry" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.rotation[1]+`"><span id="i`+i+`rsy"></span></td>
                        <td><input type="range" min="0" max="360" id="i`+i+`rz" oninput="JS3DGeometry.changeItem(`+i+`)" value="`+this.Items[i].transform.rotation[2]+`"><span id="i`+i+`rsz"></span></td>
                    </tr>
                </table>
            </details>
        </div>
            `;
        }

    },



    /**
     * Change Item Transform
     * @param {Index} i 
     */
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