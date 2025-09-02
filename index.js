
const express = require('express');
const app = express ();
app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });

app.get("/status", (req, res) => {
    res.status(200).send("Server is running");

});  

app.get("/top25", (req, res) => {

    fetch('https://ncaa-api.henrygd.me/scoreboard/football/fbs/')
    .then(response => response.json())
    .then(data => {

        const returnObj = [];
        data.games.forEach(i => {            
            if(i.game.away.rank != "" || i.game.home.rank != ""){
                returnObj.push(i)
                // console.log(`Teams: ${i.game.away.names.short} vs ${i.game.home.names.short}`);
                // console.log(`Score: ${i.game.away.score} - ${i.game.home.score}`);
                // console.log(`Ranks: ${i.game.away.rank} - ${i.game.home.rank}`);
                // console.log('---');
            }
        })
        res.json(returnObj)
    })
    .catch(error => {
        console.error('Fetch error:', error);
        res.status(500).json({ message: 'Error fetching scoreboard data' });
    });

})

app.get("/top25/concise", (req, res) => {
    fetch('https://ncaa-api.henrygd.me/scoreboard/football/fbs/')
    .then(response => response.json())
    .then(data => {
        
        const rankedGames = data.games.filter(game => {
            return game.game.away.rank !== "" || game.game.home.rank !== "";
        }).map(game => {
            // Create a new, cleaner object for each ranked game
            return {
                            startDate: game.game.startDate,
                            startTime: game.game.startTime,
                            teams: `${game.game.away.names.short} ${game.game.away.rank ? `(${game.game.away.rank})` : ""} vs ${game.game.home.names.short} ${game.game.home.rank ? `(${game.game.home.rank})` : ""}`.trim(),
                            score: `${game.game.away.score} - ${game.game.home.score}`,
                        };
        });
        
        // Send the new array of ranked games as a JSON object
        res.json({ top25Games: rankedGames });
    })
    .catch(error => {
        console.error('Fetch error:', error);
        res.status(500).json({ message: 'Error fetching scoreboard data' });
    });
})
