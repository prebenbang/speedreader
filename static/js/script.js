var index = 0;
var wordGroups = [];
var displayTimes = [];
var timeoutHandle;
var isPlaying = false;

function calculateAdjustedLength(group) {
    return group.split('').reduce((count, char) => count + (char >= '0' && char <= '9' ? 2 : 1), 0);
}

function countDigits(text) {
    var digitMatch = text.match(/\d/g);
    return digitMatch ? digitMatch.length : 0;
}

document.getElementById('startButton').addEventListener('click', function() {
    if (!isPlaying) {
        var text = document.getElementById('inputText').value;
        var groupSize = parseInt(document.getElementById('groupSize').value);
        var wpm = parseInt(document.getElementById('wpm').value);
        var digitWeight = parseFloat(document.getElementById('digitweight').value);

        // Split text into words and group them
        wordGroups = text.split(/\s+/).map(function(_, i, words) {
            return words.slice(i, i + groupSize).join(' ');
        }).filter(function(_, i) {
            return i % groupSize === 0;
        });

        // Calculate display times
        var totalWordCount = text.split(/\s+/).length;
        var totalLetterCount = text.replace(/\s/g, '').length;
        var totalDigitsCount = countDigits(text);
        var adjustedLetterCount = totalLetterCount + (digitWeight - 1)*totalDigitsCount
        // var digitShare = totalDigitsCount/totalLetterCount
        // console.log(totalWordCount);
        // console.log(totalLetterCount);
        // console.log(totalDigitsCount);
        var totalTimeForAllWords = (60000 / wpm) * totalWordCount * adjustedLetterCount/totalLetterCount; // Total time to display all words at the set WPM
        
        displayTimes = wordGroups.map(group => {
            var groupLetterCount = group.replace(/\s/g, '').length;
            var groupDigitCount = countDigits(group);
            var adjustedGroupLetterCount = groupLetterCount + (digitWeight - 1)*groupDigitCount
            return totalTimeForAllWords * (adjustedGroupLetterCount / adjustedLetterCount);
        });

        isPlaying = true;
        displayNextGroup();
    }
});

document.getElementById('stopButton').addEventListener('click', function() {
    clearTimeout(timeoutHandle);
    isPlaying = false;
});

document.getElementById('resetButton').addEventListener('click', function() {
    clearTimeout(timeoutHandle);
    document.getElementById('wordDisplay').innerText = '';
    isPlaying = false;
    index = 0; // Reset the index to start from the beginning
});

function displayNextGroup() {
    if (index < wordGroups.length && isPlaying) {
        document.getElementById('wordDisplay').innerText = wordGroups[index];
        timeoutHandle = setTimeout(displayNextGroup, displayTimes[index]);
        index++;
    }
}
