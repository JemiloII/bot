const reactions = require('./reactions');

const colors = new Map([
    ['🔶', 'Orange'],
    ['🔴', 'Red'],
    ['⚫', 'Black'],
    ['⚪', 'White'],
    ['🔵', 'Blue'],
    ['💛', 'Yellow'],
    ['💚', 'Green'],
    ['💜', 'Purple'],
    ['💗', 'Pink']
]);

const set = (reaction, userId) => reactions.set(colors, reaction, userId);

const remove = (reaction, userId) => reactions.remove(colors, reaction, userId);

module.exports = {
    remove,
    set
};
