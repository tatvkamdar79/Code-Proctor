const express = require('express');
const Room = require('../models/Room');
const { sendSuccess, sendError } = require('../utils');

const router = express.Router();

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const room = await Room.findById(id);
    if (!room) {
        return sendError(res, 'Not a valid id');
    }
    let data = {
        id: room._id,
        title: room.title,
        body: room.body,
        input: room.input,
        language: room.language
    };
    sendSuccess(res, 'Room fetched successfully', data);
});

router.patch('/:id', async (req, res) => {
    const { title, body, input, language } = req.body;
    if (!title) return sendError(res, "Title can't be empty");
    const id = req.params.id;

    const room = await Room.findById(id);
    if (!room) {
        return sendError(res, 'Not a valid id');
    }

    let data = { id: room._id };
    await Room.findByIdAndUpdate(id, { title, body, id, input, language });
    sendSuccess(res, 'Room updated successfully', data);
});

router.post('/', async (req, res) => {
    const { title, body, input, language } = req.body;
    if (!title) return sendError(res, "Title can't be empty");
    try {
        const room = await Room.create(req.body);
        sendSuccess(res, 'Room created successfully', { id: room._id });
    } catch (err) {
        sendError(res, err.message);
    }
});

module.exports = router;