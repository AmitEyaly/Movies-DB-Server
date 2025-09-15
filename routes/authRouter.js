const express = require('express');
const router = express.Router();
const authBLL = require("../BLL/authBLL");

router.post('/register', async (req, res) => {
    let obj = req.body;
    let response = await authBLL.register(obj);
    res.send(response);
})
router.post('/login', async (req, res) => {
    let obj = req.body;
    let response = await authBLL.login(obj);
    req.session.token = response;
    req.session.views = req.session.views || 0;
    res.send("youre logged in!");
})

module.exports = router;