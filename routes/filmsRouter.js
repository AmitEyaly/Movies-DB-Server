const express = require('express');
const router = express.Router();
const filmsBLL = require("../BLL/filmsBLL");
const sessionDataBLL = require('../BLL/sessionDataBLL')


router.get('/', async (req, res) => {
    let token = req.session.token;

    let response = await filmsBLL.showAllfilms(token);

    if (req.session.views > 9) {
        res.send('you have riched the dayli limit')
    }
    else {
        req.session.views++;
        await sessionDataBLL.writeData(
            {sessionId: req.sessionID,
            actionNum: req.session.views,
            actionType: "HomePage"});
        res.send(response);
    }
});

router.get('/:_id', async (req, res) => {
    let token = req.session.token;
    let id = req.params._id;
    let response = await filmsBLL.showFilmsById(token, id);

    if (req.session.views > 9) {
        res.send('you have riched the dayli limit')
    }
    else {
        req.session.views = req.session.views ? req.session.views + 1 : 1;
        await sessionDataBLL.writeData(
            {sessionId: req.sessionID,
            actionNum: req.session.views,
            actionType: "Film by Id serch"});
        res.send(response);
    }
});



module.exports = router;