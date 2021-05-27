var express = require('express');
var router = express.Router();
const axios = require('axios');
const moment = require('moment');

require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

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
  let userId, name, email, malts, date;
  userId = req.body.userId;
  name = req.body.name;
  email = req.body.userEmail;
  date = req.body.date;
  malts = req.body.malts;

  // try {
  //   result = await axios.get("https://api.kakaowork.com/v1/users.find_by_email?email=" + req.body.userEmail, {
  //     headers: {
  //         'Authorization': `Bearer ${process.env.KAKAOAPIKEY}`
  //     }
  //   });
  // } catch (error) {
  //   next(error);
  // }


  // 방 만들기 1회성 사용
  // try {
  //   result = await axios.get("https://api.kakaowork.com/v1/users.list", {
  //     headers: {
  //         'Authorization': `Bearer ${process.env.KAKAOAPIKEY}`
  //     }
  //   });
  // } catch (error) {
  //   next(error);
  // }
  // // // console.log(result.data);
  // const userList = result.data.users.map(obj => {
  //   return obj.id
  // });
  // try {
  //   conversation = await axios.post("https://api.kakaowork.com/v1/conversations.open", {
  //     user_ids: userList
  //   } , {
  //     headers: {
  //         'Authorization': `Bearer ${process.env.KAKAOAPIKEY}`
  //     }
  //   });
  // } catch (error) {
  //   next(error);
  // }

  // console.log(result.data);
  // const userId = result.data.user.id;
  // console.log(userId);
  // conversation open
  // try {
  //   conversation = await axios.post("https://api.kakaowork.com/v1/conversations.open", {
  //     user_id: userId
  //   } , {
  //     headers: {
  //         'Authorization': `Bearer ${process.env.KAKAOAPIKEY}`
  //     }
  //   });
  // } catch (error) {
  //   next(error);
  // }
  // console.log('conversation', conversation);
  // message
  try {
    let messageData = {
      "conversation_id": 1231896,
      "text": "몰트 적립 신청서",
      "blocks": [
        {
          "type": "header",
          "text": req.body.name + "의 몰트 적립",
          "style": "blue"
        },
        {
          "type": "text",
          "text": "근무날짜: " + req.body.date,
          "markdown": true
        },
        {
          "type": "text",
          "text": "근무시간: " + req.body.workingHours,
          "markdown": true
        },
        {
          "type": "text",
          "text": "근무내용: " + req.body.details,
          "markdown": true
        },
        {
          "type": "text",
          "text": "적립몰트: " + req.body.malts,
          "markdown": true
        },
        {
          "type": "divider"
        },
        {
          "type": "description",
          "term": "신청일시",
          "content": {
            "type": "text",
            "text": moment().format("MM월 DD일 HH시 mm분"),
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
