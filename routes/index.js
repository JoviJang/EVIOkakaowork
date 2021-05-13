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
      "text": "몰트 적립 신청서",
      "blocks": [
        {
          "type": "header",
          "text": req.body.first,
          "style": "blue"
        },
        {
          "type": "text",
          "text": req.body.second,
          "markdown": true
        },
        {
          "type": "divider"
        },
        {
          "type": "text",
          "text": req.body.thrid,
          "markdown": true
        },
        {
          "type": "divider"
        },
        {
          "type": "text",
          "text": req.body.fourth,
          "markdown": true
        },
        {
          "type": "divider"
        },
        {
          "type": "text",
          "text": req.body.fifth,
          "markdown": true
        },
        {
          "type": "divider"
        },
        {
          "type": "description",
          "term": "일시",
          "content": {
            "type": "text",
            "text": new Date().toISOString(),
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
