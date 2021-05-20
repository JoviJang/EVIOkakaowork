var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/list', async (req, res, next) => {
  let result = "";
  try {
      result = await axios.get("https://api.kakaowork.com/v1/users.list", {
          headers: {
              'Authorization': `Bearer ${process.env.KAKAOAPIKEY}`
          }
      });
      // console.log(result.data.users);
      let userList = result.data.users.map(user => {
        return {
          id: user.id,
          name: user.name,
          email: user.identifications[0].value,
        }
      })
      res.json(userList);
  } catch (error) {
      next(error);
  }
});

module.exports = router;
