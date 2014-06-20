/*** AppView.js ***/

define(function(require, exports, module) {
    var PhysicsEngine = require('famous/physics/PhysicsEngine');
    var Repulsion     = require('famous/physics/forces/Repulsion');
    var Circle        = require('famous/physics/bodies/Circle');
    var Walls         = require('famous/physics/constraints/Walls');
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier      = require('famous/core/Modifier');
    var GenericSync   = require('famous/inputs/GenericSync');
    var MouseSync     = require('famous/inputs/MouseSync');
    var TouchSync     = require('famous/inputs/TouchSync');
    var Transform     = require('famous/core/Transform');
    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});

    var MenuView      = require('views/MenuView');

    function AppView() {
        View.apply(this, arguments);

        _createPhysicsEngine.call(this);
        _addSun.call(this);
        _addPlanets.call(this);
        _addMenu.call(this);

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

        var sync = new GenericSync(['mouse', 'touch']);

        starSurface.pipe(sync);

        sync.on('update', function(data) {
            console.log('update');
            var cache = this.star.getPosition()
            this.star.setPosition([
                cache[0] + data.delta[0],
                cache[1] + data.delta[1],
                cache[2]
            ]);

        }.bind(this));

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
            // iife for each planet
            (function() {
                var planet = new Circle({
                    position : [
                        window.innerWidth / 2 + 200,
                        window.innerHeight / 2.5,
                        0
                    ],
                    velocity : [0, 0.2, 0]
                });

                var planetSurface =  new Surface({
                    size : [50,50],
                    properties : {
                        // background : '#' + Math.floor(Math.random()*16777215).toString(16),
                        background : '#ED553B',
                        borderRadius : '50%'
                    }
                });

                // initialize true position
                var _truePosition = planet.position.get();

                // this is what determines where planet shows up in the UI
                var planetModifier = new Modifier({
                    transform: function() {
                        return Transform.translate(truePosition()[0], truePosition()[1], truePosition()[2]);
                    }
                });

                var truePosition = function() {
                    if(override) {
                        planet.setPosition(_truePosition);
                    } else {
                        _truePosition = planet.getPosition();
                    }
                    return _truePosition;
                };

                var sync = new GenericSync(['mouse', 'touch']);
                planetSurface.pipe(sync);

                // initialize override as falsy
                var override;
                sync.on('start', function() { override = true; });

                // set trueposition via delta
                sync.on('update', function(data) {
                    console.log('update');
                    var cache = truePosition();
                    _truePosition = [
                        cache[0] + data.delta[0],
                        cache[1] + data.delta[1],
                        cache[2]
                    ];
                });

                // preserve velocity on mouseup
                sync.on('end', function(data) {
                    override = false;
                    planet.setVelocity([
                        data.velocity[0],
                        data.velocity[1],
                        0
                    ]);
                });

                this.physicsEngine.addBody(planet);
                this.physicsEngine.attach(this.repulsion, planet, this.star);
                this.add(planetModifier).add(planetSurface);
            }.bind(this))();
        }
    }

    function _addMenu() {
        var menuView = new MenuView();
        var menuViewModifier = new StateModifier();
        this.add(menuViewModifier).add(menuView);
    }

    module.exports = AppView;
});