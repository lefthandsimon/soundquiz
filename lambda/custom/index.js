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
        this.response.speak("Hiya! Welcome to the music quiz. I'll play you a few seconds of a tune and then ask you what it is. Here comes the first one. " + getQuestion()).listen("what do you think? is it a or b?");
        this.emit(':responseReady');
    },
    'QuestionIntent': function () {
        this.response.speak("hello")
        this.emit(":responseReady");
    },
    'AnswerIntent': function () {
        console.log("Answer.value = " + this.event.request.intent.slots.Answer.value);

        //var name = this.event.request.intent.slots.name.value;
        if(checkAnswer(this.event.request.intent.slots.Answer.value))
        {
          this.response.speak("YES! that's the right answer");
          this.emit(":responseReady");
        }else{
          this.response.speak("Unlucky. The correct answer was: " + questions[questionIndex].correct);
          this.emit(":responseReady");
        }
        //this.response.speak(getQuestion()).listen("what do you think? is it a or b?");
      //  this.emit(":responseReady");
        //this.emit('QuestionIntent');
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
  let allQuestions = questionData.tunes;
  while(allQuestions.length > 0){
    let randomIndex = Math.floor(Math.random() * allQuestions.length);
    questions.push(allQuestions[randomIndex]);
    allQuestions.splice(randomIndex, 1);
  }
}

const getQuestion = () => {
  if(!questionIndex || !questions)
  {
    init();
  }
  let currentQuestion = questions[questionIndex];
  let questionText = 'What tune is this? <audio src="'+ rootURL + currentQuestion.src + '"/> Is it "a" ' + currentQuestion.a + '. Or is it "b", ' + currentQuestion.b + '. What do you think? Is it "a", or is it "b"?';
  return questionText;
}

const checkAnswer = (answer) => {
  if(!questionIndex || !questions)
  {
    init();
  }
  console.log("Answer.value = " + answer);
  if(answer ===  questions[questionIndex].correct){
    return true;
  }
  return false;
}
