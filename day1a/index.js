const fs = require('node:fs')

const data = fs.readFileSync(__dirname + '/input.txt', 'utf8')

const result = data
    .split('\n')
    .map(str => {
        const nums = Array.from(str).filter(ch => ch.match(/[0-9]/))

        if (nums.length < 1) {
            return 0
        }
        return nums[0] + nums[nums.length - 1]
    })
    .map(str => parseInt(str, 10))
    .reduce((num1, num2) => num1 + num2)

console.log(result)