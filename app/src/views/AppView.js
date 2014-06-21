/*** AppView.js ***/

define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Lightbox = require('famous/views/Lightbox');
    var Easing = require('famous/transitions/Easing');

    var Level1View = require('views/levels/Level1View');

    function AppView() {
        View.apply(this, arguments);

        this.rootModifier = new StateModifier({
        });

        this.mainNode = this.add(this.rootModifier);

        _createLightbox.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        lightboxOpts: {
            inOpacity: 1,
            outOpacity: 0,
            inOrigin: [0, 0],
            outOrigin: [0, 0],
            showOrigin: [0, 0],
            inTransform: Transform.thenMove(Transform.rotateX(0.9), [0, -300, -300]),
            outTransform: Transform.thenMove(Transform.rotateZ(0.7), [0, window.innerHeight, -1000]),
            inTransition: { duration: 650, curve: 'easeOut' },
            outTransition: { duration: 500, curve: Easing.inCubic }
        }
    };

    function _createLightbox() {
        this.levels = [];
        this.currentIndex = 0;

        this.lightbox = new Lightbox(this.options.lightboxOpts);
        this.mainNode.add(this.lightbox);

        this.levels.push(new Level1View());

        this.showCurrentLevel();
    }

    AppView.prototype.showCurrentLevel = function() {
        this.ready = false;
        var level = this.levels[this.currentIndex];
        this.lightbox.show(level, function() {
            this.ready = true;
            // level.fadeIn();
        }.bind(this));
    };

    module.exports = AppView;
});
