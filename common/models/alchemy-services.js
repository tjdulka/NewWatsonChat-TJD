/**
* @Date:   2017-02-07T09:23:48-06:00
* @Last modified time: 2017-03-03T00:44:37-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



'use strict'

import {genericRequestPromise} from '../util/api'

module.exports = function (AlchemyServices) {
  AlchemyServices.disableRemoteMethod('invoke', true)
  // Define the getSentiment method
  AlchemyServices.getSentiment = async function (text, cb) {
    let sentiment = {}
    try {
      /** Get a response from conversation */
      sentiment = await genericRequestPromise({
        url: process.env.ALCHEMY_BASE_URL + process.env.ALCHEMY_SENTIMENT_PATH,
        method: 'POST',
        qs: {
          apikey: process.env.ALCHEMY_API_KEY,
          text: text,
          outputMode: 'json',
          language: 'english'
        }
      })
    } catch (e) {
      console.log(e)
      throw (e)
    }
    if (sentiment && sentiment.docSentiment) {
      return [sentiment.docSentiment.score || 0, sentiment.docSentiment.type || 'unknown']
    } else {
      return [0, 'unknown']
    }
  }

  // Define the getEmotion method
  AlchemyServices.getEmotion = async function (text, cb) {
    let emotions = {}
    try {
      /** Get a response from conversation */
      emotions = await genericRequestPromise({
        url: process.env.ALCHEMY_BASE_URL + process.env.ALCHEMY_EMOTION_PATH,
        method: 'POST',
        qs: {
          apikey: process.env.ALCHEMY_API_KEY,
          text: text,
          outputMode: 'json'
        }
      })
    } catch (e) {
      console.log(e)
      throw (e)
    }
    let highScore = -1
    let primaryEmotion = ''
    if (emotions.docEmotions) {
      for (let property in emotions.docEmotions) {
        if (Number(emotions.docEmotions[property]) > highScore) {
          primaryEmotion = property
          highScore = Number(emotions.docEmotions[property])
        } else if (Number(emotions.docEmotions[property]) === highScore) {
          primaryEmotion += ', ' + property
        }
      }
    } else {
      return ['no emotion', 0]
    }
    return [highScore === 0 ? 'no emotion' : primaryEmotion, highScore]
  }

  // Register the Remote Method
  AlchemyServices.remoteMethod(
    'getSentiment', {
      description: 'Returns the primary emotion of the supplied text',
      http: {
        path: '/getSentiment',
        verb: 'get'
      },
      accepts: [
        {
          arg: 'text',
          type: 'string',
          http: {source: 'query'},
          description: 'Text input for sentiment analysis',
          required: true
        }
      ],
      returns: [
        {
          arg: 'sentimentScore',
          type: 'number',
          description: 'The sentiment score of the supplied text'
        },
        {
          arg: 'sentimentType',
          type: 'string',
          description: 'The classified sentiment based on score (positive, negative, neutral)'
        }
      ]
    }
  )

  // Register the Remote Method
  AlchemyServices.remoteMethod(
    'getEmotion', {
      description: 'Returns the primary emotion for the supplied text',
      http: {
        path: '/getEmotion',
        verb: 'get'
      },
      accepts: [
        {
          arg: 'text',
          type: 'string',
          http: {source: 'query'},
          description: 'Text input for emotion analysis',
          required: true
        }
      ],
      returns: [
        {
          arg: 'primaryEmotion',
          type: 'string',
          description: 'The primary emotion of the supplied text'
        },
        {
          arg: 'primaryEmotionScore',
          type: 'number',
          description: 'The confidence score for the primary emotion'
        }
      ]
    }
  )
}
