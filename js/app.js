'use strict';
var NOTES;

var gState;

function init() {
    gState = {
        isUserTurn : false,
        seqNoteIndexes: [],
        currNoteIndexToClick: 0,
        currScore: 0
    }
    NOTES = createNotes(4);
    renderNotes(NOTES);
    var score = (localStorage.highScore ? localStorage.highScore : 0);
    updHighScore(score);
    document.querySelector('.score').innerText = gState.currScore;
}

function initGame(){
    init();
    doComputerMove();
}

function updHighScore(score){
    document.querySelector('.high-score').innerHTML = score;
    localStorage.highScore = score;
}

function doComputerMove() {
    tellUser('Computer Move...');
    addRandomNote();
    playSeq();
}

// Create the Notes model
function createNotes(size){
    var notes = [];
    
    for (var i = 0; i < size; i++) {
       var audioFileName = 'sound/Note' + (i+1) + '.mp3'; 
       var note = {sound : new Audio(audioFileName)}; //, color: getRandomColor()};
       notes.push(note);
    }
    return notes;
}

function renderNotes(notes) {
    // mapping notes to html tags
    var strHtmls = notes.map(function(note, i){
        var strHtml = `<div class="note note${i}" onclick="noteClicked(this,${i})"></div>`;
        // onmouseover="highlight(this)" onmouseout="highlight(this)" 
        return strHtml;
    });
    var elMain = document.querySelector('.notes-board');
    elMain.innerHTML = strHtmls.join('');
    elMain.innerHTML += '';
}

function addRandomNote() {
    var randNoteIndex = getRandomIntInclusive(0, NOTES.length-1);
    gState.seqNoteIndexes.push(randNoteIndex);
}

function playSeq() {
    
    var elNotes = document.querySelectorAll('.note');
    
    gState.seqNoteIndexes.forEach(function (seqNoteIndex, i) {
        
        setTimeout(function playNote() {
            elNotes[seqNoteIndex].classList.add('highlight');
            NOTES[seqNoteIndex].sound.play();
            
            setTimeout(function () {
                elNotes[seqNoteIndex].classList.remove('highlight');
            }, 500);
            
            console.log('Playing: ', NOTES[seqNoteIndex].sound);
        }, 1200 * i);
        
    });
    
    // When done playing the seq - change turns
    setTimeout(function () {
        console.log('Done Playing!!');
        gState.isUserTurn = true;
        tellUser('Your move!');

    }, 1000 * gState.seqNoteIndexes.length + 1000); 
    
}

function noteClicked(elNote, noteIndex) {
    
    if (!gState.isUserTurn) return;
    elNote.classList.add('highlight');
    NOTES[noteIndex].sound.play();
    setTimeout(function(){
        elNote.classList.remove('highlight');
    }, 500);
    
    // User clicked the right note?
    if (noteIndex === gState.seqNoteIndexes[gState.currNoteIndexToClick]) {
        console.log('User OK!');
        gState.currNoteIndexToClick++;
        if (gState.currNoteIndexToClick === gState.seqNoteIndexes.length) {
            console.log('User done playing seq!');
            gState.currScore++;
            if (gState.currScore > localStorage.highScore)
            {
                tellUser('WOW! You have a new high score!', 1000);
                updHighScore(gState.currScore);

            } else {
                tellUser('Good one!', 1000);
            }
            document.querySelector('.score').innerText = gState.currScore;
            gState.isUserTurn = false;
            gState.currNoteIndexToClick = 0;
            setTimeout(doComputerMove, 2000);
        }
    } else {
        tellUser('You suck!', 1000);
        setTimeout(tellUser,2000,'Press button to start playing.');
        // setTimeout(init, 1000);
    }
    console.log('Note', NOTES[noteIndex]);
}


function tellUser(msg, dismissAfter) {
    var elUserMsg = document.querySelector('.userMsg');
    elUserMsg.innerHTML = msg;
    if (dismissAfter) {
        setTimeout(function(){
            elUserMsg.innerHTML = '';
        }, dismissAfter);

    }
    
}

function highlight(quarter){
    quarter.classList.toggle('highlight');
}

function removeAllhighlight(){
    document.querySelectorAll('.highlight').forEach(function(quarter){
        quarter.classList.remove('highlight');
    })
}
