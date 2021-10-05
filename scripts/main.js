// setting up arrays of suites, values, scores
let suits = ['clubs', 'spades', 'hearts', 'diamonds']
let values = ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king']
let scores = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]

// function to build deck based on above arrays
function buildADeck(arr1, arr2, arr3){
    let deck = []
    for (let i1 = 0; i1 < arr1.length; i1++) {
        let suitCard = arr1[i1];
        for (let index = 0; index < arr2.length; index++) {
        let scoreCard = arr3[index];
        let valueCard = arr2[index];
        let card = {suit:suitCard, value:valueCard, img:`images/${valueCard}_of_${suitCard}.png`, score:scoreCard}
        deck.push(card)
        }
    }
    return deck
}

// shuffle the deck
function shuffleDeck(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        if  (arr[j].value == 'ace'){
            arr[j].score = 11
        }
        arr[j] = temp;
    }
    return arr;
}

// variable for shuffled deck
let deck = buildADeck(suits,values,scores)
let deckShuffle = shuffleDeck(deck)

// setting up empty arrays for cards
let dealerCards = []
let playerCards = []

// setting up score 
let playerScore = 0
let dealerScore = 0

// setting up player win and loss
let playerWin = 0
let playerLoss = 0

// retrieving buttons for event listening
let deal = document.querySelector('#deal-button')
let hit = document.querySelector('#hit-button')
let stand = document.querySelector('#stand-button')
let reset = document.querySelector('#reset-button')

// retrieve hand divs to append img
let playerHand = document.querySelector('#player-hand')
let dealerHand = document.querySelector('#dealer-hand')

// retrieve points to display scores
let playerPoints = document.querySelector('#player-points')
let dealerPoints = document.querySelector('#dealer-points')

// retrieve player wins and losses
let playerWins = document.querySelector('#player-wins')
let playerLosses = document.querySelector('#player-losses')

// retrieve message
let message = document.querySelector('.message-box')

// game state to see if game has been played or needs to be reset
let gameState = true

// create img child to append to hand div
function createImg(src){
    var img = document.createElement('img')
    img.setAttribute('src', src)
    return img
}

// create facedown card for dealers hand
function createBlackImg(src){
    var img = document.createElement('img')
    img.setAttribute('src', 'images/black.jpeg')
    return img
}

//Ace not used, purely for testing aces.
function ace(deck, hand, cards, points){
    let card = {suite:'clubs', value:'ace', img:`images/ace_of_clubs.png`, score:11}
    cards.push(card)
    let cardImg = createImg(card.img)
    hand.appendChild(cardImg)
    let summed = sum(cards)
    points.textContent = summed
    return deck, hand, cards, points
}

// function to sum card points
function sum(cards){
    points = 0
    for (let index = 0; index < cards.length; index++) {
        cardScore = cards[index].score;
        points += cardScore
    }
    return points
}

// special sum to not include dealer's facedown card
function dealerSum(cards){
    points = 0
    for (let index = 1; index < cards.length; index++) {
        cardScore = cards[index].score;
        points += cardScore
    }
    return points
}

// function to take card from deck and insert into players cards, put the img child in players hand, update displayed points
function distribute(deck, hand, cards, points){
    let card = deck.pop()
    cards.push(card)
    let cardImg = createImg(card.img)
    hand.appendChild(cardImg)
    let summed = sum(cards)
    points.textContent = summed
    return deck, hand, cards, points
}

// distribute function but creates black facedown card, and doesnt update displayed sum
function dealerDistribute1(deck, hand, cards, points){
    let card = deck.pop()
    cards.push(card)
    let cardImg = createBlackImg(card.img)
    cardImg.setAttribute('id', 'blackCard')
    hand.appendChild(cardImg)
    return deck, hand, cards, points
}

// distribute function but uses the dealer sum to hide first value
function dealerDistribute2(deck, hand, cards, points){
    let card = deck.pop()
    cards.push(card)
    let cardImg = createImg(card.img)
    hand.appendChild(cardImg)
    let summed = dealerSum(cards)
    points.textContent = summed
    return deck, hand, cards, points
}

// function to check if player has an ace and if they need to reduce the ace value
function aceCheck(points, cards){
    if (parseInt(points.textContent) > 21){
        for (let index = 0; index < cards.length; index++) {
        let card = cards[index]
        let value = card.value;
        if (value=='ace' && card.score==11){
            card.score = 1
            let summed = sum(cards)
            points.textContent = summed
            return points, cards
        }
        }
        let summed = sum(cards)
        points.textContent = summed
    return points, cards
}}

// function to take cards back into deck and reset hands and points and gamestate
function resetFun(){
    deckShuffle.push(...playerCards)
    deckShuffle.push(...dealerCards)
    playerCards = []
    dealerCards = []
    playerHand.textContent = ""
    dealerHand.textContent = ""
    playerPoints.textContent = ""
    dealerPoints.textContent = ""
    message.textContent = ""
    gameState = true
}

// event listenting to deal, and then will distribute hands and check for aces
deal.addEventListener('click', () => {
    if (gameState == true){
        if (playerCards.length == 0){
            distribute(deckShuffle, playerHand, playerCards, playerPoints)
            dealerDistribute1(deckShuffle, dealerHand, dealerCards, dealerPoints)
            distribute(deckShuffle, playerHand, playerCards, playerPoints)
            dealerDistribute2(deckShuffle, dealerHand, dealerCards, dealerPoints)
            aceCheck(playerPoints, playerCards)
            aceCheck(dealerPoints, dealerCards)
        }
        else{
            message.textContent = `You've already been delt your cards.`
        }
    }
    else{
        message.textContent = `
        Game has already been completed.
        Please reset.
        `
    }
})

// event for if player wants to hit, then checks for aces then for busting
hit.addEventListener('click', () => {
    if (gameState == true){
        if(playerCards.length > 0){
            distribute(deckShuffle, playerHand, playerCards, playerPoints)
            aceCheck(playerPoints, playerCards)
            message.textContent = ""
            if (parseInt(playerPoints.textContent) > 21){
                message.textContent = `
                You Busted!
                Your Score: ${playerPoints.textContent}
                Dealer's Score: ${dealerPoints.textContent}
                Game Over!
                `
                playerLoss += 1
                playerLosses.textContent = playerLoss
                gameState = false
            }
        }
        else{
            message.textContent = `
            You've haven't been delt your cards yet.
            `
        }
    }
    else{
        message.textContent = `
        Game has already been completed.
        Please reset.
        `
    }
})

// event if player wants to stand, replaces facedown card, updates scores, will cycle through necessary dealer hits until someone is victorious
stand.addEventListener('click', () => {
    if (gameState == true){
        if(playerCards.length > 0){
            aceCheck(dealerPoints, dealerCards)
            playerScore = sum(playerCards)
            dealerScore = sum(dealerCards)
            dealerPoints.textContent = dealerScore
            let blackCard = document.querySelector('#blackCard')
            blackCard.setAttribute('src', `images/${dealerCards[0].value}_of_${dealerCards[0].suit}.png`)
            while(dealerScore < 17){
                distribute(deckShuffle, dealerHand, dealerCards, dealerPoints)
                aceCheck(dealerPoints, dealerCards)
                dealerScore = sum(dealerCards)
            }
            if ((dealerScore < playerScore) || (dealerScore > 21)){
                message.textContent = `
                You Won!
                Your Score: ${playerPoints.textContent}
                Dealer's Score: ${dealerPoints.textContent}
                Game Over!
                `
                playerWin += 1
                playerWins.textContent = playerWin
                gameState = false
            }
            else{
                message.textContent = `
                You Lost!
                Your Score: ${playerPoints.textContent}
                Dealer's Score: ${dealerPoints.textContent}
                Game Over!
                `
                playerLoss += 1
                playerLosses.textContent = playerLoss
                gameState = false
            }}
        else{
            message.textContent = `
            You've haven't been delt your cards yet.
            `
        }
    }
    else{
        message.textContent = `
        Game has already been completed.
        Please reset.
        `
    }
})

// event to reset the game stats and shuffle deck and reset ace values 
reset.addEventListener('click', () => {
    resetFun()
    deckShuffle = shuffleDeck(deck)
})