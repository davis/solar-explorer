/*** Level2.js ***/

define(function(require, exports, module) {
    var PhysicsEngine = require('famous/physics/PhysicsEngine');
    var Repulsion     = require('famous/physics/forces/Repulsion');
    var Collision     = require('famous/physics/constraints/Collision');
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

    function Level2View() {
        View.apply(this, arguments);

        _createPhysicsEngine.call(this);
        _addSun.call(this);
        _addPlanets.call(this);
        _addMenu.call(this);

    }

    Level2View.prototype = Object.create(View.prototype);
    Level2View.prototype.constructor = Level2View;

    Level2View.DEFAULT_OPTIONS = {
        numberOfPlanets: 5
    };

    function _createPhysicsEngine() {
        this.physicsEngine = new PhysicsEngine();
        this.repulsion = new Repulsion({
            strength: this.options.repulsionStrength || -20,
            range: this.options.range || [100, Infinity]
        });
        this.collision = new Collision();
    }

    function _addSun() {
        var star = {};
        star.surface =  new Surface({
            size: [20, 20],
            properties: {
                background: '#F2B134',
                borderRadius: '50%',
                border: '2px solid #222',
                zIndex: 1
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
        this.planets = [];
        for(var i = 0; i < this.options.numberOfPlanets; i++) {
            _addPlanet.call(this);
        }
        
        // TODO: Figure out why this isn't working
        // for(var i = 0; i < planets.length; i++) {
        //     this.physicsEngine.attach(this.collision, planets, planets[i]);
        // }
    }

    function _addPlanet() {
        var planet = {};
        planet.surface =  new Surface({
            size: [100, 100],
            properties: {
                // background: '#' + Math.floor(Math.random()*16777215).toString(16),
                background: '#ED553B',
                borderRadius: '50%',
                border: '2px solid #222'
            }
        });

        planet.particle = new Circle({
            position: [
                Math.random() * window.innerWidth / 2 + 200,
                Math.random() * window.innerHeight / 2.5,
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
        this.planets.push(planet.particle);
    }

    function _addMenu() {
        var menuView = new MenuView();
        var menuViewModifier = new StateModifier();
        this.add(menuViewModifier).add(menuView);

        menuView.on('menuItemClicked', function(data){
            console.log('item', data, 'clicked');
            if(data === 0) {
                _addPlanet.call(this);
            } else if(data === 1) {
                // console.log(this);
                // this.physicsEngine.removeBody(this.physicsEngine.getBodies()[0]);
            }
        }.bind(this));
    }

    module.exports = Level2View;
});