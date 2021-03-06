var canvas = document.getElementById('can');
var ctx = canvas.getContext('2d');

var animationTimeout = null;

const playButton = document.getElementById('playButton');

canvas.width = 3 * window.innerWidth / 5;
canvas.height = window.innerHeight - "100";

const backImg = new Image()
backImg.src = "./space.jpg"

$(document).ready(
    function() {

        playButton.addEventListener("click", startGame);

        var firstRawRightBourd = false;
        var firstRawLeftBourd = true; // the last bourd which has been touched
        var secondRawRightBourd = false;
        var secondRawLeftBourd = true;

        var numberOfAliensInRaw = 7;

        var alienList1 = [];
        var alienList2 = [];

        function allAliensDown() {
            for (var i = 0; i < numberOfAliensInRaw; i++) {
                alienList1[i].moveDown();
                alienList2[i].moveDown();
            }
        }

        function allSeconRawDead() {
            for (var i = 0; i < numberOfAliensInRaw; i++) {
                if (alienList2[i].alive) return false;
            }

            return true;
        }

        class Alien {
            constructor(x, y, raw) {
                this.width = 50;
                this.height = 50;

                this.raw = raw;

                this.x = x;
                this.y = y;

                this.alive = true;

                this.image = new Image();
                this.image.src = './alien.png';
            }

            moveDown() {
                if (this.alive) {
                    this.y += 15;
                }
            }

            moveAlien() {
                if (this.raw == 1) {
                    if (firstRawLeftBourd) {
                        if (this.x + this.width < canvas.width) {
                            this.x += 5;
                        } else {
                            this.x -= 5;
                            firstRawLeftBourd = false;
                            firstRawRightBourd = true;

                            if (allSeconRawDead()) allAliensDown();
                        }
                    } else {
                        if (this.x > 4) {
                            this.x -= 5;
                        } else {
                            this.x += 5;
                            firstRawLeftBourd = true;
                            firstRawRightBourd = false;

                            if (allSeconRawDead()) allAliensDown();
                        }
                    }
                } else if (this.raw == 2) {
                    if (secondRawLeftBourd) {
                        if (this.x + this.width < canvas.width) {
                            this.x += 5;
                        } else {
                            this.x -= 5;
                            secondRawLeftBourd = false;
                            secondRawRightBourd = true;
                            allAliensDown();
                        }
                    } else {
                        if (this.x > 4) {
                            this.x -= 5;
                        } else {
                            this.x += 5;
                            secondRawLeftBourd = true;
                            secondRawRightBourd = false;
                            allAliensDown()
                        }
                    }
                }
            }

            draw(move) {
                if (this.alive) {
                    if (move) this.moveAlien();
                    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                }
            }

            kill() {
                this.alive = false;
            }
        }

        class Bulet {
            constructor(x, y) {
                this.width = 5;
                this.height = 15;

                this.x = x;
                this.y = y - this.height;

                this.active = false;
            }

            moveUp() {
                this.y = this.y - 7;
                if (this.y <= 0) {
                    this.kill();
                }
            }

            checkIfkill() {
                var endXposition = this.x + this.width;

                for (var i = 0; i < numberOfAliensInRaw; i++) {
                    if (this.active && alienList1[i].alive && (this.y >= alienList1[i].y && this.y <= alienList1[i].y + alienList1[i].height) &&
                        ((this.x >= alienList1[i].x && this.x <= alienList1[i].x + alienList1[i].width) ||
                            (endXposition >= alienList1[i].x && this.x <= alienList1[i].x + alienList1[i].width))) {
                        alienList1[i].kill();
                        this.kill();
                        break;
                    }

                    if (this.active && alienList2[i].alive && (this.y >= alienList2[i].y && this.y <= alienList2[i].y + alienList2[i].height) &&
                        ((this.x >= alienList2[i].x && this.x <= alienList2[i].x + alienList2[i].width) ||
                            (endXposition >= alienList2[i].x && this.x <= alienList2[i].x + alienList2[i].width))) {
                        alienList2[i].kill();
                        this.kill();
                        break;
                    }
                }

            }

            draw() {
                if (this.active) {

                    this.checkIfkill();
                    this.moveUp();
                    this.checkIfkill();

                    ctx.fillStyle = "white";
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                }
            }

            start() {
                this.active = true;
            }

            kill() {
                console.log("bullet is killed");
                this.active = false;
            }
        }

        class Player {

            constructor() {
                this.width = 65;
                this.height = 75;

                this.x = canvas.width / 2 - this.width / 2;
                this.y = canvas.height - this.height;
                this.alive = true;

                this.image = new Image();
                this.image.src = './player.png';
            }

            moverigth() {
                if (this.x + this.width < canvas.width) {
                    this.x += 5;
                }
            }

            moveleft() {
                if (this.x > 4) {
                    this.x -= 5;
                }
            }

            draw() {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }

        }


        var player = new Player();
        var moveLeft = false;
        var moveRight = false;

        var shooting = null;

        initialiseAliens();

        function initialiseAliens() {
            for (var i = 0; i < numberOfAliensInRaw; i++) {
                alienList1[i] = new Alien(i * canvas.width / 10, 100, 1);
                alienList2[i] = new Alien(i * canvas.width / 10, 175, 2);
            }

        }

        function shoot() {
            if (shooting === null || !shooting.active) {
                shooting = new Bulet(player.x + player.width / 2, player.y);
                shooting.start();
            }
        }


        function startGame() {

            $(window).keydown(function(e) {
                var keyCode = e.keyCode;
                if (keyCode == 39) {
                    moveRight = true;
                } else if (keyCode == 37) {
                    moveLeft = true;
                } else if (keyCode == 32) {
                    shoot();
                };
            });

            $(window).keyup(function(e) {
                var keyCode = e.keyCode;
                if (keyCode == 39) {
                    moveRight = false;
                } else if (keyCode == 37) {
                    moveLeft = false;
                };

            });

            if (!(animationTimeout === null)) clearTimeout(animationTimeout);

            animate();
        }

        function drawShoots() {
            if (!(shooting === null)) {
                shooting.draw();
            }

        }

        function drawAliens(move) {

            if (firstRawLeftBourd) {
                for (var i = numberOfAliensInRaw - 1; i >= 0; i--) {
                    alienList1[i].draw(move);
                }
            } else {
                for (var i = 0; i < numberOfAliensInRaw; i++) {
                    alienList1[i].draw(move);
                }
            }

            if (secondRawLeftBourd) {
                for (var i = numberOfAliensInRaw - 1; i >= 0; i--) {
                    alienList2[i].draw(move);
                }
            } else {
                for (var i = 0; i < numberOfAliensInRaw; i++) {
                    alienList2[i].draw(move);
                }
            }
        }

        function checkIfWin() {
            for (var i = 0; i < numberOfAliensInRaw; i++) {
                if (alienList1[i].alive || alienList2[i].alive) { return false; }
            }

            return true;
        }

        function checkIfLoose() {
            for (var i = 0; i < numberOfAliensInRaw; i++) {
                if (alienList1[i].alive && ((alienList1[i].y + alienList1[i].height >= canvas.height - 5) ||
                        (player.y >= alienList1[i].y && player.y <= alienList1[i].y + alienList1[i].height &&
                            alienList1[i].x >= player.x && alienList1[i].x <= player.x + player.height)))
                    return true;
                else if (alienList2[i].alive && ((alienList2[i].y + alienList2[i].height >= canvas.height - 5) ||
                        (player.y >= alienList2[i].y && player.y <= alienList2[i].y + alienList2[i].height &&
                            alienList2[i].x >= player.x && alienList2[i].x <= player.x + player.height)))
                    return true;
            }

            return false;
        }

        function restart() {
            firstRawRightBourd = false;
            firstRawLeftBourd = true;
            secondRawRightBourd = false;
            secondRawLeftBourd = true;

            alienList1 = [];
            alienList2 = [];

            player = new Player();
            moveLeft = false;
            moveRight = false;

            shooting = null;

            initialiseAliens();

            playButton.innerHTML = "Restart";
        }

        function animate() {
            ctx.drawImage(backImg, 0, 0, canvas.width, canvas.height);

            ctx.font = "45px Comic Sans MS";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText("Space Invaders", canvas.width / 2 - 15, 45);

            if (moveRight) {
                player.moverigth();
            };

            if (moveLeft) {
                player.moveleft();
            };

            player.draw();
            drawAliens(true);
            drawShoots();

            if (checkIfWin()) {
                window.alert("Congratulations! You have won!");
                restart();
            } else if (checkIfLoose()) {
                window.alert("Sorry! You have lost");
                restart();
            } else {
                animationTimeout = setTimeout(animate, 25);
            }
        }

        function initialAnimation() {

            ctx.drawImage(backImg, 0, 0, canvas.width, canvas.height);

            ctx.font = "45px Comic Sans MS";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText("Space Invaders", canvas.width / 2 - 15, 45);

            player.draw();
            drawAliens(false);
            drawShoots();

            animationTimeout = setTimeout(initialAnimation, 25);

        }

        initialAnimation();
    }
)