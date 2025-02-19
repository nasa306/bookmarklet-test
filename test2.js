(function() {
    let gamePin = prompt("Enter Kahoot Game PIN:");
    let baseName = prompt("Enter nickname prefix:");
    let botCount = parseInt(prompt("Enter number of bots:"), 10);
    
    if (!gamePin || !baseName || isNaN(botCount) || botCount <= 0) {
        alert("Invalid input. Please try again.");
        return;
    }
    
    function joinKahoot(pin, name) {
        let socket = new WebSocket("wss://kahoot.it/cometd");
        
        socket.onopen = function() {
            console.log(`Bot ${name} attempting to join game ${pin}`);
            socket.send(JSON.stringify({
                channel: "/service/controller",
                clientId: Math.random().toString(36).substr(2, 9),
                data: {
                    type: "login",
                    gameid: pin,
                    name: name
                }
            }));
        };
        
        socket.onmessage = function(event) {
            console.log(`Bot ${name} received:`, event.data);
            let message = JSON.parse(event.data);
            if (message.data && message.data.error) {
                console.error(`Bot ${name} failed to join: ${message.data.error}`);
                socket.close();
            }
        };
        
        socket.onerror = function(error) {
            console.error(`Bot ${name} encountered an error:`, error);
        };
    }
    
    for (let i = 1; i <= botCount; i++) {
        setTimeout(() => {
            joinKahoot(gamePin, baseName + i);
        }, i * 1000);
    }
    
    alert(`Attempting to join with ${botCount} bots. Check console for details.`);
})();
