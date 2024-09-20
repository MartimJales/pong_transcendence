export default class Game {
    constructor(params) {
        this.params = params;
    }

    async getHtml() {
        return `
            <div class="container">
                <div class="text-center mt-5">
                    <h1 class="text-center">Pong Game</h1>
                    <div class="centered-div">
                        <br><br>
                        <h3>Choose the number of players</h3><br>
                        <div class="btn-toolbar d-flex justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
                            <div class="btn-group btn-group-toggle" data-toggle="buttons" id="playerButtons">
                                <label class="btn btn-secondary">
                                    <input type="radio" name="options" id="option1" data-players="1" autocomplete="off"> vs chatgtp
                                </label>
                                <label class="btn btn-secondary">
                                    <input type="radio" name="options" id="option2" data-players="2" autocomplete="off"> 2
                                </label>
                                <label class="btn btn-secondary">
                                    <input type="radio" name="options" id="option4" data-players="4" autocomplete="off"> 4
                                </label>
                            </div>
                        </div><br>
                        <h3>Choose the color of the ball</h3><br>
                        <form class="d-flex justify-content-center" >
                            <input type="color" class="form-control form-control-color" id="ballColor" value="#00CC00" title="Choose a color">
                        </form><br>
                        <h3>Choose the background color</h3><br>
                        <form class="d-flex justify-content-center">
                            <input type="color" class="form-control form-control-color" id="bgColor" value="#000000" title="Choose a color">
                        </form><br>
                        <h3>Choose the color of the paddles</h3><br>
                        <form class="d-flex justify-content-center">
                            <input type="color" class="form-control form-control-color" id="paddleColor" value="#00CC00" title="Choose a color">
                        </form><br>
                        <div class="d-flex justify-content-center">
                            <button type="button" class="btn btn-secondary" id="startGameButton">Start game</button>
                        </div>  	
                        <input type="hidden" id="userId" value="">
                        <input type="hidden" id="gameMode" value="local">
                    </div>
                    <canvas id="gameCanvas"></canvas>
                    <div id="cu"> 
                        sefuderrrrr
                    </div>
                </div>
            </div>
        `;
    }

    async afterRender() {
        
    }
}