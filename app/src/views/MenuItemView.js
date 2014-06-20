/*** MenuItemView.js ***/

define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    function MenuItemView() {
        View.apply(this, arguments);
    }

    MenuItemView.prototype = Object.create(View.prototype);
    MenuItemView.prototype.constructor = MenuItemView;

    MenuItemView.DEFAULT_OPTIONS = {};

    module.exports = MenuItemView;
});
