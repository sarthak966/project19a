var backgroundimg,backgroundPath,groundImg,playerImg,trexAni,obstacleImg1,obstacleImg2,gameOverImg,trexImgCollided,resetImg;
var jumpSound,collidingSound;
var gameState="play";
var invisibleGround,ground,player,trex,obstacle,gameover,obstacleGroup,restartSprite;
var score;


function preload(){
    backgroundimg=loadImage("background.jpg");
    groundImg=loadImage("ground.png");
    playerImg=loadImage("player.png");
    trexAni=loadAnimation("trex_2.png","trex_1.png","trex_3.png");
    obstacleImg1=loadImage("obstacle1.png");
    obstacleImg2=loadImage("obstacle2.png");
    trexImgCollided=loadAnimation("trex_collided.png");
    gameOverImg=loadImage("gameOver.png");
    resetImg=loadImage("restart.png");
    jumpSound=loadSound("jump.wav");
    collidingSound=loadSound("collided.wav");
}

function setup() {
    createCanvas(windowWidth,windowHeight);
    // backgroundPath=createSprite(200,200);
    // backgroundPath.addImage(backgroundimg);
    // backgroundPath.velocityX=-10;
    // backgroundPath.scale=1.2;

    // ground=createSprite();
    ground=createSprite(width/2,height-125,width,20)
    ground.addImage(groundImg);
    ground.velocityX=-10;

    invisibleGround=createSprite(width/2,height-185,width,20);
    invisibleGround.visible=false;

    player=createSprite(width/2.8,height-250,20,20);
    player.addImage(playerImg);
    player.scale=0.07;
    player.setCollider("circle",0,300,450);
    // player.debug=true;

    

    // invisibleGround.setCollider("circle",0,0,280)

    trex=createSprite(windowWidth/25,height-250,20,20);
    trex.addAnimation("running",trexAni);
    trex.addAnimation("collided",trexImgCollided);
    trex.scale = 0.2;

    
    trex.setCollider("circle",200,0,280);
    // trex.debug=true;

    obstacleGroup=new Group(); 



    gameover=createSprite(width/2,height/3,200,200);
    gameover.addImage(gameOverImg);
    gameover.visible=false;

    restartSprite=createSprite(width/2,height/2,200,200);
    restartSprite.addImage(resetImg);
    restartSprite.visible=false;
    restartSprite.scale=0.2;



    score=0;
 
}

function draw() {
    if(gameState==="play"){
        score=score+0.2
        background(backgroundimg);
        spawnObstacle();
        if(ground.x<300){
            ground.x=ground.width/2;
            
        }
        trex.collide(invisibleGround);
        player.collide(invisibleGround);
        // 
        if((touches.length > 0 || keyDown("space")) && player.y>height-270){
            player.velocityY=-12;
            touches = [];
            jumpSound.play()
        }

        if(trex.isTouching(obstacleGroup)){
            trex.velocityY=-10;

        }

        obstacleGroup.displace(player);
       

        player.velocityY=player.velocityY+0.8;
        trex.velocityY=trex.velocityY+0.8;

        if(frameCount%1000==0){
            ground.velocityX=ground.velocityX-2;
        }

        if(player.isTouching(trex)){
            gameState="end";
            collidingSound.play()
        }
        
    }

    if(gameState==="end"){
        background(backgroundimg);
        ground.velocityX=0;
        trex.changeAnimation("collided",trexImgCollided);
        trex.velocityY=0;
        player.velocityY=0;
        obstacleGroup.setVelocityXEach(0);
        obstacleGroup.setLifetimeEach(-1);
        score=score

        restartSprite.visible=true;
        gameover.visible=true;

        if(keyDown("space") || mousePressedOver(restartSprite) || touches.length>0){
            gameState = "play";
            touches = [];

            gameover.visible = false;
            restartSprite.visible = false;

            trex.x=width/25;
            obstacleGroup.destroyEach();
            trex.changeAnimation("running",trexAni);
            score = 0;
            player.x=width/2.8;
            ground.velocityX=-10;
        }
    }
 drawSprites();
textSize(18);
fill("red"); 
 text("Score: "+Math.round(score),30,50);

}


function spawnObstacle(){
    var randomFC=Math.round(random(80,150));

    if(frameCount%randomFC==0){
        obstacle=createSprite(2000,height-220,200,200);
        obstacle.scale=0.7;
        var obstacleArray=[obstacleImg1,obstacleImg2];
        var randomNumber=Math.round(random(1,2));
        obstacle.addImage(obstacleArray[randomNumber-1]);
        obstacle.velocityX=ground.velocityX

        obstacle.lifetime=300;

        obstacleGroup.add(obstacle);
    }


}


