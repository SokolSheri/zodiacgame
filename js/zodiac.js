var xhr = new XMLHttpRequest();
var animals = []; // Array Object 
var animals2 = [];
xhr.onreadystatechange = function () {            
   if( this.readyState == 4 && this.status == 200 ) { 
        animals = JSON.parse(this.responseText); 
        gameOn(); // render game once data is loaded
    } // end if
 } // end xhr.onready... 

xhr.open("GET", "js/animals.json", true);
xhr.send();

function gameOn() {
    animals2 = animals.slice();
    var isQuiz = false; // Boolean default pg load is NOT quiz mode
    var attempts = 0; // every quiz answer, right or wrong, increments this: attempts++
    var rawScore = 0; // rawScore++ for each correct answer
    var avgScore = 0; // avgScore = rawScore / attempts
    var randNum = 0; // for generating random quiz questions (sounds)
    var sound = new Audio(); // one Audio obj to play sounds, one at a time
    var chinCharImg = new Image(); // for displaying Chinese characters
    var bigPic = new Image(); // for displaying Chinese Zodiac Animal pics
    var wheel = new Image(); // for displaying Zodiac wheel
    
   wheel.src = "images/confucius.png"; // set source of wheel on page load
    
/*function spinWheel() { // rotate the wheel 1deg every time spinWheel is called
        wheel.style.transform += "rotate(1deg)"; 
    }
    
  var wheelInterval = setInterval(spinWheel, 25); */
    
    var app = document.getElementById("app"); // the only element in the body code
    app.style.cssText = "background-color: maroon; width: 1250px; margin: 0 auto; border: 7px solid beige; border-radius: 40px; min-height: 660px; padding: 20px; position: relative"; // some CSS for the app (container) div

    var header = document.createElement("div");
    header.style.cssText = "height: 100px; text-align: center; color: whitesmoke; font-family: sans-serif;";
    header.innerHTML = "<h2>Learn the Chinese names of the 12 Animals of the Chinese Zodiac with Confucius!</h2><h2>Pay close attention to the sounds--there's a quiz later!</h2>";
    app.appendChild(header);

    var bigPicDiv = document.createElement("div");
    bigPicDiv.style.cssText = "background-color: white; width: 35%; border: 5px solid tan; border-radius: 20px; padding: 10px; float: right; height: 480px; font-size: 2rem; font-family: sans-serif; text-align: center; font-family:serif; font-size:2.5rem; font-weight:bold; color:maroon; letter-spacing:1px";
    app.appendChild(bigPicDiv);
    wheel.style.cssText = "height:520px; width:400px;";
    bigPicDiv.appendChild(wheel);

    var thumbsDiv = document.createElement("div");
    thumbsDiv.style.cssText = "background-color: white; width: 58%; border: 5px solid tan; border-radius: 20px; text-align: center; margin-right: 10px; padding: 10px; float: left; height: 480px; background-repeat: no-repeat; background-position: bottom";
    app.appendChild(thumbsDiv);

    var footer = document.createElement("div");
    footer.style.cssText = "height: 30px; clear: both; text-align: right; padding-top: 10px";
    app.appendChild(footer);

    var scoreBox = document.createElement('h3');
    scoreBox.style.cssText = "color:white; font-family:sans-serif; float:left; margin:20px";
    footer.appendChild(scoreBox); // put the empty score box in footer

    var chinChar = document.createElement("div");
    chinChar.style.cssText = "position: absolute; width: 247px; height: 140px; left: 260px; top: 475px; background-color: white; text-align: center; display: none; z-index: 1";
    app.appendChild(chinChar);

    var quizMeBtn = document.createElement("button");
    quizMeBtn.style.cssText = "font-size: 1rem; padding: 5px 20px; color: whitesmoke; background-color: blue; border-radius: 10px; margin: 5px 15px; cursor: pointer";
    quizMeBtn.innerHTML = " TAKE QUIZ ";
    quizMeBtn.addEventListener("click", startQuiz);
    app.appendChild(quizMeBtn);

    var quitBtn = document.createElement("button");
    quitBtn.style.cssText = "font-size: 1rem; padding: 5px 20px; color: whitesmoke; background-color: blue; border-radius: 10px; margin: 5px 15px; cursor: pointer; margin-left:20px;";
    quitBtn.innerHTML = " EXIT QUIZ ";
    quitBtn.addEventListener('click',endQuiz);
    app.appendChild(quitBtn);
    quitBtn.style.display="none";


    for(var i = 0; i < animals.length; i++) { // loop that makes animal thumbs     
        var thumbPic = new Image();
        thumbPic.src = `images/${animals[i].eng}.jpg`;
        thumbPic.id = i;
        thumbPic.eng = animals[i].eng; // add eng as a property: "chicken", "cow", etc
        thumbPic.style.cssText = "width:80px; height:80px; border:3px solid maroon; border-radius:10px; margin:10px; padding:5px; box-shadow:5px 5px 5px maroon;";
        thumbPic.addEventListener("click", routeThumbClick); // func decides if quiz or not
        thumbsDiv.appendChild(thumbPic);
    }// end for(var i=0; i<animals.length; i++)
    
    function routeThumbClick() { // if inQuiz is false, calls one func, else calls another func
        if(!isQuiz) { // DEFAULT isQuiz == false => swapAnimal()
            swapAnimal(); // func swaps animal in big pic, displays char & plays bilingual mp3
        } else { // isQuiz == true, so Quiz Me !! 
            // if player has clicked a thumb in answer to Quiz
            evalQuizClick(); // func evals thumb click during QUIZ -- is it right answer?
        } 
    } // function routeThumbClick()

    function evalQuizClick() { // did user click correct thumb
        
        attempts++; // increment attempts; right or wrong, it's an attempt
        // JOB 1: Check if user clicked correct thumb
        // event.target is the obj that called the func
        if(event.target.eng == animals[randNum].eng) { // if "chicken" == "chicken"
            
             // Correct answer scores 1 pt 
            // since user got it right, remove correctly answered animal from the game
            animals.splice(randNum, 1); // remove correct answer to avoid repeats
            thumbsDiv.removeChild(event.target); // remove the correctly clicked animal 
            sound.pause();
            // serve up the next random sound
            randNum = Math.floor(Math.random()*animals.length);
            // play the new random sound
            sound.src = `audio/${animals[randNum].chi}.mp3`;
            sound.play(); // play the new quiz sound
            // serve up matching character for the new quiz sound
            chinCharImg.src = `images/char-${animals[randNum].chi}.jpg`;
            chinChar.innerHTML = ""; // remove existing char from chinChar div
            chinChar.appendChild(chinCharImg);
            rawScore++;
            if(animals.length == 0) {
                endQuiz();
            }
            
        } else { // wrong answer -- rawScore does NOT increase
            // repeat the sound, since they got it wrong
            sound.pause();
            sound.play();
        }
        
        // every time an attempt (click) is made, update the avg score
        avgScore = (rawScore / attempts).toFixed(3); // toFixed(n) limits decimal places to n places: toFixed(3) means round to 3 decimal places
        // now that the score vars have all been updated, update the scoreBox
        scoreBox.innerHTML = `Attempts: ${attempts} &nbsp;  &nbsp; Correct Answers: ${rawScore}  &nbsp;  &nbsp; Score: ${avgScore}`; 
        
    } // end function evalQuizClick()

    function swapAnimal() {
        
        bigPic.src = `images/${animals[event.target.id].eng}.jpg`; // set img src
        bigPicDiv.innerHTML = ""; // empty the big pic div
        bigPicDiv.appendChild(bigPic); // put new big pic in big pic div
        // display the English name under the animal
        bigPicDiv.innerHTML += animals[event.target.id].eng; // the word itself
        // display the Pinyin name next to the English name
        bigPicDiv.innerHTML += " - " + animals[event.target.id].pin;
        // play the corresponding bilingual sound
        sound.src = `audio/${animals[event.target.id].eng}.mp3`;
        sound.play();
        // output the Chinese character jpg to the AP Div
        chinChar.style.display = "block";
        chinCharImg.src = `images/char-${animals[event.target.id].chi}.jpg`;
        chinChar.innerHTML = ""; // remove existing char from chinChar div
        chinChar.appendChild(chinCharImg);
        // eliminate the interval so it doesn't keep firing in the background
        clearInterval(wheelInterval);
        
    } // end function swapAnimal()

    
    function startQuiz() {
        
        isQuiz = true; // toggle the Boolean to TRUE
        /*setInterval(spinWheel, 30);*/
        // serve up a random sound
        // generate a random int from 0-11
        randNum = Math.floor(Math.random()*animals.length);
        //alert(randNum);
        sound.src = `audio/${animals[randNum].chi}.mp3`;
        sound.play();
        // clear current bigPic from bigPicDiv & replace bigPic w zodiac wheel
        bigPicDiv.innerHTML = "";
        wheel.src = "images/confucius.png"; // reset wheel pic
        bigPicDiv.appendChild(wheel); // start the wheel spinning again
        // display matching character in chinChar div to go w quiz sound
        chinCharImg.src = `images/char-${animals[randNum].chi}.jpg`;
        chinChar.innerHTML = ""; // remove existing char from chinChar div
        chinChar.appendChild(chinCharImg);
        chinChar.style.display = "block";
        // make the score appear
        scoreBox.innerHTML = `Attempts: ${attempts} &nbsp;  &nbsp; Correct Answers: ${rawScore}  &nbsp;  &nbsp; Score: ${avgScore}`;
        quizMeBtn.style.display="none";
        quitBtn.style.display="block";
    } // function startQuiz()

    function endQuiz(){
        alert("YOU SCORED " + (avgScore*100).toFixed(2) + "% !");
        location.reload();
        return false;

    }
} // close gameOn()



