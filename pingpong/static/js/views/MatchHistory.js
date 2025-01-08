console.log("maaaatch hisssotyyy");
async function fetchMatchHistory() {
    try {
      const response = await fetch('https://127.0.0.1:1443/api/matchhistory/', {
        credentials: 'include',
        headers: {
            'Accept': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch match history');
      const data = await response.json();
      renderMatchHistory(data);
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('matchHistoryContent').innerHTML = `
        <div style="color: #e74c3c; margin: 20px;">
          Error loading match history. Please try again.
        </div>
      `;
    }
  }

fetchMatchHistory();

function renderMatchHistory(data) {
    const content = document.getElementById('matchHistoryContent');
    
    let html = `
      <h1 style="color: white;">Match History of ${data.nick}</h1>
      <img src="${data.image_url}" alt="Profile Image" class="profile-image">
    `;

    if (data.matches && data.matches.length > 0) {
      html += '<div class="match-list">';
      data.matches.forEach(match => {
        html += `
          <div class="match-card ${match.result ? 'win' : 'loss'}">
            vs ${match.opponent}
            <span class="result-tag ${match.result ? 'result-win' : 'result-loss'}">
              ${match.result ? 'Won' : 'Lost'}
            </span>
            <div style="margin-top: 10px;">
              ${match.mode} • ${match.earned_points} points
            </div>
             <div style="margin-top: 5px; font-size: 0.9em; color: #888;">
                ${new Date(match.match_date).toLocaleString()}
            </div>
          </div>
        `;
    });
      html += '</div>';
    } else {
      html += `
        <div style="margin: 20px; color: #888;">
          No matches found yet
        </div>
      `;
    }

    html += `
      <button onclick="window.go('profile')" class="btn btn-secondary">
        Back to Profile
      </button>
    `;

    content.innerHTML = html;
  }
