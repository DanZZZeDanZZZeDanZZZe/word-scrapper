const https = require('https')
const { JSDOM } = require('jsdom')
const request = require('request')

const BASE_SITE_URL = 'https://wooordhunt.ru'

function getUnderscores(word) {
    return new Array(word.length).fill('_').join('')
}

function replaceWordToUnderscores(word, str) {
    return str.replaceAll(word, getUnderscores(word))
}

function handleDOM(dom) {
    const doc = dom.window.document

    const word = doc
        .querySelector('h1')
        .childNodes[0].nodeValue.trim('')
        .toLowerCase()

    const explanation = doc.querySelector(
        '#content_in_russian > div.t_inline_en'
    ).textContent

    const usTranscription = doc.querySelector(
        '#us_tr_sound .transcription'
    ).textContent

    const ruTranslate = doc.querySelector('#content_in_russian')

    const audioUrl = doc.getElementById('audio_us').childNodes[1].src

    const examplesForAnswerArr = Array.from(
        Array.from(doc.querySelectorAll('h3'))
            .find((i) => i.textContent === 'Примеры')
            .nextElementSibling.querySelectorAll('p')
    ).map(
        (item, index) =>
            item.textContent.trim('') + (index % 2 ? '<br><br>' : '<br>')
    )

    const examplesForAnswer = examplesForAnswerArr.join('')
    const examplesForQuestion = replaceWordToUnderscores(
        word,
        examplesForAnswerArr.filter((_, index) => !(index % 2)).join('<br>')
    )

    console.log('examplesForAnswer', examplesForAnswer)
    return {
        audio: {
            url: `${BASE_SITE_URL}${audioUrl}`,
            filename: audioUrl.match(/data.*/)[0].replaceAll('/', '-'),
        },
        word,
        transcription: usTranscription,
        explanation,
        translate: ruTranslate,
        examplesForAnswer,
        examplesForQuestion,
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
                    Explanation: cardData.explanation,
                    'Examples (for answers)': cardData.examplesForAnswer,
                    'Examples (for question)': cardData.examplesForQuestion,
                },
                tags: ['en_word'],
                audio: [
                    {
                        url: cardData.audio.url,
                        filename: cardData.audio.filename,
                        fields: ['Sound'],
                    },
                ],
            },
        },
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

const myArgs = process.argv.slice(2)

if (myArgs.length === 0) {
    ;``
    console.error('Enter the search phrase as an argument!')
    return null
}

if (myArgs.length > 1) {
    console.error('To many arguments!')
    return null
}

const phrase = myArgs[0]
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
        })
    })
    .on('error', (err) => {
        console.log('Error: ' + err.message)
    })
