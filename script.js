// Global Variables
var DIRECTION = {
	IDLE: 0,
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4
};

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

	endGameMenu: function (text) {
		// Change the canvas font size and color
		Pong.context.font = '45px Courier New';
		Pong.context.fillStyle = this.bgColor;

		// Draw the rectangle behind the 'Press any key to begin' text.
		Pong.context.fillRect(
			Pong.canvas.width / 2 - 350,
			Pong.canvas.height / 2 - 48,
			700,
			100
		);

		// Change the canvas color;
		Pong.context.fillStyle = '#ffffff';

		// Draw the end game menu text ('Game Over' and 'Winner')
		Pong.context.fillText(text,
			Pong.canvas.width / 2,
			Pong.canvas.height / 2 + 15
		);

		setTimeout(function () {
			window.location.href = 'game.html'; // redirecionar para a página inicial ou a página anterior
		}, 3000);
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
		if (this.player.score === 5 || (this.players === 4 && (this.playerTop.score === 5 || this.playerBottom.score === 5))) {
			this.over = true;
			setTimeout(function () { Pong.endGameMenu('Winner!'); }, 1000);
		}

		// Check to see if the ai/AI or player2 has won the round.
		if ((this.ai && this.ai.score === 5) || (this.player2 && this.player2.score === 5)) {
			this.over = true;
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

		// If the game is not over, draw the next frame.
		if (!Pong.over) requestAnimationFrame(Pong.loop);
	},

	listen: function (players) {
		document.addEventListener('keydown', function (key) {
			// Handle the 'Press any key to begin' function and start the game.
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

var Pong = null;
function startGame(players, ballColor, bgColor, paddleColor) {
	if (Pong && Pong.running) {
		return;
	}
	Pong = Object.assign({}, Game);
	Pong.initialize(players, ballColor, bgColor, paddleColor);
}

document.getElementById('startGameButton').addEventListener('click', function () {
	let selectedPlayers = 1; // Default to 1 player
	if (document.querySelector('input[name="options"]:checked'))
		selectedPlayers = document.querySelector('input[name="options"]:checked').getAttribute('data-players');

	const ballColor = document.getElementById('ballColor').value;
	const bgColor = document.getElementById('bgColor').value;
	const paddleColor = document.getElementById('paddleColor').value;

	console.log('Starting game with the following settings:');
	console.log('Players:', selectedPlayers);
	console.log('Ball Color:', ballColor);
	console.log('Background Color:', bgColor);
	console.log('Paddle Color:', paddleColor);

	// Limpar o conteúdo da div container e mostrar apenas o canvas
	const container = document.querySelector('.container');
	container.innerHTML = '<canvas id="gameCanvas" class = "centered-div"></canvas>';
	const canvas = document.getElementById('gameCanvas');
	canvas.style.display = 'block';

	// Iniciar o jogo com as configurações selecionadas
	startGame(selectedPlayers, ballColor, bgColor, paddleColor);
});
