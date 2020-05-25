let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.backgroundColor = "#3D3D3D";

let mouse = {
    x: undefined,
    y: undefined
}
window.addEventListener("mousemove", (ev) => {
    mouse.x = ev.x;
    mouse.y = ev.y;
})
window.addEventListener("click", () => {
    let elementX = Math.floor(mouse.x/len);
    let elementY = Math.floor(mouse.y/len);

    if(check(elementY, elementX)){
        cellArray[elementY][elementX].visit();
    }
})
window.addEventListener("keypress", (ev) => {
    if(ev.keyCode === 32){
        let elementX = Math.floor(mouse.x/len);
        let elementY = Math.floor(mouse.y/len);

        if(check(elementY, elementX)){
            if(cellArray[elementY][elementX].color !== "#EB2D00"){
                cellArray[elementY][elementX].color = "#EB2D00";
            } else {
                cellArray[elementY][elementX].color = "#FFFFFF";
            }
        }
    }
})
let colors = [
              "#9E3A9E",
              "#97AA6A",
              "#D1CF38",
              '#2C3E50',
              '#E74C3C',
              '#ECF0F1',
              '#3498DB',
              '#2980B9'
            ];

const check = (i, j) => {
    if(i <= -1 || i >= row || j <= -1 || j >= col){
        return false;
    } else if(cellArray[i][j].visited === true) {
        return false;
    } else {
        return true;
    }
}

const fill = (i, j) => {
    if(check(i, j)){
        cellArray[i][j].visited = true;
        cellArray[i][j].color = "#805959";
        for(let k = 0; k < 8; k++){
            if(check(i+diri[k], j+dirj[k])){
                if(cellArray[i+diri[k]][j+dirj[k]].neighbourcount === 0){
                    fill(i+diri[k], j+dirj[k]);
                } else {
                    cellArray[i+diri[k]][j+dirj[k]].visit();
                }
            }
        }
    }
}

class Cell{
    constructor(x, y){
        this.i = y;
        this.j = x;
        this.x = x*len;
        this.y = y*len;
        this.isBomb = false;
        this.visited = false;
        this.neighbourcount = 0;
        this.color = "#FFFFFF";
    }
    bomb(){
        this.isBomb = true;
    }
    visit(){
        if(this.neighbourcount !== 0 || this.isBomb){
            this.visited = true;
            this.color = "#805959";
        }

        if(this.isBomb === false){
            if(this.neighbourcount === 0){
                fill(this.i, this.j);
            }
        }
    }

    draw(){
        c.fillStyle = this.color;
        c.beginPath();
        c.rect(this.x, this.y, len, len);
        c.fill();
        c.stroke();
        
        if(this.visited){
            if(this.isBomb){
                c.beginPath();
                c.arc(this.x+len/2, this.y+len/2, len/4, 0, 2*Math.PI, false);
                c.fillStyle = "#CCCCCC";
                c.strokeStyle = "#CCCCCC";
                c.fill();
                c.stroke();
                c.strokeStyle = "#000000";
            } else if(this.neighbourcount) {
                c.font = "45px Arial";
                c.fillStyle = colors[this.neighbourcount-1];
                c.fillText(`${this.neighbourcount}`, this.x+len/2-12.225, this.y+len/2+12.225);
            }
        }

    }
}

let len = 75;
let row = Math.floor(innerHeight/len), col = Math.floor(innerWidth/len);
let BombCount = Math.floor(row*col/5);
let cellArray = [];
let diri = [-1, 0, 1, 0, 1, -1, -1, 1];
let dirj = [0, 1, 0, -1, 1, 1, -1, -1];
for(let i = 0; i < row; i++){
    cellArray.push([]);
}

for(let i = 0; i < row; i++){
    for(let j = 0; j < col; j++){
        cellArray[i][j] = new Cell(j, i);
    }
}

for(let i = 0; i < BombCount; i++){
    let x = Math.floor(Math.random()*row);
    let y = Math.floor(Math.random()*col);
    if(x == row){
        x--;
    } 
    if(y == col) {
        y--;
    }

    if(!cellArray[x][y].isBomb){
        cellArray[x][y].bomb();
    } else {
        while(cellArray[x][y].bomb()){
            x = Math.floor(Math.random()*row);
            y = Math.floor(Math.random()*col);
            if(x == row){
                x--;
            } if(y == col) {
                y--;
            }
        }
        
        cellArray[x][y].bomb();
    }
}

for(let i = 0; i < row; i++){
    for(let j = 0; j < col; j++){
        for(let k = 0; k < 8; k++){
            if(check(i+diri[k], j+dirj[k])){
                if(cellArray[i+diri[k]][j+dirj[k]].isBomb){
                    cellArray[i][j].neighbourcount++;
                }
            }
        }
    }
}

/*
for(let i = 0; i < row; i++){
    for(let j = 0; j < col; j++){   //for debug
        cellArray[i][j].visit();
    }
}
*/
let bombsw = 1;
const animate = () => {
    if(bombsw){
        requestAnimationFrame(animate);
        for(let i = 0; i < row; i++){
            for(let j = 0; j < col; j++){
                cellArray[i][j].draw();
                if(cellArray[i][j].isBomb && cellArray[i][j].visited){
                    bombsw = 0;
                }
            }
        }
    } else {
        c.font = "175px Impact";
        c.fillStyle = '#3498DB';
        c.fillText("Ai comis-o barosane.", innerWidth/4, innerHeight/2, 3*innerWidth/4);
    }
}
animate();