var tournamentMatch = {
    date: new Date().toISOString(),

    quarter1: {
        p1: "",
        p2: "",
        w: "",
		score: ""
    },
    quarter2: {
        p1: "",
        p2: "",
        w: "" ,
		score: "" 
    },
    finals: {
        p1: "",
        p2: "",
        w: "" ,
		score:""
    }
};

var usernick = localStorage.getItem('usernick');
console.log(usernick);
document.getElementById("nick").textContent = usernick;


// Global Variables
var DIRECTION = {
	IDLE: 0,
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4
};

var gameMode;
var match_result;
var challanger;
var p1;
var p2;
var p3;
var ballColor;
var bgColor;
var paddleColor;
var selectedPlayers;


// The ball object (The cube that bounces back and forth)
var Ball = {
	new: function (incrementedSpeed) {
		return {
			width: 18,
			height: 18,
			x: (this.canvas.width / 2) - 9,
			y: (this.canvas.height / 2) - 9,
			moveX: DIRECTION.IDLE,
			moveY: DIRECTION.IDLE,
			speed: incrementedSpeed || 7
		};
	}
};

// The paddle object (The lines that move up and down or left and right)
var Paddle = {
	new: function (side) {
		if (side === 'left' || side === 'right') {
			return {
				width: 18,
				height: 180,
				x: side === 'left' ? 150 : this.canvas.width - 150,
				y: (this.canvas.height / 2) - 35,
				score: 0,
				move: DIRECTION.IDLE,
				speed: 8
			};
		} else if (side === 'top' || side === 'bottom') {
			return {
				width: 180,
				height: 18,
				x: (this.canvas.width / 2) - 90,
				y: side === 'top' ? 150 : this.canvas.height - 150,
				score: 0,
				move: DIRECTION.IDLE,
				speed: 8
			};
		}
	}
};

var Game = {
	 initialize: function (players, ballColor, bgColor, paddleColor) {
		this.canvas = document.querySelector('canvas');
		this.context = this.canvas.getContext('2d');

		this.canvas.width = 1400;
		this.canvas.height = 1000;

		this.canvas.style.width = (this.canvas.width / 2) + 'px';
		this.canvas.style.height = (this.canvas.height / 2) + 'px';

		this.player = Paddle.new.call(this, 'left');
		this.ai = (players == 1) ? Paddle.new.call(this, 'right') : null;
		this.player2 = (players == 2 || players == 4) ? Paddle.new.call(this, 'right') : null;
		
		if (players == 4) {
			this.playerTop = Paddle.new.call(this, 'top');
			this.playerBottom = Paddle.new.call(this, 'bottom');
			this.players = 4;
		}
		
		this.ball = Ball.new.call(this);

		if (this.ai) this.ai.speed = 5;
		this.running = this.over = false;
		this.turn = this.ai || this.player2;
		this.timer = this.round = 0;
		this.bgColor = bgColor;
		this.ballColor = ballColor;
		this.paddleColor = paddleColor;

		Pong.menu();
		Pong.listen(players);
	},

	menu: function () {
		// Draw all the Pong objects in their current state
		Pong.draw();

		// Change the canvas font size and color
		this.context.font = '50px Courier New';
		this.context.fillStyle = this.bgColor;

		// Draw the rectangle behind the 'Press any key to begin' text.
		this.context.fillRect(
			this.canvas.width / 2 - 350,
			this.canvas.height / 2 - 48,
			700,
			100
		);

		// Change the canvas color;
		this.context.fillStyle = this.ballColor;

		// Draw the 'press any key to begin' text
		this.context.fillText('Press any key to begin',
			this.canvas.width / 2,
			this.canvas.height / 2 + 15
		);
	},

	// Update the draw function in the Game object to include player names
draw: function () {
    // ... (keep existing clear and background drawing code) ...

    // Set the default canvas font and align it to the center
    this.context.font = '100px Courier New';
    this.context.textAlign = 'center';
    
    // Draw player names above scores with smaller font
    this.context.font = '40px Courier New';
    this.context.fillText(
        this.player1Name,
        (this.canvas.width / 2) - 300,
        120  // Position above the score
    );

    // Draw the right side player name (AI or Player 2)
    this.context.fillText(
        this.player2Name,
        (this.canvas.width / 2) + 300,
        120  // Position above the score
    );

    // Draw scores with larger font
    this.context.font = '100px Courier New';
    // Draw the players score (left)
    this.context.fillText(
        this.player.score.toString(),
        (this.canvas.width / 2) - 300,
        200
    );

    // Draw the paddles score (right)
    if (this.player2) {
        this.context.fillText(
            this.player2.score.toString(),
            (this.canvas.width / 2) + 300,
            200
        );
    } else if (this.ai) {
        this.context.fillText(
            this.ai.score.toString(),
            (this.canvas.width / 2) + 300,
            200
        );
    }

    // ... (keep rest of the existing drawing code) ...
    
    // Update endGameMenu display
    this.context.font = '30px Courier New';
    this.context.fillText(
        'Round ' + (Pong.round + 1),
        (this.canvas.width / 2),
        35
    );
},

// Also update the endGameMenu function to maintain the style
	endGameMenu: function (text) {
	    Pong.context.font = '45px Courier New';
	    Pong.context.fillStyle = this.bgColor;

	    Pong.context.fillRect(
	        Pong.canvas.width / 2 - 350,
	        Pong.canvas.height / 2 - 100,
	        700,
	        200
	    );

	    Pong.context.fillStyle = '#00ff00';  // Keep the green color
	
	    let winnerName = '';
	    if (this.player.score > (this.ai ? this.ai.score : this.player2.score)) {
	        winnerName = this.player1Name;
	    } else {
	        winnerName = this.player2Name;
	    }

	    // Display Winner!
	    Pong.context.fillText(
	        'Winner!',
	        Pong.canvas.width / 2,
	        Pong.canvas.height / 2 - 30
	    );

	    // Display winner's name on next line
	    Pong.context.fillText(
	        `${winnerName}!`,
	        Pong.canvas.width / 2,
	        Pong.canvas.height / 2 + 30
	    );

	    return winnerName;
	},

	// Update all objects (move the player, ai, ball, increment the score, etc.)
	update: function () {
		if (!this.over) {
			// Calculate future intersections
			var targetPosition;

			if (this.ai) {
				futureIntersections = this.calculateFutureIntersections();
				if (futureIntersections.length > 0) {
					// Set the first future intersection as the target position for the AI
					targetPosition = futureIntersections[0].y;
				}
			}
			if (this.players != 4) {		
				if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
				if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;
			}
			// If the ball collides with the bound limits - correct the x and y coords.
			if (this.ball.x <= 0) Pong._resetTurn.call(this, this.ai || this.player2, this.player);
			if (this.ball.x >= this.canvas.width - this.ball.width) Pong._resetTurn.call(this, this.player, this.ai || this.player2);
			if (this.players === 4) {
				if (this.ball.y <= 0) Pong._resetTurn.call(this, this.playerBottom, this.playerTop);
				if (this.ball.y >= this.canvas.height - this.ball.height) Pong._resetTurn.call(this, this.playerTop, this.playerBottom);
			}
			// Move player if their move value was updated by a keyboard event
			if (this.player.move === DIRECTION.UP) this.player.y -= this.player.speed;
			else if (this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;

			if (this.player2 && this.player2.move === DIRECTION.UP) this.player2.y -= this.player2.speed;
			else if (this.player2 && this.player2.move === DIRECTION.DOWN) this.player2.y += this.player2.speed;

			// Movimentos das pás superiores e inferiores no modo de 4 jogadores
			if (this.playerTop && this.playerTop.move === DIRECTION.LEFT) this.playerTop.x -= this.playerTop.speed;
			else if (this.playerTop && this.playerTop.move === DIRECTION.RIGHT) this.playerTop.x += this.playerTop.speed;

			if (this.playerBottom && this.playerBottom.move === DIRECTION.LEFT) this.playerBottom.x -= this.playerBottom.speed;
			else if (this.playerBottom && this.playerBottom.move === DIRECTION.RIGHT) this.playerBottom.x += this.playerBottom.speed;

			// Restringir o movimento do playerBottom dentro dos limites do canvas
			if (this.playerBottom){
				if (this.playerBottom.x <= 0) this.playerBottom.x = 0;
				else if (this.playerBottom.x + this.playerBottom.width >= this.canvas.width) this.playerBottom.x = this.canvas.width - this.playerBottom.width;
			}
			// On new serve (start of each turn) move the ball to the correct side
			// and randomize the direction to add some challenge.
			if (Pong._turnDelayIsOver.call(this) && this.turn) {
				this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
				this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
				this.ball.y = this.canvas.height/2;
				this.turn = null;
			}

			// If the player collides with the bound limits, update the x and y coords.
			if (this.player.y <= 0) this.player.y = 0;
			else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);

			if (this.player2 && this.player2.y <= 0) this.player2.y = 0;
			else if (this.player2 && this.player2.y >= (this.canvas.height - this.player2.height)) this.player2.y = (this.canvas.height - this.player2.height);

			// Limites de movimento das pás superior e inferior
			if (this.playerTop && this.playerTop.x <= 0) this.playerTop.x = 0;
			else if (this.playerTop && this.playerTop.x >= (this.canvas.width - this.playerTop.width)) this.playerTop.x = (this.canvas.width - this.playerTop.width);

			if (this.playerBottom && this.playerBottom.y <= 0) this.playerBottom.y = 0;
			else if (this.playerBottom && this.playerBottom.y >= (this.canvas.height - this.playerBottom.height)) this.playerBottom.y = (this.canvas.height - this.playerBottom.height);

			// Move ball in intended direction based on moveY and moveX values
			if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed);
			else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed);
			if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
			else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

			// Handle ai (AI) UP and DOWN movement based on future intersection
			if (this.ai) {
				if (targetPosition !== null) {
					const aiCenter = this.ai.y + this.ai.height / 2;

					if (aiCenter > targetPosition) {
						this.ai.y -= this.ai.speed;
						if (this.ai.y + this.ai.height / 2 <= targetPosition) {
							this.ai.y = targetPosition - this.ai.height / 2;
						}
					} else if (aiCenter < targetPosition) {
						this.ai.y += this.ai.speed;
						if (this.ai.y + this.ai.height / 2 >= targetPosition) {
							this.ai.y = targetPosition - this.ai.height / 2;
						}
					}
				}

				// Handle ai (AI) wall collision
				if (this.ai.y >= this.canvas.height - this.ai.height) this.ai.y = this.canvas.height - this.ai.height;
				else if (this.ai.y <= 0) this.ai.y = 0;
			}

			// Handle Player-Ball collisions
			if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
				if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
					this.ball.x = (this.player.x + this.ball.width);
					this.ball.moveX = DIRECTION.RIGHT;
				}
			}

			if (this.player2 && this.ball.x - this.ball.width <= this.player2.x && this.ball.x >= this.player2.x - this.player2.width) {
				if (this.ball.y <= this.player2.y + this.player2.height && this.ball.y + this.ball.height >= this.player2.y) {
					this.ball.x = (this.player2.x - this.ball.width);
					this.ball.moveX = DIRECTION.LEFT;
				}
			}

			// Handle collisions with the new paddles in 4-player mode
			if (this.playerTop && this.ball.y - this.ball.height <= this.playerTop.y && this.ball.y >= this.playerTop.y - this.playerTop.height) {
				if (this.ball.x <= this.playerTop.x + this.playerTop.width && this.ball.x + this.ball.width >= this.playerTop.x) {
					this.ball.y = this.playerTop.y + this.ball.height;
					this.ball.moveY = DIRECTION.DOWN;
				}
			}

			if (this.playerBottom && this.ball.y + this.ball.height >= this.playerBottom.y && this.ball.y <= this.playerBottom.y + this.playerBottom.height) {
				if (this.ball.x <= this.playerBottom.x + this.playerBottom.width && this.ball.x + this.ball.width >= this.playerBottom.x) {
					this.ball.y = this.playerBottom.y - this.ball.height;
					this.ball.moveY = DIRECTION.UP;
				}
			}

			// Handle ai-ball collision
			if (this.ai && this.ball.x - this.ball.width <= this.ai.x && this.ball.x >= this.ai.x - this.ai.width) {
				if (this.ball.y <= this.ai.y + this.ai.height && this.ball.y + this.ball.height >= this.ai.y) {
					this.ball.x = (this.ai.x - this.ball.width);
					this.ball.moveX = DIRECTION.LEFT;
				}
			}
		}

		// Handle the end of round transition
		// Check to see if the player won the round.
		if (this.player.score === 1 || (this.players === 1 && (this.playerTop.score === 1 || this.playerBottom.score === 1))) {
			this.over = true;
			match_result = true;
			setTimeout(function () { Pong.endGameMenu('Winner!'); }, 1000);
		}

		// Check to see if the ai/AI or player2 has won the round.
		if ((this.ai && this.ai.score === 1) || (this.player2 && this.player2.score === 1)) {
			this.over = true;
			match_result = false;
			setTimeout(function () { Pong.endGameMenu('Game Over!'); }, 1000);
		}
	},

	// Draw the objects to the canvas element
	draw: function () {
		// Clear the Canvas
		this.context.clearRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		// Set the fill style to black
		this.context.fillStyle = this.bgColor;

		// Draw the background
		this.context.fillRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		// Set the fill style for the paddles
		this.context.fillStyle = this.paddleColor;

		// Draw the Player
		this.context.fillRect(
			this.player.x,
			this.player.y,
			this.player.width,
			this.player.height
		);

		if (this.player2) {
			// Draw the Player 2
			this.context.fillRect(
				this.player2.x,
				this.player2.y,
				this.player2.width,
				this.player2.height
			);
		} else if (this.ai) {
			// Draw the Ai
			this.context.fillRect(
				this.ai.x,
				this.ai.y,
				this.ai.width,
				this.ai.height
			);
		}

		if (this.playerTop) {
			// Draw the Top Player
			this.context.fillRect(
				this.playerTop.x,
				this.playerTop.y,
				this.playerTop.width,
				this.playerTop.height
			);
		}

		if (this.playerBottom) {
			// Draw the Bottom Player
			this.context.fillRect(
				this.playerBottom.x,
				this.playerBottom.y,
				this.playerBottom.width,
				this.playerBottom.height
			);
		}

		// Draw the Ball
		this.context.fillStyle = this.ballColor;

		if (Pong._turnDelayIsOver.call(this)) {
			this.context.fillRect(
				this.ball.x,
				this.ball.y,
				this.ball.width,
				this.ball.height
			);
		}

		// Draw the net (Line in the middle)
		this.context.beginPath();
		this.context.setLineDash([7, 15]);
		this.context.moveTo((this.canvas.width / 2), this.canvas.height - 140);
		this.context.lineTo((this.canvas.width / 2), 140);
		this.context.lineWidth = 10;
		this.context.strokeStyle = '#ffffff';
		this.context.stroke();

		// Set the default canvas font and align it to the center
		this.context.font = '100px Courier New';
		this.context.textAlign = 'center';

		// Draw the players score (left)
		this.context.fillText(
			this.player.score.toString(),
			(this.canvas.width / 2) - 300,
			200
		);

		// Draw the paddles score (right)
		if (this.player2) {
			this.context.fillText(
				this.player2.score.toString(),
				(this.canvas.width / 2) + 300,
				200
			);
		} else if (this.ai) {
			this.context.fillText(
				this.ai.score.toString(),
				(this.canvas.width / 2) + 300,
				200
			);
		}

		// Draw the top and bottom players score
		if (this.playerTop) {
			this.context.fillText(
				this.playerTop.score.toString(),
				(this.canvas.width / 2),
				100
			);
		}
		if (this.playerBottom) {
			this.context.fillText(
				this.playerBottom.score.toString(),
				(this.canvas.width / 2),
				this.canvas.height - 50
			);
		}

		// Change the font size for the center score text
		this.context.font = '30px Courier New';

		// Draw the winning score (center)
		this.context.fillText(
			'Round ' + (Pong.round + 1),
			(this.canvas.width / 2),
			35
		);

		// Change the font size for the center score value
		this.context.font = '40px Courier';

		// Draw the current round number
		// this.context.fillText(
		//     rounds[Pong.round] ? rounds[Pong.round] : rounds[Pong.round - 1],
		//     (this.canvas.width / 2),
		//     100
		// );
		if (this.ai)
			this.drawFutureTrajectory();




		////////agora

		this.context.font = '100px Courier New';
		this.context.textAlign = 'center';
		
		// Draw player names above scores with smaller font
		this.context.font = '40px Courier New';
		this.context.fillText(
			this.player1Name,
			(this.canvas.width / 2) - 300,
			120  // Position above the score
		);
	
		// Draw the right side player name (AI or Player 2)
		this.context.fillText(
			this.player2Name,
			(this.canvas.width / 2) + 300,
			120  // Position above the score
		);
	
		// Draw scores with larger font
		this.context.font = '100px Courier New';
		// Draw the players score (left)
		this.context.fillText(
			this.player.score.toString(),
			(this.canvas.width / 2) - 300,
			200
		);
	
		// Draw the paddles score (right)
		if (this.player2) {
			this.context.fillText(
				this.player2.score.toString(),
				(this.canvas.width / 2) + 300,
				200
			);
		} else if (this.ai) {
			this.context.fillText(
				this.ai.score.toString(),
				(this.canvas.width / 2) + 300,
				200
			);
		}
	
		// ... (keep rest of the existing drawing code) ...
		
		// Update endGameMenu display
		this.context.font = '30px Courier New';
		this.context.fillText(
			'Round ' + (Pong.round + 1),
			(this.canvas.width / 2),
			35
		);
	},

	drawFutureTrajectory: function () {
		const futurePositions = this.calculateFutureIntersections();
		this.context.fillStyle = 'red';

		futurePositions.forEach(pos => {
			this.context.beginPath();
			this.context.arc(pos.x, pos.y, 5, 0, Math.PI * 2, false);
			this.context.fill();
		});
	},

	calculateFutureIntersections: function () {
		let futureX = this.ball.x;
		let futureY = this.ball.y;
		let futurePositions = [];

		let moveX = this.ball.moveX;
		let moveY = this.ball.moveY;

		while (futureX > 0 && futureX < this.canvas.width) {
			if (futureY <= 0) moveY = DIRECTION.DOWN;
			if (futureY >= this.canvas.height) moveY = DIRECTION.UP;

			futureX += (moveX === DIRECTION.LEFT ? -this.ball.speed : this.ball.speed);
			futureY += (moveY === DIRECTION.UP ? -this.ball.speed : this.ball.speed);

			if (futureX <= this.player.x + this.player.width && futureX >= this.player.x) {
				futurePositions.push({ x: futureX, y: futureY });
			}

			if (futureX >= this.ai.x - this.ai.width && futureX <= this.ai.x) {
				futurePositions.push({ x: futureX, y: futureY });
			}
		}

		return futurePositions;
	},

	loop: function () {

		Pong.update();
		Pong.draw();
		console.log("ignored - looping here");

		
		if (!Pong.over) requestAnimationFrame(Pong.loop);
	},

	listen: function (players) {
		document.addEventListener('keydown', function (key) {
			// Handle the 'Press any key to begin' function and start the game.
			if ([32, 37, 38, 39, 40, 65, 68, 83, 87].includes(key.keyCode)) {
				key.preventDefault();
			}
			if (Pong.running === false) {
				console.log('running');
				Pong.running = true;
				window.requestAnimationFrame(Pong.loop);
			}

			// Handle up arrow and w key events
			if (key.keyCode === 87) Pong.player.move = DIRECTION.UP;
			if (key.keyCode === 83) Pong.player.move = DIRECTION.DOWN;

			// Handle right player with up and down arrows
			if (key.keyCode === 38) Pong.player2.move = DIRECTION.UP;
			if (key.keyCode === 40) Pong.player2.move = DIRECTION.DOWN;

			// Handle left and right arrow and a, d key events for 4 player mode
			if (key.keyCode === 65 && players == 4) Pong.playerTop.move = DIRECTION.LEFT; // A
			if (key.keyCode === 68 && players == 4) Pong.playerTop.move = DIRECTION.RIGHT; // D
			if (key.keyCode === 37 && players == 4) Pong.playerBottom.move = DIRECTION.LEFT; // Left arrow
			if (key.keyCode === 39 && players == 4) Pong.playerBottom.move = DIRECTION.RIGHT; // Right arrow
		});

		// Stop the player from moving when there are no keys being pressed.
		document.addEventListener('keyup', function (key) {
			if (key.keyCode === 87 || key.keyCode === 83) Pong.player.move = DIRECTION.IDLE;
			if (key.keyCode === 38 || key.keyCode === 40) Pong.player2.move = DIRECTION.IDLE;

			if (players == 4) {
				if (key.keyCode === 65 || key.keyCode === 68) Pong.playerTop.move = DIRECTION.IDLE;
				if (key.keyCode === 37 || key.keyCode === 39) Pong.playerBottom.move = DIRECTION.IDLE;
			}
		});
	},

	// Reset the ball location, the player turns and set a delay before the next round begins.
	_resetTurn: function(victor, loser) {
		this.ball = Ball.new.call(this, this.ball.speed);
		this.turn = loser;
		this.timer = (new Date()).getTime();

		victor.score++;
	},

	// Wait for a delay to have passed after each turn.
	_turnDelayIsOver: function() {
		return ((new Date()).getTime() - this.timer >= 1000);
	}
};

function cleanupPongGame() {
    if (Pong) {
        // Stop animation frame
        if (Pong.animationFrameId) {
            cancelAnimationFrame(Pong.animationFrameId);
            Pong.animationFrameId = null;
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', Pong.keyDownHandler);
        document.removeEventListener('keyup', Pong.keyUpHandler);
        
        // Clear the canvas if it exists
        if (Pong.canvas && Pong.context) {
            Pong.context.clearRect(0, 0, Pong.canvas.width, Pong.canvas.height);
        }
        
        // Reset game state
        Pong.running = false;
        Pong.over = true;
        Pong = null;
    }
}

var Pong = null;
function startGame(players, ballColor, bgColor, paddleColor, player1, player2) {
    return new Promise((resolve) => {
        cleanupPongGame();
        Pong = Object.assign({}, Game);
        
        Pong.player1Name = player1;
        Pong.player2Name = player2;
        
        const originalInit = Pong.initialize;
        Pong.initialize = function(players, ballColor, bgColor, paddleColor) {
            originalInit.call(this, players, ballColor, bgColor, paddleColor);
            this.player1Name = player1;
            this.player2Name = player2;
        };
        
        const originalEndGameMenu = Pong.endGameMenu;
        Pong.endGameMenu = function(text) {
            originalEndGameMenu.call(this, text);
            
            let winner;
            let score;
            
            if (this.player.score > (this.ai ? this.ai.score : this.player2.score)) {
                winner = this.player1Name;
                score = `${this.player.score}-${this.ai ? this.ai.score : this.player2.score}`;
            } else {
                winner = this.player2Name;
                score = `${this.ai ? this.ai.score : this.player2.score}-${this.player.score}`;
            }
            
            // Determine which match we're in and set the appropriate score
            if (!tournamentMatch.quarter1.score) {
                tournamentMatch.quarter1.score = score;
            } else if (!tournamentMatch.quarter2.score) {
                tournamentMatch.quarter2.score = score;
            } else {
                tournamentMatch.finals.score = score;
            }
            
            setTimeout(() => {
                resolve(winner);
            }, 1000);
        };
        
        Pong.initialize(players, ballColor, bgColor, paddleColor);
    });
}


document.getElementById('startGameButton').addEventListener('click', async function () {
	selectedPlayers = 2; // tornomentao is always 1
	
	ballColor = document.getElementById('ballColor').value;
	bgColor = document.getElementById('bgColor').value;
	paddleColor = document.getElementById('paddleColor').value;
	gameMode = document.getElementById('gameMode').value;
	p1 = document.getElementById("challenger1").value;
	p2 = document.getElementById("challenger2").value;
	p3 = document.getElementById("challenger3").value;


	console.log('Starting game with the following settings:');
	console.log('Players:', selectedPlayers); //chatgtp, local v1, multiplayer
	console.log('Ball Color:', ballColor);
	console.log('Background Color:', bgColor);
	console.log('Paddle Color:', paddleColor);
	console.log("players: " + p1 + " " + p2 + " " + p3);



	if (!p1 || p1.trim() === "" || !p2 || p2.trim() === "" || !p3 || p3.trim() === "") {
		let divzininha = document.getElementById("divget");
		divzininha.innerHTML = `
			<div class="alert alert-danger" role="alert">
				Please enter names for all challengers!
				<span style="color: #00ff88; text-shadow: 0 0 10px #00ff88">
					⚠️ All challenger names are required
				</span>
			</div>
		`;
		divzininha.style.marginTop = "10px";
		
		setTimeout(() => {
			divzininha.innerHTML = '';
		}, 3000);


	}else{
		document.getElementById('navs').style.display = 'none';
		tournamentMatch.quarter1.p1 = p1;
		tournamentMatch.quarter1.p2 = p3;

		tournamentMatch.quarter2.p1 = usernick;
		tournamentMatch.quarter2.p2 = p2;
	
		preGameMode();
		
		await new Promise(resolve => setTimeout(resolve, 3000));

		displayNextMatch(p1, p3);

		await new Promise(resolve => setTimeout(resolve, 3000));

		setGameCanva();

		tournamentMatch.quarter1.w = await startGame(selectedPlayers, ballColor, bgColor, paddleColor, p1, p3);
		console.log("Match winner: Q1", tournamentMatch.quarter1.w);
		await new Promise(resolve => setTimeout(resolve, 3000));

		displayNextMatch(usernick, p2);
		await new Promise(resolve => setTimeout(resolve, 3000));

		setGameCanva();

		tournamentMatch.quarter2.w = await startGame(selectedPlayers, ballColor, bgColor, paddleColor, usernick, p2);
		console.log("Match winner: Q1", tournamentMatch.quarter2.w);

		await new Promise(resolve => setTimeout(resolve, 3000));
		displayNextMatch(tournamentMatch.quarter1.w, tournamentMatch.quarter2.w);
		tournamentMatch.finals.p1 = tournamentMatch.quarter1.w;
		tournamentMatch.finals.p2 = tournamentMatch.quarter2.w;
		await new Promise(resolve => setTimeout(resolve, 3000));

		setGameCanva();

		tournamentMatch.finals.w = await startGame(selectedPlayers, ballColor, bgColor, paddleColor, tournamentMatch.quarter1.w, tournamentMatch.quarter2.w);
		
		console.log("Winner: ", tournamentMatch.finals.w);
		console.log("q1 score -> ", tournamentMatch.quarter1.score);
		console.log("q2 score ->", tournamentMatch.quarter2.score);
		await new Promise(resolve => setTimeout(resolve, 3000));

		const csrftoken = getCookie('csrftoken');
		try{
			const response = await fetch('https://localhost:1443/api/endTour/', {
				method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                credentials: 'include', 
                body: JSON.stringify(tournamentMatch),

			});

			if(response.ok){
				const data = await response.json();
				console.log(data);
				transview = "0x" + data.transaction_hash;
				const container = document.querySelector('.container');
				container.innerHTML = `
				<div class="text-center mt-5">
					<div class="tournament-bracket">
						<h2 class="bracket-title" style="font-size: 2em; margin-bottom: 1.5rem;">
							Tournament Recorded Successfully!
						</h2>
						
						<div style="background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,255,136,0.1) 50%, rgba(0,0,0,0.8) 100%); 
									padding: 2rem; 
									border: 2px solid #00ff88; 
									border-radius: 8px;
									max-width: 800px;
									margin: 0 auto;">
							
							<div style="margin-bottom: 2rem;">
								<h3 style="font-family: 'Orbitron', sans-serif; 
										 color: #00ff88;
										 text-shadow: 0 0 10px #00ff88;
										 margin-bottom: 0.5rem;">
									Transaction Hash:
								</h3>
								<p style="font-family: 'Consolas', monospace;
										 background-color: rgba(0,0,0,0.5);
										 padding: 1rem;
										 border: 1px solid #00ff88;
										 border-radius: 4px;
										 word-break: break-all;
										 color: #fff;
										 text-shadow: 0 0 5px #00ff88;">
									${data.transaction_hash}
								</p>
							</div>
			
							<div style="display: flex;
									   justify-content: space-around;
									   margin: 2rem 0;
									   font-family: 'Orbitron', sans-serif;">
								<div>
									<h3 style="color: #00ff88;
											 text-shadow: 0 0 10px #00ff88;">
										Winner
									</h3>
									<p style="color: #fff;
											text-shadow: 0 0 10px #00ff88;
											font-size: 1.5em;">
										${data.winner}
									</p>
								</div>
								<div>
									<h3 style="color: #00ff88;
											 text-shadow: 0 0 10px #00ff88;">
										Final Score
									</h3>
									<p style="color: #fff;
											text-shadow: 0 0 10px #00ff88;
											font-size: 1.5em;">
										${data.score}
									</p>
								</div>
							</div>
			
							<a href="https://sepolia.etherscan.io/tx/${transview}" 
							   target="_blank" 
							   style="display: inline-block;
									  font-family: 'Orbitron', sans-serif;
									  color: #00ff88;
									  background: transparent;
									  padding: 0.75rem 2rem;
									  border: 2px solid #00ff88;
									  border-radius: 4px;
									  text-decoration: none;
									  margin-top: 1rem;
									  text-shadow: 0 0 10px #00ff88;
									  transition: all 0.3s ease;
									  animation: glow 1.5s ease-in-out infinite alternate;"
							   onmouseover="this.style.backgroundColor='rgba(0,255,136,0.2)'"
							   onmouseout="this.style.backgroundColor='transparent'">
								View on Etherscan
							</a>
							<a onclick="window.go('profile')" 
							   target="_blank" 
							   style="display: inline-block;
									  font-family: 'Orbitron', sans-serif;
									  color: #00ff88;
									  background: transparent;
									  padding: 0.75rem 2rem;
									  border: 2px solid #00ff88;
									  border-radius: 4px;
									  text-decoration: none;
									  margin-top: 1rem;
									  text-shadow: 0 0 10px #00ff88;
									  transition: all 0.3s ease;
									  animation: glow 1.5s ease-in-out infinite alternate;"
							   onmouseover="this.style.backgroundColor='rgba(0,255,136,0.2)'"
							   onmouseout="this.style.backgroundColor='transparent'" data-link>
								Back to Profile
							</a>
						</div>
					</div>
				</div>
			`;
			}else{
				const errorData = await response.json();
				console.log(errorData);
			}

		}catch(error){
			console.log(error);
		}

	}
	
});

function setGameCanva(){
		const containerMod1 = document.querySelector('.container');
		containerMod1.innerHTML = "";
		const container = document.querySelector('.container');
		container.innerHTML = '<canvas id="gameCanvas" class = "centered-div"></canvas>';
		const canvas = document.getElementById('gameCanvas');
		canvas.style.display = 'block';
}

function displayNextMatch(player1, player2) {
    const containerMod = document.querySelector('.container');
    containerMod.innerHTML = `
    <div class="tournament-bracket">
        <h1 class="bracket-title">Next Match: </h1>
        <div class="bracket-container">
            <div class="semifinal-matches">
                <div class="match match-1">
                    <div class="player player-top challenger-style">${player1}</div>
                    <div class="vs">VS</div>
                    <div class="player player-bottom challenger-style">${player2}</div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function preGameMode(){
	const container = document.querySelector('.container');
	container.innerHTML = `
	<div class="tournament-bracket">
		<h1 class="bracket-title">Semi Finals</h1>
		<div class="bracket-container">
			<div class="semifinal-matches">
				<div class="match match-1">
					<div class="player player-top challenger-style">${p1}</div>
					<div class="vs">VS</div>
					<div class="player player-bottom challenger-style">${p3}</div>
				</div>
				<div class="match match-2">
					<div class="player player-top challenger-style">${p2}</div>
					<div class="vs">VS</div>
					<div class="player player-bottom challenger-style">${usernick}</div>
				</div>
			</div>
			<div class="final-match">
				<div class="final-text">FINALS</div>
				<div class="player-placeholder">Winner Match 1</div>
				<div class="vs">VS</div>
				<div class="player-placeholder">Winner Match 2</div>
			</div>
		</div>
	</div>
	`;
	
}