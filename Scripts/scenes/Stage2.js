"use strict";
var scenes;
(function (scenes) {
    class Stage2 extends objects.Scene {
        // PUBLIC PROPERTIES
        // CONSTRUCTOR
        constructor() {
            super();
            this._scoreBoard = new managers.ScoreBoard;
            this.fire = true;
            this._antiBoom = true;
            this._numOfEnemy = 10;
            this._bulletNum = 30;
            this._bulletImg = new Image();
            this._count = 0;
            // initialization
            this._player = new objects.Player;
            this._ememies = new Array();
            this._background = new objects.Background();
            this._enemybullets = new Array();
            this._bullets = new Array();
            this._bulletImage = new objects.Button();
            this._bulletImg.src = "./Assets/images/beam1.png";
            this._bulletNumLabel = new objects.Label();
            this._playerBullet = new objects.Bullet();
            //this._pointLabel = new objects.Label();
            //this._liveLabel = new objects.Label();
            this._bulletImage = new objects.Button();
            this._pointsUp = new objects.Image();
            this._scoreImage = new objects.Button();
            this._lifeImage = new objects.Button();
            this._levelup = new objects.Image();
            this._healthup = new objects.Image();
            this._blackhole = new objects.Blackhole();
            this._antiBoomImage = new objects.Image();
            this._numOfEnemy = 10;
            this._count = this._numOfEnemy;
            this._bulletNum = 30;
            // this._point = 0;
            this.Start();
        }
        //#########################################
        //          create enamies
        //#########################################
        AddEnemies(number) {
            let createEnemy = setInterval(() => {
                if (this._ememies.length < number) {
                    let enemy = new objects.Enemy(config.Game.ASSETS.getResult("enemy02"));
                    this._ememies.push(enemy);
                    this.addChild(enemy);
                    console.log("CREATE");
                    this.FireGun(enemy, this._enemybullets);
                }
                else {
                    clearInterval(createEnemy);
                }
            }, 1000);
        }
        //#########################################
        //      FIRE MULTIPLE GUNS
        //#########################################
        FireGun(enemy, bullArray) {
            if (enemy.canShoot()) {
                let fire = setInterval(() => {
                    if (!enemy.isColliding) {
                        let bullet = new objects.Bullet(config.Game.ASSETS.getResult("enemyBeam"), enemy.x + 40, enemy.y + 50, true);
                        bullArray.push(bullet);
                        this.addChild(bullet);
                    }
                    else
                        clearInterval(fire);
                }, 500);
            }
        } //end public FireGun
        UpdatePosition() {
            this._ememies.forEach(enemy => {
                this.addChild(enemy);
                enemy.Update();
                this._enemybullets.forEach((bullet) => {
                    managers.Collision.Check(this._player, bullet);
                    if (bullet.isColliding) {
                        if (config.Game.SCORE_BOARD.Lives <= 0) {
                            this.ExploreAnimation(this._player.x, this._player.y);
                        }
                        else {
                            this.ShieldAnimation(this._player.x, this._player.y);
                        }
                        bullet.position = new objects.Vector2(-200, -200);
                        this.removeChild(bullet);
                        //config.Game.SCENE_STATE = scenes.State.END;
                    }
                });
                this._bullets.forEach((bullet) => {
                    managers.Collision.AABBCheck(enemy, bullet, 200, true);
                    if (bullet.isColliding) {
                        enemy.Live--;
                        if (enemy.Live < 1) {
                            // this.count++;
                            this.ExploreAnimation(enemy.x, enemy.y);
                            createjs.Sound.play("./Assets/sounds/crash.wav");
                            let randNum = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
                            console.log(randNum);
                            if (randNum == 1) {
                                this._healthup = new objects.Image(config.Game.ASSETS.getResult("health"), enemy.x, enemy.y + 40, true);
                                this.addChild(this._healthup);
                                this._healthup.setStatus(true);
                            }
                            if (randNum == 2) {
                                this._pointsUp = new objects.Image(config.Game.ASSETS.getResult("points"), enemy.x, enemy.y + 20, true);
                                this.addChild(this._pointsUp);
                                this._pointsUp.setStatus(true);
                            }
                            enemy.position = new objects.Vector2(-100, -200);
                            enemy.died = true;
                            this.removeChild(enemy);
                            //config.Game.SCORE_BOARD.Score  += 200;
                        }
                        createjs.Sound.play("./Assets/sounds/break.wav");
                        this.BreakAnimation(enemy.x, enemy.y);
                        bullet.position = new objects.Vector2(-200, -200);
                        this.removeChild(bullet);
                    }
                });
            });
            //check Black hole Collison
            managers.Collision.squaredRadiusCheck(this._player, this._blackhole);
            if (this._blackhole.isColliding) {
                if (config.Game.SCORE_BOARD.Lives <= 0) {
                    this.ExploreAnimation(this._player.x, this._player.y);
                }
                else {
                    this.ShieldAnimation(this._player.x, this._player.y);
                }
            }
        } //end update positon
        //#########################################
        //    CONTROL BULLETS' MOVEMENT, SPEED
        //#########################################
        UpdateBullets() {
            this._bullets.forEach((bullet) => {
                this.BulletSpeed(bullet, 10, 10, false);
            });
            this._ememies.forEach(enemy => {
                enemy.addEventListener("tick", () => {
                    if (enemy.canShoot()) {
                        let bullet = new objects.Bullet(config.Game.ASSETS.getResult("enemyBeam"), enemy.x + 40, enemy.y + 50, true);
                        this._enemybullets.push(bullet);
                        this.addChild(bullet);
                    }
                });
            });
            this._enemybullets.forEach((bullet) => {
                this.BulletSpeed(bullet, 10, 10, true);
            });
        }
        BulletSpeed(eBullet, eSpeed, eMove, pick = false) {
            //enemy direction
            if (pick == true) {
                eBullet.y += eSpeed;
                eBullet.position.y += eMove;
                if (eBullet.y >= 800) {
                    this.removeChild(eBullet);
                }
            }
            //player direction
            else {
                eBullet.y -= eSpeed;
                eBullet.position.y -= eMove;
                if (eBullet.y <= 0) {
                    this.removeChild(eBullet);
                }
            }
        }
        UpdateWinOrLoseCondition() {
            this._bulletNumLabel.text = " : " + this._bulletNum;
            if (this._bulletNum == 0) {
                config.Game.SCENE_STATE = scenes.State.END;
            }
            //this._pointLabel.text = " : " + Play.point;
            //this._liveLabel.text = " : " + managers.Collision.live;
            //if player kill all the enemies
            // if(managers.Collision.count == this._numOfEnemy)
            // {
            //     //config.Game.SCENE_STATE = scenes.State.FINALSTAGE;
            //     config.Game.SCENE_STATE = scenes.State.COMPLETE;
            // }
            //if attacked more than 3 times, game over
            if (config.Game.SCORE_BOARD.Lives <= 0) {
                setTimeout(() => {
                    this.removeChild(this._player);
                    config.Game.SCENE_STATE = scenes.State.END;
                }, 300);
            }
            if (this._count < 1) {
                config.Game.SCENE_STATE = scenes.State.FINALSTAGE;
                managers.Collision.count = 0;
            }
        }
        // PUBLIC METHODS
        Start() {
            this._background = new objects.Background(config.Game.ASSETS.getResult("background2"));
            this._blackhole = new objects.Blackhole();
            this._ememies = new Array();
            this._bulletImage = new objects.Button(config.Game.ASSETS.getResult("bullet"), 560, 30, true);
            this._bulletImage = new objects.Button(config.Game.ASSETS.getResult("bullet"), 560, 30, true);
            this._scoreImage = new objects.Button(config.Game.ASSETS.getResult("score"), 420, 30, true);
            this._lifeImage = new objects.Button(config.Game.ASSETS.getResult("life"), 30, 30, true);
            this._bulletNumLabel = new objects.Label("bullets:", "23px", "Impact, Charcoal, sans-serif", "#fff", 610, 30, true);
            //this._pointLabel = new objects.Label("Scores: 0", "23px", "Impact, Charcoal, sans-serif", "#ffffff", 480, 30, true);
            //this._liveLabel = new objects.Label("Live: 3", "23px", "Impact, Charcoal, sans-serif", "#fff", 75, 30, true);
            this._levelup = new objects.Image(config.Game.ASSETS.getResult("levelup"), 400, 50, true);
            this._antiBoomImage = new objects.Image(config.Game.ASSETS.getResult("antiBoom"), this._antiBoomImage.RandomPoint(true).x, this._antiBoomImage.RandomPoint(true).y, true);
            // this._numOfEnemy =5;
            this.AddEnemies(this._numOfEnemy);
            config.Game.SCORE_BOARD = this._scoreBoard;
            this._scoreBoard.HighScore = config.Game.HIGH_SCORE;
            this.Main();
        } //end start
        Update() {
            this._background.Update();
            this._player.Update();
            this._blackhole.Update();
            this.UpdateBullets();
            this.UpdatePlayerFire();
            this.UpdatePosition();
            this.UpdateWinOrLoseCondition();
            this.killAll();
            this._levelup.y += 5;
            this._levelup.position.y += 5;
            managers.Collision.AABBCheck(this._player, this._levelup, 0);
            if (this._levelup.isColliding) {
                this.removeChild(this._levelup);
                this._bulletImg.src = "./Assets/images/beam3.png";
                createjs.Sound.play("./Assets/sounds/powerup.wav");
            }
            if (this._healthup.getStatus()) {
                this._healthup.Update();
                managers.Collision.AABBCheck(this._player, this._healthup);
                if (this._healthup.isColliding) {
                    config.Game.SCORE_BOARD.Lives += 1;
                    console.log("collided my nnigaa");
                    this.removeChild(this._healthup);
                    this._healthup.setStatus(false);
                }
            }
            //checking whether  points is colliding with the player
            if (this._pointsUp.getStatus()) {
                this._pointsUp.Update();
                managers.Collision.AABBCheck(this._player, this._pointsUp);
                if (this._pointsUp.isColliding) {
                    createjs.Sound.play("./Assets/sounds/points.wav");
                    config.Game.SCORE_BOARD.Score += 400;
                    console.log("Collided Mister Points");
                    this.removeChild(this._pointsUp);
                    this._pointsUp.setStatus(false);
                }
            }
            this._antiBoomImage.y += 5;
            this._antiBoomImage.position.y += 5;
            managers.Collision.AABBCheck(this._player, this._antiBoomImage, 0, true);
            if (this._antiBoomImage.isColliding) {
                if (config.Game.SCORE_BOARD.AntiBoomItem == 1) {
                    config.Game.SCORE_BOARD.AntiBoomItem = 2;
                }
                else
                    config.Game.SCORE_BOARD.AntiBoomItem = 1;
                this.removeChild(this._antiBoomImage);
                //
            }
        } //end update
        Main() {
            this.addChild(this._background);
            this.addChild(this._blackhole);
            this.addChild(this._bulletImage);
            this.addChild(this._bulletNumLabel);
            this.addChild(this._lifeImage);
            this.addChild(this._scoreImage);
            this.addChild(this._player);
            //this.addChild(this._pointLabel);
            //this.addChild(this._liveLabel);
            this.addChild(this._levelup);
            this.addChild(this._antiBoomImage);
            this.addChild(this._scoreBoard.LivesLabel);
            this.addChild(this._scoreBoard.ScoreLabel);
            this.addChild(this._scoreBoard.HighScoreLabel);
            this.addChild(this._scoreBoard.ItemLabel);
        } //end main
        //ANTI-Matter-Boom
        killAll() {
            if (config.Game.keyboardManager.antiBoom) {
                if (this._antiBoom) {
                    if (config.Game.SCORE_BOARD.AntiBoomItem > 0) {
                        // config.Game.SCORE_BOARD.Score += 500;
                        console.log("antianti");
                        this._ememies.forEach(enemy => {
                            this.ExploreAnimation(enemy.x, enemy.y);
                            createjs.Sound.play("./Assets/sounds/crash.wav");
                            enemy.position = new objects.Vector2(-100, -200);
                            enemy.died = true;
                            this.removeChild(enemy);
                            this._antiBoom = false;
                        });
                        config.Game.SCORE_BOARD.AntiBoomItem -= 1;
                    }
                }
            }
            if (!config.Game.keyboardManager.antiBoom) {
                this._antiBoom = true;
            }
        }
        //#########################################
        //      FIRE SHOOT WITH SPACE BUTTON
        //#########################################
        UpdatePlayerFire() {
            if (config.Game.keyboardManager.fire) {
                if (this.fire) {
                    console.log("click1");
                    this._bulletNum--;
                    createjs.Sound.play("./Assets/sounds/firstGun1.wav");
                    this._playerBullet = new objects.Bullet(this._bulletImg, this._player.x, this._player.y - 20, true);
                    this._bullets.push(this._playerBullet);
                    this.addChild(this._playerBullet);
                    this.fire = false;
                }
            }
            if (!config.Game.keyboardManager.fire) {
                this.fire = true;
            }
        } //end UpdatePlayerFire
        //#########################################
        //      ANIMATION
        //#########################################
        ExploreAnimation(obX, obY) {
            let chopperImg1 = document.createElement('img');
            let chopperImg2 = document.createElement('img');
            let chopperImg3 = document.createElement('img');
            let chopperImg4 = document.createElement('img');
            let chopperImg5 = document.createElement('img');
            let chopperImg6 = document.createElement('img');
            let chopperImg7 = document.createElement('img');
            let chopperImg8 = document.createElement('img');
            let chopperImg9 = document.createElement('img');
            let chopperImg10 = document.createElement('img');
            let chopperImg11 = document.createElement('img');
            let chopperImg12 = document.createElement('img');
            let chopperImg13 = document.createElement('img');
            let chopperImg14 = document.createElement('img');
            let chopperImg15 = document.createElement('img');
            let chopperImg16 = document.createElement('img');
            chopperImg1.src = "./Assets/images/e1.png";
            chopperImg2.src = "./Assets/images/e2.png";
            chopperImg3.src = "./Assets/images/e3.png";
            chopperImg4.src = "./Assets/images/e4.png";
            chopperImg5.src = "./Assets/images/e5.png";
            chopperImg6.src = "./Assets/images/e6.png";
            chopperImg7.src = "./Assets/images/e7.png";
            chopperImg8.src = "./Assets/images/e8.png";
            chopperImg9.src = "./Assets/images/e9.png";
            chopperImg10.src = "./Assets/images/e10.png";
            chopperImg11.src = "./Assets/images/e11.png";
            chopperImg12.src = "./Assets/images/e12.png";
            chopperImg13.src = "./Assets/images/e13.png";
            chopperImg14.src = "./Assets/images/e14.png";
            chopperImg15.src = "./Assets/images/e15.png";
            chopperImg16.src = "./Assets/images/e16.png";
            let spriteSheet = new createjs.SpriteSheet({
                images: [chopperImg1, chopperImg2, chopperImg3, chopperImg4, chopperImg5,
                    chopperImg6, chopperImg7, chopperImg8, chopperImg9, chopperImg10,
                    chopperImg11, chopperImg12, chopperImg13, chopperImg14, chopperImg15, chopperImg16],
                frames: { width: 150, height: 150, count: 17 },
                animations: {
                    explore: [0, 16, false]
                }
            });
            let animation = new createjs.Sprite(spriteSheet);
            animation.x = obX - 65;
            animation.y = obY - 50;
            animation.spriteSheet.getAnimation('explore').speed = 0.5;
            animation.gotoAndPlay('explore');
            this._count--;
            console.log("Count: " + this._count);
            config.Game.SCORE_BOARD.Score += 200;
            this.addChild(animation);
        }
        ShieldAnimation(obX, obY) {
            let chopperImg1 = document.createElement('img');
            let chopperImg2 = document.createElement('img');
            let chopperImg3 = document.createElement('img');
            let chopperImg4 = document.createElement('img');
            let chopperImg5 = document.createElement('img');
            let chopperImg6 = document.createElement('img');
            let chopperImg7 = document.createElement('img');
            let chopperImg8 = document.createElement('img');
            let chopperImg9 = document.createElement('img');
            let chopperImg10 = document.createElement('img');
            let chopperImg11 = document.createElement('img');
            let chopperImg12 = document.createElement('img');
            chopperImg1.src = "./Assets/images/s12.png";
            chopperImg2.src = "./Assets/images/s11.png";
            chopperImg3.src = "./Assets/images/s10.png";
            chopperImg4.src = "./Assets/images/s9.png";
            chopperImg5.src = "./Assets/images/s8.png";
            chopperImg6.src = "./Assets/images/s7.png";
            chopperImg7.src = "./Assets/images/s6.png";
            chopperImg8.src = "./Assets/images/s5.png";
            chopperImg9.src = "./Assets/images/s4.png";
            chopperImg10.src = "./Assets/images/s3.png";
            chopperImg11.src = "./Assets/images/s2.png";
            chopperImg12.src = "./Assets/images/s1.png";
            let spriteSheet = new createjs.SpriteSheet({
                images: [chopperImg1, chopperImg2, chopperImg3, chopperImg4, chopperImg5,
                    chopperImg6, chopperImg7, chopperImg8, chopperImg9, chopperImg10,
                    chopperImg11, chopperImg12],
                frames: { width: 136, height: 136, count: 12 },
                animations: {
                    shield: [0, 12, false]
                }
            });
            let shieldAnimation = new createjs.Sprite(spriteSheet);
            shieldAnimation.x = obX - 65;
            shieldAnimation.y = obY - 50;
            shieldAnimation.spriteSheet.getAnimation('shield').speed = 0.5;
            shieldAnimation.gotoAndPlay('shield');
            this.addChild(shieldAnimation);
        }
        BreakAnimation(obX, obY) {
            let chopperImg1 = document.createElement('img');
            let chopperImg2 = document.createElement('img');
            let chopperImg3 = document.createElement('img');
            let chopperImg4 = document.createElement('img');
            let chopperImg5 = document.createElement('img');
            let chopperImg6 = document.createElement('img');
            let chopperImg7 = document.createElement('img');
            let chopperImg8 = document.createElement('img');
            let chopperImg9 = document.createElement('img');
            let chopperImg10 = document.createElement('img');
            let chopperImg11 = document.createElement('img');
            let chopperImg12 = document.createElement('img');
            chopperImg1.src = "./Assets/images/el1.png";
            chopperImg2.src = "./Assets/images/el2.png";
            chopperImg3.src = "./Assets/images/el3.png";
            chopperImg4.src = "./Assets/images/el4.png";
            chopperImg5.src = "./Assets/images/el5.png";
            chopperImg6.src = "./Assets/images/el6.png";
            chopperImg7.src = "./Assets/images/el7.png";
            chopperImg8.src = "./Assets/images/el8.png";
            chopperImg9.src = "./Assets/images/el9.png";
            chopperImg10.src = "./Assets/images/el10.png";
            chopperImg11.src = "./Assets/images/el11.png";
            chopperImg12.src = "./Assets/images/el12.png";
            let spriteSheet = new createjs.SpriteSheet({
                images: [chopperImg1, chopperImg2, chopperImg3, chopperImg4, chopperImg5,
                    chopperImg6, chopperImg7, chopperImg8, chopperImg9, chopperImg10,
                    chopperImg11, chopperImg12],
                frames: { width: 120, height: 120, count: 13 },
                animations: {
                    break: [0, 12, false]
                }
            });
            let animation = new createjs.Sprite(spriteSheet);
            animation.x = obX - 35;
            animation.y = obY - 20;
            animation.spriteSheet.getAnimation('break').speed = 0.5;
            animation.gotoAndPlay('break');
            this.addChild(animation);
        }
    }
    scenes.Stage2 = Stage2;
})(scenes || (scenes = {}));
//# sourceMappingURL=Stage2.js.map