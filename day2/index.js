const fs = require('node:fs')

const input = fs.readFileSync(__dirname + '/input.txt', 'utf8')

const testData = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`

const desiredConfig = {
    red: 12,
    green: 13,
    blue: 14
}

const gameRegex = /Game (?<gameId>\d+)/

const colorCount = /(?<count>\d+) (?<color>red|green|blue)/

const peek = (input) => { console.log(input); return input }

const parseGame = line => {
    const gameMatch = line.match(gameRegex)

    if (!gameMatch) {
        return null;
    }

    const gameId = parseInt(gameMatch.groups.gameId, 10)

    const rounds = line
        .split(';')
        .map(round => round
            .split(',')
            .map(str => str.match(colorCount))
            .filter(match => match)
            .map(match => ({ [match.groups.color]: parseInt(match.groups.count, 10) }))
            .reduce((acc, colorCount) => ({ ...acc, ...colorCount }), { red: 0, green: 0, blue: 0 })
        )

    return { gameId, rounds }
}

const getMaxColors = game => {
    const maxColors = game.rounds.reduce((acc, round) => ({
        red: Math.max(acc.red, round.red),
        green: Math.max(acc.green, round.green),
        blue: Math.max(acc.blue, round.blue),
    }), { red: 0, green: 0, blue: 0 })

    return { gameId: game.gameId, ...maxColors }
}

const isPossible = (maxColors, config) => {
    return maxColors.red <= config.red
        && maxColors.green <= config.green
        && maxColors.blue <= config.blue
}

const calculatePower = maxColors => maxColors.red * maxColors.green * maxColors.blue

const parseInput = input => input.split('\n').map(parseGame).filter(game => game)

const solve2a = (input) => parseInput(input)
    .map(getMaxColors)
    .filter(maxColors => isPossible(maxColors, desiredConfig))
    .map(peek)
    .map(maxColors => maxColors.gameId)
    .reduce((acc, id) => acc + id, 0)

const solve2b = (input) => parseInput(input)
    .map(getMaxColors)
    .map(calculatePower)
    .reduce((acc, id) => acc + id, 0)

// console.log(solve2a(testData))
// console.log(solve2a(input))
console.log(solve2b(input))