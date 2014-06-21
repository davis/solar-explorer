/*** AppView.js ***/

define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Lightbox = require('famous/views/Lightbox');
    var Easing = require('famous/transitions/Easing');

    var MainMenuView   = require('views/MainMenuView');
    var Level1View = require('views/levels/Level1View');
    var Level2View = require('views/levels/Level2View');

    function AppView() {
        View.apply(this, arguments);

        this.rootModifier = new StateModifier({
        });

        this.mainNode = this.add(this.rootModifier);

        _createLightbox.call(this);
        _setListeners.call(this);
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

        this.levels.push(new MainMenuView());
        this.levels.push(new Level1View());
        this.levels.push(new Level2View());

        this.showCurrentLevel();
    }

    function _setListeners() {

        this.levels[this.currentIndex].on('startGame', function() {
            this.currentIndex = 0;
            this.showNextLevel();
        }.bind(this));


        for(var i = 0; i < this.levels.length; i++) {
            this.levels[i].on('changeLevel', function(level) {
                this.currentIndex = level-1; // TODO: don't do this
                this.showNextLevel();
            }.bind(this));
        }
    }

    AppView.prototype.showCurrentLevel = function() {
        this.ready = false;
        var level = this.levels[this.currentIndex];
        this.lightbox.show(level, function() {
            this.ready = true;
        }.bind(this));
    };

    AppView.prototype.showNextLevel = function() {
        if (!this.ready) return;

        this.currentIndex++;
        if (this.currentIndex === this.levels.length) this.currentIndex = 0;
        this.showCurrentLevel();
    };

    module.exports = AppView;
});
