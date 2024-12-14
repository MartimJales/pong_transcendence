
console.log("chaaaaaama na blockchain papai"); 
 
async function callapizinha(){
     console.log("receeebaaaa");

     
        try {
            const response = await fetch('http://127.0.0.1:8000/api/getTournament/', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                document.querySelector('h1').textContent = `Number of Tournaments of the Smart Contract ${data.quantity}`;
            } else {
                const errorData = await response.json();
                console.log(errorData);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    
}

callapizinha();