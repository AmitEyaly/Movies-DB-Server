const express = require('express');
const router = express.Router();
const filmsBLL = require("../BLL/filmsBLL");
const sessionDataBLL = require('../BLL/sessionDataBLL');

router.post('/:userId', async (req, res) => {
    let token = req.session.token;
    let obj = req.body;
    let userId = req.params.userId;
    let response = await filmsBLL.saveNewFilm(token, obj, userId);

    if (req.session.views > 9) {
        res.send('you have riched the dayli limit')
    }
    else {
        req.session.views = req.session.views ? req.session.views + 1 : 1;
        await sessionDataBLL.writeData(
            {sessionId: req.sessionID,
            actionNum: req.session.views,
            actionType: "Posting a new film"});
        res.send(response);
    }
});

router.get('/:userId', async (req, res) => {
    let token = req.session.token;
    let userId = req.params.userId;
    let response = await filmsBLL.showFilmsByUserId(token, userId);

    if (req.session.views > 9) {
        res.send('you have riched the dayli limit')
    }
    else {
        req.session.views = req.session.views ? req.session.views + 1 : 1;
        await sessionDataBLL.writeData(
            {sessionId: req.sessionID,
            actionNum: req.session.views,
            actionType: "Getting User's films"});
        res.send(response);
    }
});

router.put('/:userId', async (req, res) => {
    let token = req.session.token;
    let userId = req.params.userId;
    let updatedDetails = req.body;
    let response = await filmsBLL.updateFilmById(token, userId, updatedDetails);

    
    if (req.session.views > 9) {
        res.send('you have riched the dayli limit')
    }
    else {
        req.session.views = req.session.views ? req.session.views + 1 : 1;
        await sessionDataBLL.writeData(
            {sessionId: req.sessionID,
            actionNum: req.session.views,
            actionType: "Updating a film's details"});
        res.send(response);
    }
});

router.delete('/:userId', async (req, res) => {
    let token = req.session.token;
    let userId = req.params.userId;
    let filmId = req.body._id;
    let response = await filmsBLL.deleteFilmById(token, userId, filmId);
    if (req.session.views > 9) {
        res.send('you have riched the dayli limit')
    }
    else {
        req.session.views = req.session.views ? req.session.views + 1 : 1;
        await sessionDataBLL.writeData(
            {sessionId: req.sessionID,
            actionNum: req.session.views,
            actionType: "Deleting a film"});
        res.send(response);
    }
});


module.exports = router;