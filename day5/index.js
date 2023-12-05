const fs = require('node:fs')

const input = fs.readFileSync(__dirname + '/input.txt', 'utf8')

const testData = `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`

const maps = [
    'seed-to-soil',
    'soil-to-fertilizer',
    'fertilizer-to-water',
    'water-to-light',
    'light-to-temperature',
    'temperature-to-humidity',
    'humidity-to-location'
]


const seedsRegex = /seeds: (?<seeds>[\d ]+)/

const mapRegexTemplate = " map:\\n(?<maps>[\\d \\n]+)"

const getSeeds = input => {
    const match = input.match(seedsRegex)

    if (!match) {
        throw 'Could not find seeds'
    }

    const result = match.groups.seeds.split(' ').map(seed => parseInt(seed, 10))

    return result
}

const getSeedRanges = input => {
    const nums = getSeeds(input)

    const seeds = nums.filter((n, i) => i % 2 === 0)
    const counts = nums.filter((n, i) => i % 2 === 1)



    let result = []
    for (let i = 0; i < seeds.length; i++) {
        result[i] = {
            start: seeds[i],
            end: seeds[i] + counts[i]
        }
    }

    console.log('seedRanges', result)
    return result
}

const getMap = (mapName) => (input) => {
    const regex = new RegExp(mapName + mapRegexTemplate)

    const match = input.match(regex)

    if (!match) {
        throw 'Could not find ' + mapName + ' map'
    }

    return match.groups.maps.split('\n').map(line => {
        const mappings = line.split(' ').map(num => parseInt(num, 10))
        if (mappings.length != 3) {
            return null
        }

        const [destStart, sourceStart, size] = mappings

        return {
            mapName,
            sourceStart,
            sourceEnd: sourceStart + size,
            destStart,
            destEnd: destStart + size,
            size
        }
    }).filter(map => map)
}

const peek = (input) => { console.log(input); return input }

const sum = (acc, num) => acc + num

const useMapping = (num, mappings) => {
    const mappedValues = mappings
        .filter(map => num >= map.sourceStart)
        .filter(map => num < map.sourceEnd)
        .map(map => map.destStart + (num - map.sourceStart))

    if (!mappedValues.length) {
        return num
    }

    return mappedValues[0]
}

const useMappingRanges = (range, mappings) => {
    const mappedValues = mappings
        .filter(map => range.start < map.sourceEnd)
        .filter(map => range.end > map.sourceStart)
        .map(map => ({
            ...map,
            collisionStart: Math.max(map.sourceStart, range.start),
            collisionEnd: Math.min(map.sourceEnd, range.end)
        }))
        .map(map => ({
            ...map,
            resultStart: map.destStart + (map.collisionStart - map.sourceStart),
            resultEnd: map.destStart + (map.collisionEnd - map.sourceStart)
        }))
        .sort((a, b) => a.collisionStart - b.collisionStart)

    let results = []
    let i = range.start

    mappedValues.forEach(map => {
        if (map.collisionStart !== i) {
            results.push({ start: i, end: map.collisionStart })
        }
        results.push({ start: map.resultStart, end: map.resultEnd })
        i = map.collisionEnd
    })

    if (i < range.end) {
        results.push({ start: i, end: range.end })
    }

    console.log('range', range, 'output', results)

    return results
}

const solve5a = (input) => {
    const seeds = getSeeds(input)

    const mappings = maps.map(mapName => getMap(mapName)(input))

    const mappedValues = mappings.reduce(
        (sources, mapping) => {
            const result = sources.map(source => useMapping(source, mapping))

            mapping.forEach(({ mapName, sourceStart, destStart, size }) => console.log(mapName, destStart, sourceStart, size))
            console.log(sources)
            console.log(result)
            return result
        },
        seeds
    )

    return mappedValues.sort((a, b) => a - b)[0]
}

const solve5b = (input) => {
    const seedRanges = getSeedRanges(input)

    const mappings = maps.map(mapName => getMap(mapName)(input))

    const mappedValues = mappings.reduce(
        (ranges, mapping) => {
            const result = ranges.flatMap(range => useMappingRanges(range, mapping))

            return result
        }, seedRanges)

    return mappedValues.map(range => range.start).sort((a, b) => a - b)[0]
}

// console.log(solve5a(testData))
// console.log(solve5a(input))
// console.log(solve5b(testData))
console.log(solve5b(input))
