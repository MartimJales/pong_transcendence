const DIRECTION = {
	IDLE: 0,
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4
};


export class GamePage extends BaseComponent {

	constructor(){
		super("static/html/game.html")
	}
	onkeyup = this.keyup.bind(this);
	onkeydown = this.keydown.bind(this);

	loopId = -1;
	Pong = {};
	Paddle = {};
	Ball = {};
	gameMode;
	match_result;

	flag = 0;

	mode = "";
	selectedPlayers = 1;
	

	onInit(){
		this.mode =  window.location.href.includes("?") ? new URLSearchParams(new URL(window.location.href).search) : {};
		if (this.mode == "multiplayer")
			this.selectedPlayers = 4

	// The ball object (The cube that bounces back and forth)
	this.Ball = {
		new:  (incrementedSpeed) => {
			return {
				width: 18,
				height: 18,
				x: (this.Pong.canvas.width / 2) - 9,
				y: (this.Pong.canvas.height / 2) - 9,
				moveX: DIRECTION.IDLE,
				moveY: DIRECTION.IDLE,
				speed: incrementedSpeed || 7
			};
		}
	};

	// The paddle object (The lines that move up and down or left and right)
	this.Paddle = {
		new:  (side) => {
			if (side === 'left' || side === 'right') {
				return {
					width: 18,
					height: 180,
					x: side === 'left' ? 150 : this.Pong.canvas.width - 150,
					y: (this.Pong.canvas.height / 2) - 35,
					score: 0,
					move: DIRECTION.IDLE,
					speed: 8
				};
			} else if (side === 'top' || side === 'bottom') {
				return {
					width: 180,
					height: 18,
					x: (this.Pong.canvas.width / 2) - 90,
					y: side === 'top' ? 150 : this.Pong.canvas.height - 150,
					score: 0,
					move: DIRECTION.IDLE,
					speed: 8
				};
			}
		}
	};

	this.Pong = {
		initialize:  (players, ballColor, bgColor, paddleColor) => {
			this.Pong.canvas= document.querySelector('canvas');
			this.Pong.context= this.Pong.canvas.getContext('2d');
			this.Pong.players = players

			this.Pong.canvas.width = 1400;
			this.Pong.canvas.height = 1000;

			this.Pong.canvas.style.width = (this.Pong.canvas.width / 2) + 'px';
			this.Pong.canvas.style.height = (this.Pong.canvas.height / 2) + 'px';

			this.Pong.player = this.Paddle.new.call(this.Pong, 'left');
			this.Pong.ai = (players == 1) ? this.Paddle.new.call(this.Pong, 'right') : null;
			this.Pong.player2 = (players == 2 || players == 4) ? this.Paddle.new.call(this.Pong, 'right') : null;
			
			if (players == 4) {
				this.Pong.playerTop = this.Paddle.new.call(this.Pong, 'top');
				this.Pong.playerBottom = this.Paddle.new.call(this.Pong, 'bottom');
				this.Pong.players = 4;
			}
			
			this.Pong.ball = this.Ball.new.call(this.Pong);

			if (this.Pong.ai) this.Pong.ai.speed = 5;
			this.Pong.running = this.Pong.over = false;
			this.Pong.turn = this.Pong.ai || this.Pong.player2;
			this.Pong.timer = this.Pong.round = 0;
			this.Pong.bgColor = bgColor;
			this.Pong.ballColor = ballColor;
			this.Pong.paddleColor = paddleColor;

			this.Pong.menu();
			this.Pong.listen(players);
		},

		menu:  () => {
			// Draw all the this.Pong objects in their current state
			this.Pong.draw();

			// Change the canvas font size and color
			this.Pong.context.font = '50px Courier New';
			this.Pong.context.fillStyle = this.Pong.bgColor;

			// Draw the rectangle behind the 'Press any key to begin' text.
			this.Pong.context.fillRect(
				this.Pong.canvas.width / 2 - 350,
				this.Pong.canvas.height / 2 - 48,
				700,
				100
			);

			// Change the canvas color;
			this.Pong.context.fillStyle = this.Pong.ballColor;

			// Draw the 'press any key to begin' text
			this.Pong.context.fillText('Press any key to begin',
				this.Pong.canvas.width / 2,
				this.Pong.canvas.height / 2 + 15
			);
		},

		endGameMenu:  (text) => {
			// Preparar os dados do jogo para enviar
			const gameData = {
				player_id: "host", 
				player2_id: null, // this.Pong.player2 ? 2
				earned_points: this.match_result ? 15 : 0,
				mode: this.gameMode, // TO-DO: Temos que sacar da pagina anterior ou url
				opponent: this.Pong.ai ? 'Chatgtp' : 'Local Challenger',  // Define o oponente
				result: this.match_result, // True se o jogador ganhou, False se perdeu
				match_date: new Date().toISOString()  // Data e hora atual em formato ISO
			};

			const csrftoken = window.getCookie('csrftoken');
			if(!this.flag){
				this.flag++;
				fetch('https://localhost:1443/api/game_local/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': csrftoken
					},
					credentials: 'include',
					body: JSON.stringify(gameData)
				})
				.then(response => response.json())  // Change this to .json()
				.then(data => {
					if (data.status === 'success') {
						Router.go('profile');
					} else {
						console.log('Error saving match data:', data.message);
					}
				})
				.catch((error) => {
					console.log('Error:', error);
			}); }
		
			
			// Resto do código de exibição do menu de fim de jogo
			this.Pong.context.font = '45px Courier New';
			this.Pong.context.fillStyle = this.Pong.bgColor;
		
			this.Pong.context.fillRect(
				this.Pong.canvas.width / 2 - 350,
				this.Pong.canvas.height / 2 - 48,
				700,
				100
			);
		
			this.Pong.context.fillStyle = '#ffffff';
		
			this.Pong.context.fillText(text,
				this.Pong.canvas.width / 2,
				this.Pong.canvas.height / 2 + 15
			);
		
			//setTimeout(function () {
			//	window.location.href = 'game';
			//}, 1000);
		},

		// Update all objects (move the player, ai, ball, increment the score, etc.)
		update:  () => {
			if (!this.over) {
				// Calculate future intersections
				var targetPosition;

				if (this.Pong.ai) {
					if (this.Pong.ball.moveX == DIRECTION.RIGHT) {
						let futureIntersections = this.Pong.calculateFutureIntersections();
						if (futureIntersections.length > 0) {
							// Set the first future intersection as the target position for the AI
							targetPosition = futureIntersections[0].y;
						}
					}
				}
				if (this.Pong.players != 4) {		
					if (this.Pong.ball.y <= 0) this.Pong.ball.moveY = DIRECTION.DOWN;
					if (this.Pong.ball.y >= this.Pong.canvas.height - this.Pong.ball.height) this.Pong.ball.moveY = DIRECTION.UP;
				}
				// If the ball collides with the bound limits - correct the x and y coords.
				if (this.Pong.ball.x <= 0) this.Pong._resetTurn.call(this, this.Pong.ai || this.Pong.player2, this.Pong.player);
				if (this.Pong.ball.x >= this.Pong.canvas.width - this.Pong.ball.width) this.Pong._resetTurn.call(this, this.Pong.player, this.Pong.ai || this.Pong.player2);
				if (this.Pong.players === 4) {
					if (this.Pong.ball.y <= 0) this.Pong._resetTurn.call(this, this.Pong.playerBottom, this.Pong.playerTop);
					if (this.Pong.ball.y >= this.Pong.canvas.height - this.Pong.ball.height) this.Pong._resetTurn.call(this, this.Pong.playerTop, this.Pong.playerBottom);
				}
				// Move player if their move value was updated by a keyboard event
				if (this.Pong.player.move === DIRECTION.UP) this.Pong.player.y -= this.Pong.player.speed;
				else if (this.Pong.player.move === DIRECTION.DOWN) this.Pong.player.y += this.Pong.player.speed;

				if (this.Pong.player2 && this.Pong.player2.move === DIRECTION.UP) this.Pong.player2.y -= this.Pong.player2.speed;
				else if (this.Pong.player2 && this.Pong.player2.move === DIRECTION.DOWN) this.Pong.player2.y += this.Pong.player2.speed;

				// Movimentos das pás superiores e inferiores no modo de 4 jogadores
				if (this.Pong.playerTop && this.Pong.playerTop.move === DIRECTION.LEFT) this.Pong.playerTop.x -= this.Pong.playerTop.speed;
				else if (this.Pong.playerTop && this.Pong.playerTop.move === DIRECTION.RIGHT) this.Pong.playerTop.x += this.Pong.playerTop.speed;

				if (this.Pong.playerBottom && this.Pong.playerBottom.move === DIRECTION.LEFT) this.Pong.playerBottom.x -= this.Pong.playerBottom.speed;
				else if (this.Pong.playerBottom && this.Pong.playerBottom.move === DIRECTION.RIGHT) this.Pong.playerBottom.x += this.Pong.playerBottom.speed;

				// Restringir o movimento do playerBottom dentro dos limites do canvas
				if (this.Pong.playerBottom){
					if (this.Pong.playerBottom.x <= 0) this.Pong.playerBottom.x = 0;
					else if (this.Pong.playerBottom.x + this.Pong.playerBottom.width >= this.Pong.canvas.width) this.Pong.playerBottom.x = this.Pong.canvas.width - this.Pong.playerBottom.width;
				}
				// On new serve (start of each turn) move the ball to the correct side
				// and randomize the direction to add some challenge.
				if (this.Pong._turnDelayIsOver.call(this) && this.Pong.turn) {
					this.Pong.ball.moveX = this.Pong.turn === this.Pong.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
					this.Pong.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
					this.Pong.ball.y = this.Pong.canvas.height/2;
					this.Pong.turn = null;
				}

				// If the player collides with the bound limits, update the x and y coords.
				if (this.Pong.player.y <= 0) this.Pong.player.y = 0;
				else if (this.Pong.player.y >= (this.Pong.canvas.height - this.Pong.player.height)) this.Pong.player.y = (this.Pong.canvas.height - this.Pong.player.height);

				if (this.Pong.player2 && this.Pong.player2.y <= 0) this.Pong.player2.y = 0;
				else if (this.Pong.player2 && this.Pong.player2.y >= (this.Pong.canvas.height - this.Pong.player2.height)) this.Pong.player2.y = (this.Pong.canvas.height - this.Pong.player2.height);

				// Limites de movimento das pás superior e inferior
				if (this.Pong.playerTop && this.Pong.playerTop.x <= 0) this.Pong.playerTop.x = 0;
				else if (this.Pong.playerTop && this.Pong.playerTop.x >= (this.Pong.canvas.width - this.Pong.playerTop.width)) this.Pong.playerTop.x = (this.Pong.canvas.width - this.Pong.playerTop.width);

				if (this.Pong.playerBottom && this.Pong.playerBottom.y <= 0) this.Pong.playerBottom.y = 0;
				else if (this.Pong.playerBottom && this.Pong.playerBottom.y >= (this.Pong.canvas.height - this.Pong.playerBottom.height)) this.Pong.playerBottom.y = (this.Pong.canvas.height - this.Pong.playerBottom.height);

				// Move ball in intended direction based on moveY and moveX values
				if (this.Pong.ball.moveY === DIRECTION.UP) this.Pong.ball.y -= (this.Pong.ball.speed);
				else if (this.Pong.ball.moveY === DIRECTION.DOWN) this.Pong.ball.y += (this.Pong.ball.speed);
				if (this.Pong.ball.moveX === DIRECTION.LEFT) this.Pong.ball.x -= this.Pong.ball.speed;
				else if (this.Pong.ball.moveX === DIRECTION.RIGHT) this.Pong.ball.x += this.Pong.ball.speed;

				// Handle ai (AI) UP and DOWN movement based on future intersection
				if (this.Pong.ai) {
					if (targetPosition !== null) {
						const aiCenter = this.Pong.ai.y + this.Pong.ai.height / 2;

						if (aiCenter > targetPosition) {
							this.Pong.ai.y -= this.Pong.ai.speed;
							if (this.Pong.ai.y + this.Pong.ai.height / 2 <= targetPosition) {
								this.Pong.ai.y = targetPosition - this.Pong.ai.height / 2;
							}
						} else if (aiCenter < targetPosition) {
							this.Pong.ai.y += this.Pong.ai.speed;
							if (this.Pong.ai.y + this.Pong.ai.height / 2 >= targetPosition) {
								this.Pong.ai.y = targetPosition - this.Pong.ai.height / 2;
							}
						}
					}

					// Handle ai (AI) wall collision
					if (this.Pong.ai.y >= this.Pong.canvas.height - this.Pong.ai.height) this.Pong.ai.y = this.Pong.canvas.height - this.Pong.ai.height;
					else if (this.Pong.ai.y <= 0) this.Pong.ai.y = 0;
				}

				// Handle Player-Ball collisions
				if (this.Pong.ball.x - this.Pong.ball.width <= this.Pong.player.x && this.Pong.ball.x >= this.Pong.player.x - this.Pong.player.width) {
					if (this.Pong.ball.y <= this.Pong.player.y + this.Pong.player.height && this.Pong.ball.y + this.Pong.ball.height >= this.Pong.player.y) {
						this.Pong.ball.x = (this.Pong.player.x + this.Pong.ball.width);
						this.Pong.ball.moveX = DIRECTION.RIGHT;
					}
				}

				if (this.Pong.player2 && this.Pong.ball.x - this.Pong.ball.width <= this.Pong.player2.x && this.Pong.ball.x >= this.Pong.player2.x - this.Pong.player2.width) {
					if (this.Pong.ball.y <= this.Pong.player2.y + this.Pong.player2.height && this.Pong.ball.y + this.Pong.ball.height >= this.Pong.player2.y) {
						this.Pong.ball.x = (this.Pong.player2.x - this.Pong.ball.width);
						this.Pong.ball.moveX = DIRECTION.LEFT;
					}
				}

				// Handle collisions with the new paddles in 4-player mode
				if (this.Pong.playerTop && this.Pong.ball.y - this.Pong.ball.height <= this.Pong.playerTop.y && this.Pong.ball.y >= this.Pong.playerTop.y - this.Pong.playerTop.height) {
					if (this.Pong.ball.x <= this.Pong.playerTop.x + this.Pong.playerTop.width && this.Pong.ball.x + this.Pong.ball.width >= this.Pong.playerTop.x) {
						this.Pong.ball.y = this.Pong.playerTop.y + this.Pong.ball.height;
						this.Pong.ball.moveY = DIRECTION.DOWN;
					}
				}

				if (this.Pong.playerBottom && this.Pong.ball.y + this.Pong.ball.height >= this.Pong.playerBottom.y && this.Pong.ball.y <= this.Pong.playerBottom.y + this.Pong.playerBottom.height) {
					if (this.Pong.ball.x <= this.Pong.playerBottom.x + this.Pong.playerBottom.width && this.Pong.ball.x + this.Pong.ball.width >= this.Pong.playerBottom.x) {
						this.Pong.ball.y = this.Pong.playerBottom.y - this.Pong.ball.height;
						this.Pong.ball.moveY = DIRECTION.UP;
					}
				}

				// Handle ai-ball collision
				if (this.Pong.ai && this.Pong.ball.x - this.Pong.ball.width <= this.Pong.ai.x && this.Pong.ball.x >= this.Pong.ai.x - this.Pong.ai.width) {
					if (this.Pong.ball.y <= this.Pong.ai.y + this.Pong.ai.height && this.Pong.ball.y + this.Pong.ball.height >= this.Pong.ai.y) {
						this.Pong.ball.x = (this.Pong.ai.x - this.Pong.ball.width);
						this.Pong.ball.moveX = DIRECTION.LEFT;
					}
				}
			}

			// Handle the end of round transition
			// Check to see if the player won the round.
			if (this.Pong.player.score === 2 || (this.Pong.players === 4 && (this.Pong.playerTop.score === 2 || this.Pong.playerBottom.score === 5))) {
				this.over = true;
				this.match_result = true;
				setTimeout( () => { this.Pong.endGameMenu('Winner!'); }, 1000);
			}

			// Check to see if the ai/AI or player2 has won the round.
			if ((this.Pong.ai && this.Pong.ai.score === 2) || (this.Pong.player2 && this.Pong.player2.score === 2)) {
				this.over = true;
				this.match_result = false;
				setTimeout( () => { this.Pong.endGameMenu('Game Over!'); }, 1000);
			}
		},

		// Draw the objects to the canvas element
		draw:  () => {
			// Clear the Canvas
			this.Pong.context.clearRect(
				0,
				0,
				this.Pong.canvas.width,
				this.Pong.canvas.height
			);

			// Set the fill style to black
			this.Pong.context.fillStyle = this.Pong.bgColor;

			// Draw the background
			this.Pong.context.fillRect(
				0,
				0,
				this.Pong.canvas.width,
				this.Pong.canvas.height
			);

			// Set the fill style for the paddles
			this.Pong.context.fillStyle = this.Pong.paddleColor;

			// Draw the Player
			this.Pong.context.fillRect(
				this.Pong.player.x,
				this.Pong.player.y,
				this.Pong.player.width,
				this.Pong.player.height
			);

			if (this.Pong.player2) {
				// Draw the Player 2
				this.Pong.context.fillRect(
					this.Pong.player2.x,
					this.Pong.player2.y,
					this.Pong.player2.width,
					this.Pong.player2.height
				);
			} else if (this.Pong.ai) {
				// Draw the Ai
				this.Pong.context.fillRect(
					this.Pong.ai.x,
					this.Pong.ai.y,
					this.Pong.ai.width,
					this.Pong.ai.height
				);
			}

			if (this.Pong.playerTop) {
				// Draw the Top Player
				this.Pong.context.fillRect(
					this.Pong.playerTop.x,
					this.Pong.playerTop.y,
					this.Pong.playerTop.width,
					this.Pong.playerTop.height
				);
			}

			if (this.Pong.playerBottom) {
				// Draw the Bottom Player
				this.Pong.context.fillRect(
					this.Pong.playerBottom.x,
					this.Pong.playerBottom.y,
					this.Pong.playerBottom.width,
					this.Pong.playerBottom.height
				);
			}

			this.Pong.context.fillRect(
				this.Pong.ball.x,
				this.Pong.ball.y,
				this.Pong.ball.width,
				this.Pong.ball.height
			);

			// Draw the net (Line in the middle)
			this.Pong.context.beginPath();
			this.Pong.context.setLineDash([7, 15]);
			this.Pong.context.moveTo((this.Pong.canvas.width / 2), this.Pong.canvas.height - 140);
			this.Pong.context.lineTo((this.Pong.canvas.width / 2), 140);
			this.Pong.context.lineWidth = 10;
			this.Pong.context.strokeStyle = '#ffffff';
			this.Pong.context.stroke();

			// Set the default canvas font and align it to the center
			this.Pong.context.font = '100px Courier New';
			this.Pong.context.textAlign = 'center';

			this.Pong.context.fillStyle = ""
			// Draw the players score (left)
			this.Pong.context.fillText(
				this.Pong.player.score.toString(),
				(this.Pong.canvas.width / 2) - 300,
				200
			);

			// Draw the paddles score (right)
			if (this.Pong.player2) {
				this.Pong.context.fillText(
					this.Pong.player2.score.toString(),
					(this.Pong.canvas.width / 2) + 300,
					200
				);
			} else if (this.Pong.ai) {
				this.Pong.context.fillText(
					this.Pong.ai.score.toString(),
					(this.Pong.canvas.width / 2) + 300,
					200
				);
			}

			// Draw the top and bottom players score
			if (this.Pong.playerTop) {
				this.Pong.context.fillText(
					this.Pong.playerTop.score.toString(),
					(this.Pong.canvas.width / 2),
					100
				);
			}
			if (this.Pong.playerBottom) {
				this.Pong.context.fillText(
					this.Pong.playerBottom.score.toString(),
					(this.Pong.canvas.width / 2),
					this.Pong.canvas.height - 50
				);
			}

			// Change the font size for the center score text
			this.Pong.context.font = '30px Courier New';

			// Draw the winning score (center)
			this.Pong.context.fillStyle = 'white';
			this.Pong.context.fillText(
				'Round ' + (this.Pong.round + 1),
				(this.Pong.canvas.width / 2),
				35
			);

			// Change the font size for the center score value
			this.Pong.context.font = '40px Courier';

			// Draw the current round number
			// this.Pong.context.fillText(
			//     rounds[this.Pong.round] ? rounds[this.Pong.round] : rounds[this.Pong.round - 1],
			//     (this.Pong.canvas.width / 2),
			//     100
			// );
			if (this.Pong.ai)
				this.Pong.drawFutureTrajectory();
		},

		drawFutureTrajectory:   () => {
			const futurePositions =  this.Pong.calculateFutureIntersections();
			this.Pong.context.fillStyle = 'yellow';			
			futurePositions.forEach(pos => {
				this.Pong.context.beginPath();
				this.Pong.context.arc(pos.x, pos.y, 5, 0, Math.PI * 2, false);
				this.Pong.context.fill();
			});
		},	

		calculateFutureIntersections:  () => {
			// Inicializar variáveis de controlo se ainda não existirem
			if (!this.lastIntersectionCalculationTime) {
				this.lastIntersectionCalculationTime = 0;
			}
			if (!this.lastFuturePositions) {
				this.lastFuturePositions = [];
			}
		
			const now = Date.now(); // Hora atual em milissegundos

			// Verificar se passou 1 segundo desde a última chamada
			if (now - this.lastIntersectionCalculationTime < 2000 && this.Pong.ball.moveX != DIRECTION.RIGHT) {
				//console.warn("Function calculateFutureIntersections() is being called too frequently. Returning previous results.");
				return this.lastFuturePositions; // Retorna as posições calculadas previamente
			}
		
			// Atualizar o tempo da última chamada
			this.lastIntersectionCalculationTime = now;
		
			let futureX = this.Pong.ball.x;
			let futureY = this.Pong.ball.y;
			let futurePositions = [];
		
			let moveX = this.Pong.ball.moveX;
			let moveY = this.Pong.ball.moveY;
		
			while (futureX > 0 && futureX < this.Pong.canvas.width) {
				if (futureY <= 0) moveY = DIRECTION.DOWN;
				if (futureY >= this.Pong.canvas.height) moveY = DIRECTION.UP;
		
				futureX += (moveX === DIRECTION.LEFT ? -this.Pong.ball.speed : this.Pong.ball.speed);
				futureY += (moveY === DIRECTION.UP ? -this.Pong.ball.speed : this.Pong.ball.speed);
		
				if (futureX <= this.Pong.player.x + this.Pong.player.width && futureX >= this.Pong.player.x) {
					futurePositions.push({ x: futureX, y: futureY });
				}
		
				if (futureX >= this.Pong.ai.x - this.Pong.ai.width && futureX <= this.Pong.ai.x) {
					futurePositions.push({ x: futureX, y: futureY });
				}
			}
		
			// Atualizar as posições calculadas previamente
			this.lastFuturePositions = futurePositions;
		
			return futurePositions;
		},
		

		loop:  () => {
			this.Pong.update();
			this.Pong.draw();
			// If the game is not over, draw the next frame.
			if (!this.Pong.over)  this.loopId = requestAnimationFrame(this.Pong.loop);
		},

		listen:  (players) => {
			window.addEventListener('keydown',  this.onkeydown);
			window.addEventListener('keyup', this.onkeyup);
		},

		// Reset the ball location, the player turns and set a delay before the next round begins.
		_resetTurn: (victor, loser) => {
			this.Pong.ball = this.Ball.new.call(this, this.Pong.ball.speed);
			this.Pong.turn = loser;
			this.Pong.timer = (new Date()).getTime();

			victor.score++;
		},

		// Wait for a delay to have passed after each turn.
		_turnDelayIsOver: () => {
			return ((new Date()).getTime() - this.Pong.timer >= 1000);
		}
	};



this.getElementById('startGameButton').addEventListener('click', () => {
	if (this.querySelector('input[name="options"]:checked'))
		this.selectedPlayers = this.querySelector('input[name="options"]:checked').getAttribute('data-players');

	const ballColor = document.getElementById('ballColor').value;
	const bgColor = document.getElementById('bgColor').value;
	const paddleColor = document.getElementById('paddleColor').value;
	//userId = this.getElementById('userId').value;
	this.gameMode = document.getElementById('gameMode').value;
	
	// Limpar o conteúdo da div container e mostrar apenas o canvas
	const container = document.querySelector('.container');
	// container.innerHTML = '<canvas id="gameCanvas" class = "centered-div"></canvas>';
	// const canvas = document.getElementById('gameCanvas');
	// canvas.cl
	container.style.display = 'none';


	// Iniciar o jogo com as configurações selecionadas
	this.startGame(this.selectedPlayers, ballColor, bgColor, paddleColor);	
	});
	}

	startGame(players, ballColor, bgColor, paddleColor) {
		this.Pong.initialize(players, ballColor, bgColor, paddleColor);
	}

	keydown(key){
		// Handle the 'Press any key to begin' function and start the game.
		if (this.Pong.running === false) {
			this.Pong.running = true;
			this.Pong.loop();
		}

		// Handle up arrow and w key events
		if (key.keyCode === 87) this.Pong.player.move = DIRECTION.UP;
		if (key.keyCode === 83) this.Pong.player.move = DIRECTION.DOWN;

		// Handle right player with up and down arrows
		if (this.Pong.players >= 2 && key.keyCode === 38) this.Pong.player2.move = DIRECTION.UP;
		if (this.Pong.players >= 2 && key.keyCode === 40) this.Pong.player2.move = DIRECTION.DOWN;

		// Handle left and right arrow and a, d key events for 4 player mode
		if (key.keyCode === 65 && this.Pong.players == 4) this.Pong.playerTop.move = DIRECTION.LEFT; // A
		if (key.keyCode === 68 && this.Pong.players == 4) this.Pong.playerTop.move = DIRECTION.RIGHT; // D
		if (key.keyCode === 37 && this.Pong.players == 4) this.Pong.playerBottom.move = DIRECTION.LEFT; // Left arrow
		if (key.keyCode === 39 && this.Pong.players == 4) this.Pong.playerBottom.move = DIRECTION.RIGHT; // Right arrow
	}

	keyup(key){
		if (key.keyCode === 87 || key.keyCode === 83) this.Pong.player.move = DIRECTION.IDLE;
		if (this.Pong.players >= 2 && (key.keyCode === 38 || key.keyCode === 40)) this.Pong.player2.move = DIRECTION.IDLE;

		if (this.Pong.players == 4) {
			if (key.keyCode === 65 || key.keyCode === 68) this.Pong.playerTop.move = DIRECTION.IDLE;
			if (key.keyCode === 37 || key.keyCode === 39) this.Pong.playerBottom.move = DIRECTION.IDLE;
		}
	}

	onExit(){
		this.Pong.over = true;
		if (this.loopId != -1) cancelAnimationFrame(this.loopId);
		window.removeEventListener('keyup', this.onkeyup);
		window.removeEventListener('keydown',  this.onkeydown);
	}

}



