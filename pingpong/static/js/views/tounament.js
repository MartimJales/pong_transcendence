export default class Game {
    constructor(params) {
        this.params = params;
    }

    async getHtml() {
        return `
            <div class="container">
                <div class="text-center mt-5">
                    <h1 id="pong-game" class="text-center">Pong Game</h1>
                    <div class="centered-div">
                        <div>
                            <p>Choose the number of players:</p>
                            <div class="btn-toolbar d-flex justify-content-center" role="toolbar">
                                <div id="playerButtons" class="btn-group btn-group-toggle" data-toggle="buttons">
                                    <input type="radio" class="btn-check" name="options" id="option1" autocomplete="off" checked data-players="1">
                                    <label class="btn btn-secondary" for="option1">vs chatgpt</label>

                                    <input type="radio" class="btn-check" name="options" id="option2" autocomplete="off" data-players="2">
                                    <label class="btn btn-secondary" for="option2">2</label>

                                    <input type="radio" class="btn-check" name="options" id="option4" autocomplete="off" data-players="4">
                                    <label class="btn btn-secondary" for="option4">4</label>
                                </div>
                            </div>
                            
                            <p class="mt-3">Choose the color of the ball:</p>
                            <input type="color" id="ballColor" value="#ffffff">
                            
                            <p class="mt-3">Choose the background color:</p>
                            <input type="color" id="bgColor" value="#000000">
                            
                            <p class="mt-3">Choose the color of the paddles:</p>
                            <input type="color" id="paddleColor" value="#ffffff">
                            
                            <div class="d-flex justify-content-center mt-3">
                                <button id="startGameButton" class="btn btn-primary">Start game</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async afterRender() {
        // We'll need to initialize the game here
        // For now, let's just add an event listener to the start game button
        document.getElementById('startGameButton').addEventListener('click', () => {
            console.log('Start game clicked');
            // Here you would initialize your Pong game
        });
    }
}