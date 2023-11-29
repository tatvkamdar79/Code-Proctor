const { Response } = require('express');

const sendData = (res, message, data, success, status) => {
    res.status(status).send({
        success,
        message,
        data
    });
};

module.exports.sendSuccess = (res, message, data = {}, status = 200) => {
    sendData(res, message, data, true, status);
};

module.exports.sendError = (res, message, data = {}, status = 400) => {
    sendData(res, message, data, false, status);
};