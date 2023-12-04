const fs = require('node:fs')

const input = fs.readFileSync(__dirname + '/input.txt', 'utf8')

const testData = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`

const lineRegex = /Card +(?<cardId>\d+):(?<winningNumbers>[\d ]+)\|(?<numbers>[\d ]+)/

const peek = (input) => { console.log(input); return input }

const sum = (acc, num) => acc + num

const parseLine = line => {
    const lineMatch = line.match(lineRegex)

    if (!lineMatch) {
        return null
    }

    const { cardId, winningNumbers, numbers } = lineMatch.groups

    return {
        line,
        cardId,
        winningNumbers: winningNumbers.split(' ').filter(str => str.length).map(num => parseInt(num, 10)),
        numbers: numbers.split(' ').filter(str => str.length).map(num => parseInt(num, 10)),
        copies: 1
    }
}

const calculateWinCount = (game) => game.numbers.filter(num => game.winningNumbers.includes(num)).length

const calculatePoints = (game) => {
    const wins = calculateWinCount(game)

    if (!wins) {
        return 0
    }

    return Math.pow(2, wins - 1)
}

const calculateDuplicates = games => {
    for (let i = 0; i < games.length; i++) {
        const game = games[i]
        const wins = calculateWinCount(game)

        for (let j = 0; j < wins; j++) {
            if (!games[i + j + 1]) {
                continue;
            }
            games[i + j + 1].copies += game.copies
        }
    }
    return games
}

const parseInput = (input) => input.trim().split('\n').map(parseLine).filter(line => line)

const solve4a = input => parseInput(input)
    .map(calculatePoints)
    .reduce(sum, 0)

const solve4b = input => {
    const games = calculateDuplicates(parseInput(input))

    return games.map(game => game.copies).reduce(sum, 0)
}


// console.log(parseInput(testData))
console.log(solve4a(testData))
console.log(solve4a(input))
console.log(solve4b(testData))
console.log(solve4b(input))
