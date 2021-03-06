const fs = require('fs')
const directory = './data/'
const resultsFile = './stats.csv'

var results = '#dir, user, phone, position, surface, duration(s), steps \n'
console.log('\n----------Checking csv files\n')

// Get data from csv
var subdirs = fs.readdirSync(directory)
if (subdirs.length === 0) throw 'No files to read in the data directory !'

subdirs.forEach(function (subdir, index) {
  if (fs.lstatSync(directory + subdir).isDirectory()) {
    if (!subdir.startsWith('_')) {
      let words = subdir.split('_')
      let phone = words[0]
      let user = words[1]
      let surface = words[2]
      let position = words[3]
      let index = words[4]

      let txt = fs.readFileSync(directory + subdir + '/stepcounter.csv')
      let lines = txt.toString().split('\n')
      let steps = 0
      let duration = 0
      let start = 0
      let prev = 0
      for (let i = 0; i < lines.length; i++) {
        // 578088453544940,1,1
        let line = lines[i]
        let cols = line.split(',')
        if (cols.length > 1) {
          let time = parseInt(cols[0])
          let foot1 = parseInt(cols[1])
          let foot2 = parseInt(cols[2])
          let state = foot1 + foot2

          if (i === 1) {
            start = time
            prev = state
          } else duration = time - start
          if (state !== prev) {
            steps++
            prev = state
          }
        }
      }
      duration = Math.floor(duration / 1e9)
      results += subdir + ', ' + user + ', ' + phone + ', ' + position + ', ' + surface + ', ' + duration + ', ' + steps + '\n'
    }
  }
})

fs.writeFileSync(resultsFile, results)
