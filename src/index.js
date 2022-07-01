const { Hash } = require('crypto')
const https = require('https')
const { JSDOM } = require('jsdom')
const request = require('request')

const BASE_SITE_URL = 'https://wooordhunt.ru'

function handleDOM(dom) {
    const doc = dom.window.document
    const res = {}

    const word = doc.querySelector('h1').childNodes[0].nodeValue.trim('')

    const usTranscription = doc.querySelector(
        '#us_tr_sound .transcription'
    ).textContent

    const ruTranslate = doc.querySelector('#content_in_russian')

    const audioUrl = doc.getElementById('audio_us').childNodes[1].src

    return {
        audio: {
            url: `${BASE_SITE_URL}${audioUrl}`,
            filename: audioUrl.match(/data.*/)[0].replaceAll('/', '-'),
        },
        word,
        transcription: usTranscription,
        translate: ruTranslate,
    }
}

function createAnkiCard(cardData) {
    const postData = JSON.stringify({
        action: 'guiAddCards',
        version: 6,
        params: {
            note: {
                deckName: '__TEMP__',
                modelName: '[LANG] vocabulary card',
                fields: {
                    Structure: cardData.word,
                    Transcription: cardData.transcription,
                    Sound: cardData.word,
                },
            },
        },
        audio: [
            {
                url: cardData.audio.url,
                filename: cardData.audio.filename,
                fields: ['Sound'],
            },
        ],
        picture: [
            {
                url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/EU-Romania.svg/285px-EU-Romania.svg.png',
                filename: 'romania.png',
                fields: ['Sound'],
            },
        ],
    })

    request.post(
        { url: 'http://127.0.0.1:8765', body: postData },
        (err, httpRes, body) => {
            if (err) {
                console.error('Create anki carad error: ', cardData)
            } else {
                console.log('Create anki card response: ', body)
            }
        }
    )
}

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

/*::Wfunction findTagByProp(string, propString) {
    const regEx = new RegExp(<.*?${propString}.*?>(.*?)</.*?>)
    const result = string.match(regEx)

    return result[1]
*/

const myArgs = process.argv.slice(2)

if (myArgs.length === 0) {
    console.error('Enter the search phrase as an argument!')
    return null
}

if (myArgs.length > 1) {
    console.error('To many arguments!')
    return null
}

// console.log(myArgs)
const phrase = myArgs[0]
// console.log('https://wooordhunt.ru/word/' + phrase)
https
    .get(`${BASE_SITE_URL}/word/${phrase}`, (resp) => {
        let data = ''

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk
        })

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            if (data === '') {
                console.error("Phrase don't found")
                return null
            }
            const dom = new JSDOM(data)
            const obj = handleDOM(dom)
            createAnkiCard(obj)
            console.log(obj)

            //            console.log(findTagByProp(data, 'id="us_tr_sound"'))
        })
    })
    .on('error', (err) => {
        console.log('Error: ' + err.message)
    })
