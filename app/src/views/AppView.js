/*** AppView.js ***/

define(function(require, exports, module) {
    var PhysicsEngine    = require('famous/physics/PhysicsEngine');
    var Repulsion        = require('famous/physics/forces/Repulsion');
    var Circle           = require('famous/physics/bodies/Circle');
    var Walls            = require('famous/physics/constraints/Walls');
    var View             = require('famous/core/View');
    var Surface          = require('famous/core/Surface');

    var MenuView         = require('views/MenuView');

    function AppView() {
        View.apply(this, arguments);

        _createPhysicsEngine.call(this);
        _addSun.call(this);
        _addPlanets.call(this);

    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {

    };

    function _createPhysicsEngine() {
        this.physicsEngine = new PhysicsEngine();
        this.repulsion = new Repulsion({
            strength : this.options.repulsionStrength || -10,
            range : this.options.range || [150, Infinity]
        });
    }

    function _addSun() {
        var starSurface =  new Surface({
            size : [100, 100],
            properties : {
                background : '#F2B134',
                borderRadius : '50%'
            }
        });

        this.star = new Circle({
            position : [
                window.innerWidth / 2,
                window.innerHeight / 2.5,
                0
            ]
        });

        this.physicsEngine.addBody(this.star);
        this.add(this.star).add(starSurface);
    }

    function _addPlanets() {
        for(var i = 0; i < 1; i++) {
            var planet = new Circle({
                position : [
                    window.innerWidth / 2 + 200,
                    window.innerHeight / 2.5,
                    0
                ],
                velocity : [
                    0,
                    0.2,
                    0
                ]
            });

            var planetSurface =  new Surface({
                size : [50,50],
                properties : {
                    // background : '#' + Math.floor(Math.random()*16777215).toString(16),
                    background : '#ED553B',
                    borderRadius : '50%'
                }
            });

            this.physicsEngine.addBody(planet);
            this.physicsEngine.attach(this.repulsion, planet, this.star);
            this.add(planet).add(planetSurface);
        }
    }

    module.exports = AppView;
});