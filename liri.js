require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var moment = require("moment");

if (process.argv[2] === "concert-this") {
  var fullList = false;
  if (process.argv[3] === "full-list") {
    fullList = true;
    var artistName = process.argv.slice(4).join(" ");
  } else {
    var artistName = process.argv.slice(3).join(" ");

  }
  
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    artistName +
    "/events?app_id=codingbootcamp&date=upcoming";

  axios.get(queryUrl).then(function(response) {
    if(response.data.length>10 && fullList === false){
      console.log("This artist has many upcoming concerts! The next ten are displayed below.");
      console.log("If you want to see the full list of " + response.data.length + " upcoming concerts, try adding 'full-list' after 'concert-this'!");
      console.log("");
    }
    console.log("Here is event information for the band " + artistName + ":");
    console.log("");
    if (fullList) {
      for (var i = 0; i < response.data.length; i++) {
        console.log("Event #" + (i + 1) + ":");
        console.log("Venue: " + response.data[i].venue.name);
        console.log(
          "Location: " +
            response.data[i].venue.city +
            ", " +
            response.data[i].venue.region
        );
        // console.log("Date: " + response.data[i].datetime);
        var fullDate = response.data[i].datetime;
        var subDate = fullDate.substring(0, 10);
        var niceDate = moment(subDate, "YYYY-MM-DD");
        var finalDate = moment(niceDate).format("MM/DD/YYYY");
        console.log("Date: " + finalDate);
        console.log("");
      }
    } else {
      for (var i = 0; i < 10 && i < response.data.length; i++) {
        console.log("Event #" + (i + 1) + ":");
        console.log("Venue: " + response.data[i].venue.name);
        console.log(
          "Location: " +
            response.data[i].venue.city +
            ", " +
            response.data[i].venue.region
        );
        // console.log("Date: " + response.data[i].datetime);
        var fullDate = response.data[i].datetime;
        var subDate = fullDate.substring(0, 10);
        var niceDate = moment(subDate, "YYYY-MM-DD");
        var finalDate = moment(niceDate).format("MM/DD/YYYY");
        console.log("Date: " + finalDate);
        console.log("");
      }
    }
  });
} else if (process.argv[2] === "spotify-this-song") {
  var songName = process.argv.slice(3).join(" ");
  console.log("Here is the top search result:");
  spotifyThis(songName);
} else if (process.argv[2] === "movie-this") {
  if (typeof process.argv[3] === "string") {
    var movieName = process.argv.slice(3).join("+");
  } else {
    movieName = "Mr. Nobody";
  }
  axios
    .get("http://www.omdbapi.com/?t=" + movieName + "&apikey=99382b94")
    .then(function(response) {
      console.log("Here is the info for " + response.data.Title);
      console.log("Year Released: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      console.log("Rotton Tomatoes Rating: " + response.data.Ratings[1].Value);
      console.log("Country: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot Summary: " + response.data.Plot);
      console.log("Lead Actors: " + response.data.Actors);
    });
} else if (process.argv[2] === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    spotifyThis(dataArr[1]);
  });
}

// * Country where the movie was produced.
// * Language of the movie.
// * Plot of the movie.
// * Actors in the movie.
// ```

function spotifyThis(songName) {
  spotify.search({ type: "track", query: songName }, function(err, data) {
    if (err) {
      console.log(
        "Uh oh, an error occurred... Here is information for 'Thunder' instead: "
      );
      spotify.search({ type: "track", query: "Thunder" }, function(err, data) {
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log(
          "Preview Link: " + data.tracks.items[0].external_urls.spotify
        );
      });
    } else {
      //artist, song name, preview link, album name
      // console.log(data.tracks.items[0].album.artists);

      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song Name: " + data.tracks.items[0].name);
      console.log(
        "Preview Link: " + data.tracks.items[0].external_urls.spotify
      );
    }
  });
}
