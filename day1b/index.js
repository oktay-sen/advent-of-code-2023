const fs = require('node:fs')

const input = fs.readFileSync(__dirname + '/input.txt', 'utf8')

const testData = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`

const reverse = str => str.split('').reverse().join('')

const numberNamesToValues = {
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9',
    'ten': '10',
    'eleven': '11',
    'twelve': '12',
    'thirteen': '13',
    'fourteen': '14',
    'fifteen': '15',
    'sixteen': '16',
    'seventeen': '17',
    'eighteen': '18',
    'nineteen': '19',
    'twenty': '20',
    'thirty': '30',
    'forty': '40',
    'fifty': '50',
    'sixty': '60',
    'seventy': '70',
    'eighty': '80',
    'ninety': '90',
    'hundred': '100',
    'thousand': '1000',
    'million': '1000000',
    'billion': '1000000000',
    'trillion': '1000000000000',
}

const allNumbersToValues = {
    ...numberNamesToValues,
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
}

const forwardRegexes =
    Object
        .entries(allNumbersToValues)
        .map(([name, value]) => [name, value[0]])
        .map(([name, value]) => [new RegExp('(' + name + ')'), value])


const backwardRegexes =
    Object
        .entries(allNumbersToValues)
        .map(([name, value]) => [name, value[value.length - 1]])
        .map(([name, value]) => [new RegExp('(' + reverse(name) + ')'), value])


const findFirstNumber = (str) => {
    const result = forwardRegexes
        .map(([regex, num]) => {
            const match = str.match(regex)

            if (match) {
                return { num, index: match.index }
            } else {
                return null
            }
        })
        .filter(result => result)
        .sort((a, b) => a.index - b.index)[0]?.num

    console.log('First number in', str, 'is', result)

    return result
}

const findLastNumber = (str) => {
    const result = backwardRegexes
        .map(([regex, num]) => {
            const match = reverse(str).match(regex)

            if (match) {
                return { num, index: match.index }
            } else {
                return null
            }
        })
        .filter(result => result)
        .sort((a, b) => a.index - b.index)[0]?.num


    console.log('Last number in', str, 'is', result)

    return result
}

const findNumber = (str) => parseInt('' + findFirstNumber(str) + findLastNumber(str), 10)

const naiveReplaceNumberNamesToValues = (str) => Object
    .entries(numberNamesToValues)
    .reduce((acc, [name, value]) => acc.replaceAll(name, value), str)


const replaceNumberNamesToValues = (str) => {
    let result = str

    while (true) {

        const matches = Object
            .entries(numberNamesToValues)
            .map(([name, value]) => result.match(new RegExp('(' + name + ')')))
            .filter(match => match)
            .sort((a, b) => a.index - b.index)

        console.log('matches:', matches)

        if (!matches.length) {
            const naiveResult = naiveReplaceNumberNamesToValues(str)
            if (result !== naiveResult) {
                console.log('Turned', str, 'into', result, 'rather than', naiveResult)
            }
            return result
        }

        const selectedMatch = matches[0]

        result = result.replace(new RegExp(selectedMatch[1]), numberNamesToValues[selectedMatch[1]])
    }
}

const strTo2DigitNum = (str) => {
    const nums = Array.from(str).filter(ch => ch.match(/[0-9]/))

    if (nums.length < 1) {
        return 0
    }
    const result = parseInt(nums[0] + nums[nums.length - 1], 10)

    return result
}

const solve = data => data
    .split('\n')
    .map(replaceNumberNamesToValues)
    .map(strTo2DigitNum)
    .filter(num => !isNaN(num))
    .reduce((num1, num2) => num1 + num2)

const solve2 = data => data
    .split('\n')
    .map(findNumber)
    .filter(num => !isNaN(num))
    .reduce((num1, num2) => num1 + num2)

// console.log(solve2(testData))

console.log(solve2(input))

// console.log(solve2('sgoneightfoureight5sevenjzsqghg'))

