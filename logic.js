// Initialize Firebase
var config = {
  apiKey: "AIzaSyByiLws_S-ZQQBfVMSXPYllSJqsnFwtels",
  authDomain: "train-station-4ebd4.firebaseapp.com",
  databaseURL: "https://train-station-4ebd4.firebaseio.com",
  projectId: "train-station-4ebd4",
  storageBucket: "train-station-4ebd4.appspot.com",
  messagingSenderId: "524852251135"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Capture Button Click
$("#addTrainBtn").on("click", function(event) {
  event.preventDefault();

  // Grabbed values from text boxes
  var trainName = $("#trainNameInput").val().trim();
  var lineName = $("#lineInput").val().trim();
  var destination = $("#destinationInput").val().trim();
  var trainTimeInput = moment($("#trainTimeInput").val().trim(), "HH:mm").subtract(10, "years").format("X");
  var frequencyInput = $("#frequencyInput").val().trim();

  var diffTime = moment().diff(moment.unix(trainTimeInput), "minutes");
  var timeRemainder = moment().diff(moment.unix(trainTimeInput), "minutes") % frequencyInput;
  var minutes = frequencyInput - timeRemainder;

  var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A"); 

  // Code for handling the push
  database.ref().push({
    name: trainName,
    line: lineName,
    destination: destination,
    trainTime: trainTimeInput,
    frequency: frequencyInput,
    diffTime: diffTime,
    timeRemainder: timeRemainder,
    minutes: minutes,
    nextTrainArrival: nextTrainArrival,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  // clear text-boxes
  $("#trainNameInput").val("");
  $("#lineInput").val("");
  $("#destinationInput").val("");
  $("#trainTimeInput").val("");
  $("#frequencyInput").val("");

  // Prevents page from refreshing
  return false;

});

// Firebase watcher + initial loader + order/limit
database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
  
  // storing the snapshot.val() in a variable for convenience
  var sv = snapshot.val();

  // Console.loging the last user's data
  console.log(sv.name);
  console.log(sv.line);
  console.log(sv.destination);
  console.log(sv.trainTime);
  console.log(sv.frequency);
  console.log(sv.diffTime);
  console.log(sv.timeRemainder);
  console.log(sv.minutes);
  console.log(sv.nextTrainArrival);

  // Change the HTML to reflect
  $("#trainTable > tbody").append("<tr><td>" + sv.name + "</td><td>" + sv.line + "</td><td>"+ sv.destination + "</td><td>" + sv.frequency + " mins" + "</td><td>" + sv.nextTrainArrival + "</td><td>" + sv.minutes + "</td></tr>");

   // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});