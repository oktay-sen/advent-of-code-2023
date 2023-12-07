const fs = require('node:fs')

const input = fs.readFileSync(__dirname + '/input.txt', 'utf8')

const testData = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`

const cardsA = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']

const valuesA = cardsA.reduce((acc, card, index) => ({ ...acc, [card]: cardsA.length - index }), {})

const cardsB = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']

const valuesB = cardsB.reduce((acc, card, index) => ({ ...acc, [card]: cardsB.length - index }), {})

const peek = (input) => { console.log(input); return input }

const sum = (acc, num) => acc + num
const multiply = (acc, num) => acc * num
const max = (acc, num) => acc > num ? acc : num

const logInLine = (...msgs) => process.stdout.write(msgs.join(' '))

const parseInput = input => {
    return input
        .split('\n')
        .map(line => line.split(' '))
        .filter(vals => vals.length)
        .map(vals => ({
            hand: vals[0],
            bid: parseInt(vals[1], 10)
        }))
        .filter(({ hand, bid }) => hand && hand.length && !isNaN(bid))
}

const countCards = hand => {
    const groups = hand
        .split('')
        .reduce((groups, card) => ({
            ...groups,
            [card]: groups[card] ? groups[card] + 1 : 1
        }), {})

    return {
        maxGroupSize: Object.values(groups).reduce(max, 0),
        groupCount: Object.keys(groups).length,
        maxGroup: Object.keys(groups).reduce((max, card) => groups[card] > groups[max] ? card : max)
    }
}

const countCardsWithJoker = hand => {
    if (hand === 'JJJJJ') {
        // this is the only case when we can't transform the joker
        console.log('Not transforming JJJJJ')
        return countCards(hand)
    }

    const countWithoutJoker = countCards(hand.replaceAll('J', ''))

    // console.log(hand, 'count without joker:', countWithoutJoker)

    const result = countCards(hand.replaceAll('J', countWithoutJoker.maxGroup))

    // console.log(hand, 'new hand', hand.replaceAll('J', countWithoutJoker.maxGroup), 'count:', result)

    return result
}

const compareHands = (values, countCards) => (hand1, hand2) => {
    // console.log('comparing', hand1, 'to', hand2)
    const hand1Groups = countCards(hand1)
    const hand2Groups = countCards(hand2)

    const sizeComparison = hand1Groups.maxGroupSize - hand2Groups.maxGroupSize

    if (sizeComparison !== 0) {
        // console.log('sizeComparison:', sizeComparison)
        return sizeComparison
    }

    const countComparison = hand2Groups.groupCount - hand1Groups.groupCount

    if (countComparison !== 0) {
        // console.log('countComparison:', countComparison)
        return countComparison
    }

    const hand1Cards = hand1.split('')
    const hand2Cards = hand2.split('')

    for (let i = 0; i < hand1Cards.length; i++) {
        const comparison = values[hand1Cards[i]] - values[hand2Cards[i]]

        if (comparison !== 0) {
            return comparison
        }
    }

    return 0
}

const compareHandsA = compareHands(valuesA, countCards)
const compareHandsB = compareHands(valuesB, countCardsWithJoker)

const solve7a = (input) => parseInput(input)
    .map(peek)
    .sort((line1, line2) => compareHandsA(line1.hand, line2.hand))
    .map(peek)
    .map((line, index) => line.bid * (index + 1))
    .reduce(sum, 0)

const solve7b = (input) => parseInput(input)
    .map(peek)
    .sort((line1, line2) => compareHandsB(line1.hand, line2.hand))
    .map(peek)
    .map((line, index) => line.bid * (index + 1))
    .reduce(sum, 0)

const startTs = Date.now()

// console.log(solve7a(testData))
// console.log(solve7a(input))
// console.log(solve7b(testData))
console.log(solve7b(input))

console.log('Finished in', Date.now() - startTs, 'ms')