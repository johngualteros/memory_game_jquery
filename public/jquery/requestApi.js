const URL = 'https://rickandmortyapi.com/api/character?page=1';

$(document).ready(function () {
    requestApi();
});

function requestApi() { 
    try {
        $.get(URL, function (response) {
            const Characters = response.results;
            renderCharacters(Characters);
        });
    } catch (error) {
        console.log(error);
    }
}

let randomCharactersSelected = [];

function renderCharacters(characters) {
    const $container = $('#container');

    randomCharactersSelected = cloneRandomCharactersAndReOrder(characters);

    localStorage.setItem('characters', JSON.stringify(randomCharactersSelected));

    randomCharactersSelected.forEach((character) => {
        const $cardCharacter = createCardCharacter(character);
        clickCharacter($cardCharacter);
        $container.append($cardCharacter);
    });
}

function selectFiveRandomCharacters(characters) {
    const randomCharacters = [];
    const randomNumbers = [];
    const max = characters.length;
    const min = 0;

    while (randomCharacters.length < 5) {
        const randomNumber = Math.floor(Math.random() * (max - min) + min);

        if (!randomNumbers.includes(randomNumber)) {
            randomNumbers.push(randomNumber);
            randomCharacters.push(characters[randomNumber]);
        }
    }
    return randomCharacters;
}

function cloneRandomCharactersAndReOrder(characters){
    const randomCharacters = selectFiveRandomCharacters(characters);
    let randomCharactersCloneOrdened = [];
    for (let i = 0; i < randomCharacters.length; i++) {
        const randomIndex = Math.floor(Math.random() * randomCharacters.length);
        if (randomCharactersCloneOrdened.includes(randomCharacters[randomIndex])) {
            i--;
            continue;
        }
        randomCharactersCloneOrdened.push(randomCharacters[randomIndex]);
    }
    const randomCharactersClone = [...randomCharacters, ...randomCharactersCloneOrdened];
    return randomCharactersClone;
}

function createCardCharacter(character) {
    const $card = $(
    `<div class="card_character hidden" id="character">
        <img src="${character.image}" class="character_image" width="200" alt="${character.name}">
        <h3 class="character_name">${character.name}</h3>
    </div>`
    );
    return $card;
}

// GAME LOGIC

let nameCharactersClicked = [];
let score = 0;
let tries = 0;

function incrementScore() {
    score++;
    $('.score').text('Score: '+ score);
}

function incrementTries() {
    tries++;
    $('.tries').text('Tries: '+ tries);
}

function clickCharacter(character) {
    character.on('click', function () {
        character.addClass('show');
        // get value of character
        const characterName = character.find('.character_name').text();
        nameCharactersClicked.push(characterName);
        if(nameCharactersClicked.length == 2){
            const characters = JSON.parse(localStorage.getItem('characters'));
            const character1 = characters.find(character => character.name === nameCharactersClicked[0]);
            const character2 = characters.find(character => character.name === nameCharactersClicked[1]);
            if(character1.id === character2.id){
                console.log('Ganaste');
                character.find('.character_name').text() === nameCharactersClicked[0] && nameCharactersClicked[1] 
                ?
                incrementScore()
                :
                false

                
            }else{
                console.log('Perdiste');
                setTimeout(() => {
                    $('.card_character').addClass('hidden');
                    $('.card_character').removeClass('show');
                }, 1000);
                incrementTries();
            }
            nameCharactersClicked = [];
        }
    });
}

let count = 0;
$('.time').text('Time: '+ count);
setInterval(() => {
    count++;
    $('.time').text('Time: '+ count + ' s');
}, 1000);

