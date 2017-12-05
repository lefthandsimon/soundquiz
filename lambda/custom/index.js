'use strict';
var Alexa = require("alexa-sdk");
var questionData = require("quiz_config");
var rootURL = 'https://s3.amazonaws.com/simoncalexa/soundquiz/';
var questions = [];
var questionIndex;
var score;



// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build


exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        init();
        //this.repsonse.speak("hello there");
        this.response.speak("Hiya! Think you know your chart music? Let' see... I'll play you a few seconds of a tune and then ask you what it is. Here comes the first one. " + getQuestion()).listen("what do you think? Say 1, or 2");
        this.emit(':responseReady');
    },
    'QuestionIntent': function () {
        this.response.speak("hello")
        this.emit(":responseReady");
    },

    'RepeatIntent': function (){
        console.log("inside repeat intent. Is this where it all ends?");
        this.response.speak(getQuestion()).listen("what do you think? Say 1, or 2");
        this.emit(':responseReady');
    },
    'AnswerIntent': function () {
        console.log("Answer.value = " + this.event.request.intent.slots.Answer.value);
        var feedback;
        //var name = this.event.request.intent.slots.name.value;
        console.log("about to check answer....");
        if(checkAnswer(this.event.request.intent.slots.Answer.value))
        {
          score ++;
          feedback = "YES! that's the right answer.";
        }else{
          console.log("questionIndex: " + questionIndex);
          feedback = "Unlucky. The correct answer was: " + questions[questionIndex][questions[questionIndex].correct];
        }

        questionIndex++
        if(questionIndex >= questions.length)
        {
          this.response.speak(feedback + getScore());
          this.emit(":responseReady");
        }else{
          this.response.speak(feedback + ". Next question coming up. " + getQuestion()).listen("what do you think? Say 1, or 2");
          this.emit(":responseReady");
        }
    },
    'FinalScoreIntent': function (){
        this.emit(":responseReady");
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Thanks for playing, see you soon!');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: 'alexa, hello world' or 'alexa, ask hello world my" +
            " name is awesome Aaron'");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that. You can try: 'alexa, hello world'" +
            " or 'alexa, ask hello world my name is awesome Aaron'");
    }
};

const init = () =>{
  questionIndex = 0;
  score = 0;
  var currentIndex = questionData.tunes.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = questionData.tunes[currentIndex];
    questionData.tunes[currentIndex] = questionData.tunes[randomIndex];
    questionData.tunes[randomIndex] = temporaryValue;
  }
  questions = questionData.tunes;
}

const getQuestion = () => {
  if(!questionIndex || !questions)
  {
    init();
  }
  let currentQuestion = questions[questionIndex];
  let questionText = 'What tune is this? <audio src="'+ rootURL + currentQuestion.src + '"/> Is it, 1: ' + currentQuestion["1"] + '. Or is it, 2: ' + currentQuestion["2"] + '. What do you think? Is it 1, or is it 2?';
  return questionText;
}

const checkAnswer = (answer) => {
  if(!questionIndex || !questions)
  {
    init();
  }
  if(answer ===  questions[questionIndex].correct){
    return true;
  }
  return false;
}

const getScore = () =>
{
    let scoreText = " ... and that's the end of the quiz! I'll just count up the score. You scored: " + score + " out of " + questions.length + ". Thanks for playing! See you again soon!";
    return scoreText;
}
