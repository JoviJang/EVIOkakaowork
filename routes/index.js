var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', apiKey: process.env.KAKAOAPIKEY });
});

router.get('/info/:userEmail', function(req, res, next) {
  console.log(process.env.KAKAOAPIKEY);
  axios.get("https://api.kakaowork.com/v1/users.find_by_email?email=" + req.params.userEmail, {
    headers: {
        'Authorization': `Bearer ${process.env.KAKAOAPIKEY}`
    }
  }).then(result => {
    // console.log(JSON.stringify(result.data));
    res.render('info', {email: req.params.userEmail, apiKey: process.env.KAKAOAPIKEY, result: result.data});
  }).catch(error => next(error));
});

router.post('/info', async function(req, res, next) {
  let result, conversation, message;
  try {
    result = await axios.get("https://api.kakaowork.com/v1/users.find_by_email?email=" + req.body.userEmail, {
      headers: {
          'Authorization': `Bearer ${process.env.KAKAOAPIKEY}`
      }
    });
  } catch (error) {
    next(error);
  }
  // console.log(result.data);
  const userId = result.data.user.id;
  console.log(userId);
  // conversation open
  try {
    conversation = await axios.post("https://api.kakaowork.com/v1/conversations.open", {
      user_id: userId
    } , {
      headers: {
          'Authorization': `Bearer ${process.env.KAKAOAPIKEY}`
      }
    });
  } catch (error) {
    next(error);
  }
  console.log('conversation', conversation);
  // message
  try {
    let messageData = {
      "conversation_id": conversation.data.conversation.id,
      "text": req.body.firstName,
      "blocks": [
        {
          "type": "header",
          "text": req.body.lastName,
          "style": "blue"
        },
        {
          "type": "text",
          "text": req.body.firstName,
          "markdown": true
        },
        {
          "type": "divider"
        },
        {
          "type": "image_link",
          "url": "https://t1.kakaocdn.net/kakaowork/resources/block-kit/imagelink/image1@3x.jpg"
        },
        {
          "type": "action",
          "elements": [
            {
              "type": "button",
              "text": "승인",
              "style": "primary"
            },
            {
              "type": "button",
              "text": "반려",
              "style": "danger"
            }
          ]
        },
        {
          "type": "description",
          "term": "일시",
          "content": {
            "type": "text",
            "text": "2020년 9월 16일 7시",
            "markdown": false
          },
          "accent": true
        }
      ]
    };
    message = await axios.post("https://api.kakaowork.com/v1/messages.send", messageData , {
      headers: {
          'Authorization': `Bearer ${process.env.KAKAOAPIKEY}`
      }
    });
  } catch (error) {
    next(error);
  }
  console.log(message.data);
  res.json(message.data);
  // res.send(result.data);
});

module.exports = router;
