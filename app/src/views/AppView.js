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
        numberOfPlanets: 1
    };

    function _createPhysicsEngine() {
        this.physicsEngine = new PhysicsEngine();
        this.repulsion = new Repulsion({
            strength: this.options.repulsionStrength || -10,
            range: this.options.range || [150, Infinity]
        });
    }

    function _addSun() {
        var star = {};
        star.surface =  new Surface({
            size: [100, 100],
            properties: {
                background: '#F2B134',
                borderRadius: '50%'
            }
        });

        star.particle = new Circle({
            position: [
                window.innerWidth / 2,
                window.innerHeight / 2.5,
                0
            ]
        });

        // initialize true position
        var _truePosition = star.particle.position.get();

        // this is what determines where planet shows up in the UI
        star.modifier = new Modifier({
            transform: function() {
                return Transform.translate(star.truePosition()[0], star.truePosition()[1], star.truePosition()[2]);
            }
        });

        star.truePosition = function() {
            if(star.override) {
                star.particle.setPosition(star._truePosition);
            } else {
                star._truePosition = star.particle.getPosition();
            }
            return star._truePosition;
        };

        star.sync = new GenericSync(['mouse', 'touch']);
        star.surface.pipe(star.sync);

        // initialize override as falsy
        star.sync.on('start', function() { star.override = true; });

        // set trueposition via delta
        star.sync.on('update', function(data) {
            var cache = star.truePosition();
            star._truePosition = [
                cache[0] + data.delta[0],
                cache[1] + data.delta[1],
                cache[2]
            ];
        });

        // preserve velocity on mouseup
        star.sync.on('end', function(data) {
            star.override = false;
            star.particle.setVelocity([0, 0, 0]);
        });

        this.physicsEngine.addBody(star.particle);
        this.add(star.modifier).add(star.surface);
        this.star = star;
    }

    function _addPlanets() {
        for(var i = 0; i < 1; i++) {
            // iife for each planet
            (function() {
                var planet = {};
                planet.surface =  new Surface({
                    size: [50,50],
                    properties: {
                        // background: '#' + Math.floor(Math.random()*16777215).toString(16),
                        background: '#ED553B',
                        borderRadius: '50%'
                    }
                });

                planet.particle = new Circle({
                    position: [
                        window.innerWidth / 2 + 200,
                        window.innerHeight / 2.5,
                        0
                    ],
                    velocity: [0, 0.2, 0]
                });

                // initialize true position
                var _truePosition = planet.particle.position.get();

                // this is what determines where planet shows up in the UI
                planet.modifier = new Modifier({
                    transform: function() {
                        return Transform.translate(planet.truePosition()[0], planet.truePosition()[1], planet.truePosition()[2]);
                    }
                });

                planet.truePosition = function() {
                    if(planet.override) {
                        planet.particle.setPosition(planet._truePosition);
                    } else {
                        planet._truePosition = planet.particle.getPosition();
                    }
                    return planet._truePosition;
                };

                planet.sync = new GenericSync(['mouse', 'touch']);
                planet.surface.pipe(planet.sync);

                // initialize override as falsy
                planet.sync.on('start', function() { planet.override = true; });

                // set trueposition via delta
                planet.sync.on('update', function(data) {
                    var cache = planet.truePosition();
                    planet._truePosition = [
                        cache[0] + data.delta[0],
                        cache[1] + data.delta[1],
                        cache[2]
                    ];
                });

                // preserve velocity on mouseup
                planet.sync.on('end', function(data) {
                    planet.override = false;
                    planet.particle.setVelocity([
                        data.velocity[0],
                        data.velocity[1],
                        0
                    ]);
                });

                this.physicsEngine.addBody(planet.particle);
                this.physicsEngine.attach(this.repulsion, planet.particle, this.star.particle);
                this.add(planet.modifier).add(planet.surface);
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