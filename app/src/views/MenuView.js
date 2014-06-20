/*** MenuView.js ***/

define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    function MenuView() {
        View.apply(this, arguments);

        _addItem1.call(this);
        _addItem2.call(this);
    }

    MenuView.prototype = Object.create(View.prototype);
    MenuView.prototype.constructor = MenuView;

    MenuView.DEFAULT_OPTIONS = {};

    module.exports = MenuView;
});
