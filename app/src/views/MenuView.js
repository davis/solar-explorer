/*** MenuView.js ***/

define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var MenuItemView  = require('views/MenuItemView');

    function MenuView() {
        View.apply(this, arguments);

        _addItem1.call(this);
        _addItem2.call(this);
    }

    MenuView.prototype = Object.create(View.prototype);
    MenuView.prototype.constructor = MenuView;

    MenuView.DEFAULT_OPTIONS = {};

    function _addItem1() {
        var menuItemView = new MenuItemView({
            color: '#3AF781',
            icon: '<i class="fa fa-cube fa-2x"></i>'
        });

        var menuItemModifier = new StateModifier({
            // TODO: don't hardcode this
            transform: Transform.translate(20, 20, 0)
        });

        this.add(menuItemModifier).add(menuItemView);

        menuItemView.on('click', function(){
            console.log('heard');
        });
    }

    function _addItem2() {
        var menuItemView = new MenuItemView({
            // color: '#167872',
            icon: '<i class="fa fa-bell fa-2x"></i>'
        });

        var menuItemModifier = new StateModifier({
            // TODO: don't hardcode this
            transform: Transform.translate(90, 20, 0)
        });

        this.add(menuItemModifier).add(menuItemView);

        menuItemView.on('click', function(){
            console.log('heard');
        });
    }

    module.exports = MenuView;
});
