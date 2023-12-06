const fs = require('node:fs')

const input = fs.readFileSync(__dirname + '/input.txt', 'utf8')

const testData = `
Time:      7  15   30
Distance:  9  40  200
`


const peek = (input) => { console.log(input); return input }

const sum = (acc, num) => acc + num
const multiply = (acc, num) => acc * num

const logInLine = (...msgs) => process.stdout.write(msgs.join(' '))

const parseInput = input => {
    const result = input
        .trim()
        .split('\n')
        .filter(line => line.length)
        .map(line => line.split(' ').map(token => parseInt(token, 10)).filter(token => !isNaN(token)))

    const times = result[0]
    const distances = result[1]
    return times.map((time, i) => ({ maxTime: time, distanceGoal: distances[i] }))
}

const parseInput2 = input => {
    const result = input
        .trim()
        .split('\n')
        .filter(line => line.length)
        .map(line => parseInt(line.split(' ').map(token => parseInt(token, 10)).filter(token => !isNaN(token)).reduce(sum, ''), 10))

    return { maxTime: result[0], distanceGoal: result[1] }
}

const getDistance = (holdTime, maxTime) => {
    const result = holdTime > maxTime ? 0 : holdTime * (maxTime - holdTime)

    return result
}

const getWinningRange = ({ maxTime, distanceGoal }) => {

    const search = ({ holdTimeMin, holdTimeMax }, check) => {
        logInLine('searching between', holdTimeMin, 'and', holdTimeMax)
        if (holdTimeMin > holdTimeMax) {
            console.log(', could not find result')
            return { isRunning: false, result: null }
        }

        const holdTimeMiddle = holdTimeMin + Math.floor((holdTimeMax - holdTimeMin) / 2)
        logInLine(', middle value:', holdTimeMiddle)

        const compare = check(holdTimeMiddle)

        if (compare === 0) {
            console.log(', found:', holdTimeMiddle)
            return { isRunning: false, result: holdTimeMiddle }
        } else if (compare < 0) {
            console.log(', searching right half')
            return { isRunning: true, holdTimeMin: holdTimeMiddle + 1, holdTimeMax }
        } else {
            console.log(', searching left half')
            return { isRunning: true, holdTimeMin, holdTimeMax: holdTimeMiddle - 1 }
        }
    }

    const runSearch = check => {
        let state = { isRunning: true, holdTimeMin: 0, holdTimeMax: maxTime }
        while (state.isRunning) {
            state = search(state, check)
        }
        return state.result
    }

    const startBoundaryCheck = holdTime => {
        if (getDistance(holdTime, maxTime) > distanceGoal) {
            if (getDistance(holdTime - 1, maxTime) <= distanceGoal) {
                return 0
            } else {
                return 1
            }
        } else {
            return -1
        }
    }

    const endBoundaryCheck = holdTime => {
        if (getDistance(holdTime, maxTime) > distanceGoal) {
            if (getDistance(holdTime + 1, maxTime) <= distanceGoal) {
                return 0
            } else {
                return -1
            }
        } else {
            return 1
        }
    }

    const result = [runSearch(startBoundaryCheck), runSearch(endBoundaryCheck)]

    console.log('Winning range for time:', maxTime, 'distance:', distanceGoal, 'is', result)

    return result
}

const solve6a = input => parseInput(input).map(getWinningRange).map(range => range[1] - range[0] + 1).reduce(multiply, 1)

const solve6b = input => {
    const range = getWinningRange(parseInput2(input))
    return range[1] - range[0] + 1
}

const startTs = Date.now()

// console.log(parseInput(testData))
// console.log(solve6a(testData))
// console.log(solve6a(input))
console.log(solve6b(input))

console.log('Finished in', Date.now() - startTs, 'ms')