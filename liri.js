//set requirements
var inquirer = require("inquirer");
var request = require("request");
var dotenv = require("dotenv");
var fs = require("fs");
var SpotifyWebApi = require("node-spotify-api");

//dotENV config
require("dotenv").config();
var keys = require("./keys.js");
var spotify = new SpotifyWebApi(keys.spotify);

//INQUIRER
function liri() {
    inquirer.prompt([
        {
            type: "rawlist",
            name: "queryType",
            message: "What can LIRI assist you with?",
            choices: ["Spotify this song", "Movie Search", "Do what it says"]
        }
    ]).then(function (answer) {

        console.log(answer.queryType);
        if (answer.queryType == "Spotify this song") {
            spotiSearch();
        } else if (answer.queryType == "Movie Search") {
            movieSearch();
        } else if (answer.queryType === "Do what it says") {
            itSays();

        }
    })
}

//FUNCTIONS
function spotiSearch() {
    inquirer.prompt([
        {
            type: "input",
            name: "songSearch",
            message: "What song do you want to search for?",
        }
    ]).then(function (answer) {
        spotify.search({ type: 'track', query: answer.songSearch, limit: 5 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            let obj = data.tracks.items;
            console.log(`==========================`);
            for (i = 0; i < obj.length; i++) {
                console.log(`Album name: "${obj[i].album.name}"`);
                console.log(`Track Title: "${obj[i].name}"`);
                console.log(`Artists: "${obj[i].album.artists[0].name}"`);
                console.log(`Spotify URL: "${obj[i].album.href}"`);
                console.log(`==========================`);
            }
            liri();
        });
    })
}
function movieSearch() {
    inquirer.prompt([
        {
            type: "input",
            name: "movie",
            message: "What movie do you want to search for?"
        }
    ]).then(function (answer) {
        url = "http://www.omdbapi.com/?i=tt3896198&apikey=8bbcfe06&t=" + answer.movie;
        console.log(url);
        request.get(url, function (error, response, body) {
            if (error) { console.log('error:', error); } // Print the error if one occurred
            console.log(
                JSON.parse(body)
            ); // Print the HTML for the Google homepage.
            liri();
        });
    })
}
function itSays() {
    fs.readFile("random.txt", "utf-8", function (error, result) {
        if (error) { console.log(error) }
        else {
            var split = result.split(",");
            console.log(`${split[0]}, ${split[1]}`);
            if (split[0] == "spotify-this-song") {
                spotify.search({ type: 'track', query: split[1], limit: 5 }, function (err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }
                    let obj = data.tracks.items;
                    console.log(`==========================`);
                    for (i = 0; i < obj.length; i++) {
                        console.log(`Album name: "${obj[i].album.name}"`);
                        console.log(`Track Title: "${obj[i].name}"`);
                        console.log(`Artists: "${obj[i].album.artists[0].name}"`);
                        console.log(`Spotify URL: "${obj[i].album.href}"`);
                        console.log(`==========================`);
                    }
                    liri();
                });
            }

        }
    })
}
liri();
