async function callapizinha(){
     console.log("receeebaaaa");

     
        try {
            const response = await fetch('http://127.0.0.1:1443:8000/api/getTournament/', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                document.querySelector('h1').textContent = `Number of Tournaments Stored in Smart Contract ${data.quantity}`;
            } else {
                const errorData = await response.json();
                console.log(errorData);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    
}

callapizinha();

//maybe switch for let?const?
var indexInput1 = document.getElementById('tournamentIndex');
var searchBtn11 = document.getElementById('searchBtn');


indexInput1.addEventListener('input', (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value < 0) {
        e.target.value = 0;
    }
});

searchBtn11.addEventListener('click', async () => {
    try {
        const index = document.getElementById('tournamentIndex').value;
        const response = await fetch(`/api/getTournament/${index}/`);
        const data = await response.json();
        
        if (response.ok) {
            console.log("updating info my nober");
            document.getElementById('message').innerHTML = `
                <div class="tournament-display">
                    <h2 class="tournament-title">Tournament #${index}</h2>
                    
                    <div class="match-section">
                        <h3 class="match-title">Quarter Finals 1</h3>
                        <p class="match-detail">
                            ${data.tournament.quarter1.player1} vs ${data.tournament.quarter1.player2}
                        </p>
                        <p class="match-detail winner-highlight">
                            Winner: ${data.tournament.quarter1.winner}
                        </p>
                        <p class="match-detail">
                            Score: ${data.tournament.quarter1.score}
                        </p>
                    </div>
                    
                    <div class="match-section">
                        <h3 class="match-title">Quarter Finals 2</h3>
                        <p class="match-detail">
                            ${data.tournament.quarter2.player1} vs ${data.tournament.quarter2.player2}
                        </p>
                        <p class="match-detail winner-highlight">
                            Winner: ${data.tournament.quarter2.winner}
                        </p>
                        <p class="match-detail">
                            Score: ${data.tournament.quarter2.score}
                        </p>
                    </div>
                    
                    <div class="match-section">
                        <h3 class="match-title">Finals</h3>
                        <p class="match-detail">
                            ${data.tournament.finals.player1} vs ${data.tournament.finals.player2}
                        </p>
                        <p class="match-detail winner-highlight">
                            Winner: ${data.tournament.finals.winner}
                        </p>
                        <p class="match-detail">
                            Score: ${data.tournament.finals.score}
                        </p>
                    </div>
                </div>
            `;
        } else {
            document.getElementById('message').innerHTML = `
                <div class="alert" style="color: #ff4444; text-shadow: 0 0 10px #ff4444; border: 2px solid #ff4444; padding: 1rem; margin-top: 1rem;">
                    <p>Search Out of Bounds, check the Number of Tournaments dumbass</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});