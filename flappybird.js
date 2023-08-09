// setting the board dimensions 
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// setting the bird dimensions 
let birdWidth = 34;                    // width/height ratio = 408/228 = 17/12, in same ration bird is drawn
let birdHeight = 24;
let birdX = boardWidth/8;              // position of bird on the board 
let birdY = boardHeight/2;
let birdImg;

// bird object where it contains it's cordinate and it's dimension
let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//initializing the pipes
let pipeArray = [];
let pipeWidth = 64; 
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

// two types of pipes
let topPipeImg;
let bottomPipeImg;

// setting the movement of pipes 
let velocityX = -2; //pipes moving to left
let velocityY = 0; //bird jump speed
let gravity = 0.4;
let changePipe = 1500;
let myInterval;

// setting the game variables
let gameOver = true;
let score = 0;
let highScore = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board
    
    //load images
    birdImg = new Image();
    birdImg.src = "imgs/flappybird.png";  
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
    
    topPipeImg = new Image();
    topPipeImg.src = "imgs/toppipe.png";
    
    bottomPipeImg = new Image();
    bottomPipeImg.src = "imgs/bottompipe.png";

    context.font = "20px cursive";
    context.fillText("Press Space bar to start", 56, 230);

    requestAnimationFrame(update);
    
    myInterval = setInterval(placePipes, changePipe); //every 1.5 seconds
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;

    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    
    if (bird.y > board.height) {
        gameOver = true;
    }
    
    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
            // changing the speed of bird, or increasing the speed of bird to increase difficulty 
            switch(score){
                case 10:
                    velocityX = -2.4;
                    changePipe = 1200;
                    clearInterval(myInterval);
                    myInterval = setInterval(placePipes, changePipe); //every 1.2 seconds
                break;
                case 20:
                    velocityX = -2.8;
                    changePipe = 1100;
                    clearInterval(myInterval);
                    myInterval = setInterval(placePipes, changePipe); //every 1.1 seconds
                break;
                case 35:
                    velocityX = -3.2;
                    changePipe = 1050;
                    clearInterval(myInterval);
                    myInterval = setInterval(placePipes, changePipe); //every 1.05 seconds
                break;
                case 60:
                    velocityX = -3.6;
                    changePipe = 950;
                    clearInterval(myInterval);
                    myInterval = setInterval(placePipes, changePipe); //every 0.95 seconds
                break;
                case 95:
                    velocityX = -4;
                    changePipe = 800;
                    clearInterval(myInterval);
                    myInterval = setInterval(placePipes, changePipe); //every 0.8 seconds
                break;
                case 135:
                    velocityX = -4.5;
                    changePipe = 700;
                    clearInterval(myInterval);
                    myInterval = setInterval(placePipes, changePipe); //every 0.7 seconds
                break;
            }
        }
        
        if (detectCollision(bird, pipe)) {
            gameOver = true;
            velocityX = -2;      // reset the values 
            clearInterval(myInterval);
            changePipe = 1500;
            myInterval = setInterval(placePipes, changePipe); //every 1.5 seconds
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array, done to reduce the use of space/memory 
    }

    //print score 
    context.fillStyle = "black";
    context.font="45px sans-serif";
    context.fillText(score, 5, 35);
    
    if (gameOver) {
        context.font="15px sans-serif";
        context.fillText("Game Over, Press Space bar to restart", 5, 55);

        if(highScore < score){
            highScore = score;
            context.fillText("Congratulation you have broken the highest score", 5 , 95);
        }
        else if(highScore == score && score != 0){
            context.fillText("You have equalled the highest score", 5 , 95);
        }
        // console.log(highScore);                            // for checking whether highScore is changing or not
        context.fillText("Current Highest Score: ", 5, 75);
        context.fillText(highScore, 159, 75);    
        context.font="45px sans-serif";
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);     // setting height of top pipe using random function
    let openingSpace = board.height/4;      // giving a constant space between top and bottom pipe

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY = -6;      // negative means moving up

        //reset the game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}