//Dino side scrolller
//or dino defence.

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('shell', 'assets/shell.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
    this.load.spritesheet('dude1', 
        'assets/egg-shell.png',
        { frameWidth: 107, frameHeight: 71 }
    );
}

var platforms = null;
var cursors = null;
var player = null;
var stars = null;
var score = 0;
var scoreText = '';
var bombs = null;
var gameOver = null;

var pipeGroup = null;

function create ()
{
    this.add.image(400, 300, 'sky');
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //Platform
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    pipeGroup = this.physics.add.group();


    //Player
    player = this.physics.add.sprite(150, 0, 'dude1');
    player.setCollideWorldBounds(true);

    player.body.gravity.y = 1000;

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude1', { start: 6, end: 10 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('dude1', { start: 11, end: 16 }),
        frameRate: 5,
        repeat: -1
    });

    //Cursor
    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(pipeGroup, platforms);
    this.physics.add.collider(player, pipeGroup, hitObstacle, null, this);
}


function update() {
    if(!gameOver) {
        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-530);
            player.anims.play('jump', true);
        } else if(player.body.touching.down) {
            player.anims.play('right', true);
        }

        if (getRandomInt(1, 100) === 1) {
            //Create returns an object that can be used to track position on every update.
            pipeGroup.create(game.config.width, game.config.height - 70, 'shell');
            pipeGroup.setVelocityX(-400);
        }
    }

}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function hitObstacle (player, bomb)
{
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}