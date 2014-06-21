/*** MainMenuView.js ***/

define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    function MainMenuView() {
        View.apply(this, arguments);
    }

    MainMenuView.prototype = Object.create(View.prototype);
    MainMenuView.prototype.constructor = MainMenuView;

    MainMenuView.DEFAULT_OPTIONS = {};

    var surface = new Surface({
        content: 'solar system'
    });

    this.add(surface);

    module.exports = MainMenuView;
});
