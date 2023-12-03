const fs = require('node:fs')

const input = fs.readFileSync(__dirname + '/input.txt', 'utf8')

const testData = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`

const numberRegex = /[0-9]+/

const symbolRegex = /[^0-9\s\.]/

const peek = (input) => { console.log(input); return input }

const sum = (acc, num) => acc + num

const parseLine = (line, offset, acc) => {
    const numberMatch = line.match(numberRegex)
    const symbolMatch = line.match(symbolRegex)

    if (!numberMatch && !symbolMatch) {
        return acc
    }

    if (numberMatch && (!symbolMatch || numberMatch.index < symbolMatch.index)) {
        // Next match is a number
        const number = numberMatch[0]
        const charactersToSlice = numberMatch.index + number.length
        return parseLine(
            line.slice(charactersToSlice),
            offset + charactersToSlice,
            [...acc, { type: 'number', value: number, start: offset + numberMatch.index, end: offset + charactersToSlice }]
        )
    } else {
        // Next match is a symbol
        const symbol = symbolMatch[0]
        const charactersToSlice = symbolMatch.index + symbol.length
        return parseLine(
            line.slice(charactersToSlice),
            offset + charactersToSlice,
            [...acc, { type: 'symbol', value: symbol, start: offset + symbolMatch.index, end: offset + charactersToSlice, isGear: symbol === '*' }]
        )
    }
}

const findNeighbor = (type) => (line, start, end) => {

    return line
        .filter(obj => obj.type === type)
        .filter(obj => obj.start <= end)
        .filter(obj => obj.end >= start)
}

const getValidNumbers = (prevLine, line, nextLine) => {
    return line
        .filter(obj => obj.type === 'number')
        .filter(numObj => {
            const symbols = [
                findNeighbor('symbol')(prevLine, numObj.start, numObj.end),
                findNeighbor('symbol')(line, numObj.start, numObj.end),
                findNeighbor('symbol')(nextLine, numObj.start, numObj.end)
            ]

            return symbols.map(arr => arr.length).reduce(sum, 0) > 0
        })
        .map(numObj => parseInt(numObj.value, 10))
}

const getGearRatios = (prevLine, line, nextLine) => {
    return line
        .filter(obj => obj.isGear)
        .map(gear => {
            const nums = [
                findNeighbor('number')(prevLine, gear.start, gear.end),
                findNeighbor('number')(line, gear.start, gear.end),
                findNeighbor('number')(nextLine, gear.start, gear.end),
            ]

            return { ...gear, nums: nums.flat().map(num => parseInt(num.value, 10)) }
        })
        .filter(gear => gear.nums.length === 2)
        .map(gear => gear.nums[0] * gear.nums[1])
}

const parseInput = (input) => input.trim().split('\n').map(line => parseLine(line, 0, []))

const solve3a = (input) => {
    const lines = parseInput(input)

    let validNumbersPerLine = []

    for (let i = 0; i < lines.length; i++) {
        const prevLine = i - 1 < 0 ? [] : lines[i - 1]
        const line = lines[i]
        const nextLine = i + 1 >= lines.length ? [] : lines[i + 1]

        validNumbersPerLine[i] = getValidNumbers(prevLine, line, nextLine)
    }

    return validNumbersPerLine.flat().reduce(sum, 0)
}

const solve3b = (input) => {
    const lines = parseInput(input)

    let gearRatiosPerLine = []

    for (let i = 0; i < lines.length; i++) {
        const prevLine = i - 1 < 0 ? [] : lines[i - 1]
        const line = lines[i]
        const nextLine = i + 1 >= lines.length ? [] : lines[i + 1]

        gearRatiosPerLine[i] = getGearRatios(prevLine, line, nextLine)
    }

    return gearRatiosPerLine.flat().reduce(sum, 0)
}

console.log(solve3a(testData))
console.log(solve3a(input))
console.log(solve3b(testData))
console.log(solve3b(input))
