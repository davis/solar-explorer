/*** MenuItemView.js ***/

define(function(require, exports, module) {
    var View           = require('famous/core/View');
    var Surface        = require('famous/core/Surface');
    var Transform      = require('famous/core/Transform');
    var StateModifier  = require('famous/modifiers/StateModifier');
    var Transitionable = require('famous/transitions/Transitionable');

    function MenuItemView() {
        View.apply(this, arguments);

        this.rootModifier = new StateModifier({
            size: this.options.size
        });

        this.mainNode = this.add(this.rootModifier);

        _createMenuItemBackground.call(this);
        _createMenuItemIcon.call(this);
    }

    MenuItemView.prototype = Object.create(View.prototype);
    MenuItemView.prototype.constructor = MenuItemView;

    MenuItemView.DEFAULT_OPTIONS = {
        size: [50, 50],
        color: '#167872',
        icon: '<i class="fa fa-circle-thin"></i>'
    };

    function _createMenuItemBackground() {
        var menuItemSurface = new Surface({
            size: this.options.size,
            properties: {
                zIndex: 1,
                background: this.options.color
            }
        });

        this.mainNode.add(menuItemSurface);

        // use for listening to clicks on button
        menuItemSurface.on('mousedown', function() {
            console.log('down');
            this._eventOutput.emit('click');
        }.bind(this));
        menuItemSurface.on('mouseup', function() {
            console.log('up');
            this._eventOutput.emit('click');
        }.bind(this));
    }

    function _createMenuItemIcon() {
        var menuItemIcon = new Surface({
            size:[true, true],
            content: this.options.icon,
            properties: {
                zIndex: 2,
                pointerEvents: 'none'
            }
        });

        var menuItemIconModifier = new StateModifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
        });

        this.mainNode.add(menuItemIconModifier).add(menuItemIcon);
    }

    module.exports = MenuItemView;
});
