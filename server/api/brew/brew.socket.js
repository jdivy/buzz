/**
 * Socket.io events related to brew activities.
 */
'use strict';

var Brew = require('./brew.model');

exports.register = function(socket) {
  Brew.schema.post('save', function (brew) {
    onSave(socket, brew);
  });
};

function onSave(socket, brew) {
  socket.emit('brew:save', brew);
}
