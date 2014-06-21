/*** MainMenuView.js ***/

define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    function MainMenuView() {
        View.apply(this, arguments);

        this.rootModifier = new StateModifier({
        });

        this.mainNode = this.add(this.rootModifier);

        _addTitleBackground.call(this);
        _addTitle.call(this);
        _addPlayBackground.call(this);
        _addPlay.call(this);
    }

    MainMenuView.prototype = Object.create(View.prototype);
    MainMenuView.prototype.constructor = MainMenuView;

    MainMenuView.DEFAULT_OPTIONS = {};

    function _addTitleBackground() {
        var surface = new Surface({
            size: [400, 200],
            properties: {
                background: '#eee',
                border: '5px solid #222'
            }
        });

        var modifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.3],
            opacity: 0.7
        });

        this.mainNode.add(modifier).add(surface);
    }

    function _addTitle() {
        var surface = new Surface({
            size: [true, true],
            content: 'solar system',
            properties: {
                color: '#222',
            }
        });
        // TODO: do this during instantiation
        surface.addClass('main-menu-title');

        var modifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.3]
        });
        this.mainNode.add(modifier).add(surface);
    }

    function _addPlayBackground() {
        var surface = new Surface({
            size: [150, 76],
            properties: {
                background: '#ED553B',
                border: '5px solid #222'
            }
        });

        var modifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.65, 0.75]
        });

        this.mainNode.add(modifier).add(surface);
        surface.on('mouseup', function() {
            this._eventOutput.emit('startGame');
        }.bind(this));
    }

    function _addPlay() {
        var surface = new Surface({
            size: [true, true],
            content: 'solar system',
            properties: {
                color: 'white',
                pointerEvents: 'none'
            }
        });
        // TODO: do this during instantiation
        surface.addClass('main-menu-play');
        
        var modifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.65, 0.75],
        });
        this.mainNode.add(modifier).add(surface);
    }

    module.exports = MainMenuView;
});
