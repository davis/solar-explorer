/*** Level1.js ***/

define(function(require, exports, module) {
    var PhysicsEngine = require('famous/physics/PhysicsEngine');
    var Repulsion     = require('famous/physics/forces/Repulsion');
    var Collision     = require('famous/physics/constraints/Collision');
    var View          = require('famous/core/View');
    var StateModifier = require('famous/modifiers/StateModifier');
    var GenericSync   = require('famous/inputs/GenericSync');
    var MouseSync     = require('famous/inputs/MouseSync');
    var TouchSync     = require('famous/inputs/TouchSync');
    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});

    var MenuView      = require('views/MenuView');

    var Star = require('classes/Star');
    var Planet = require('classes/Planet');
    var Ship = require('classes/Ship');

    function Level1View() {
        View.apply(this, arguments);

        _createPhysicsEngine.call(this);
        _addSun.call(this);
        _addPlanets.call(this);
        _addMenu.call(this);

    }

    Level1View.prototype = Object.create(View.prototype);
    Level1View.prototype.constructor = Level1View;

    Level1View.DEFAULT_OPTIONS = {
        numberOfPlanets: 0
    };

    // define physics engine and whatever forces/constraints
    function _createPhysicsEngine() {
        this.physicsEngine = new PhysicsEngine();
        this.repulsion = new Repulsion({
            strength: this.options.repulsionStrength || -20,
            range: this.options.range || [100, Infinity]
        });
        this.collision = new Collision();

        // TODO: maybe do this somewhere else?
        this.stars = [];
        this.planets = [];
    }

    function _addSun() {
        var star = new Star();
        this.physicsEngine.addBody(star.particle);
        this.add(star.modifier).add(star.surface);
        this.stars.push(star.particle);
        this.star = star; // so we can access it for planets
    }

    function _addPlanets() {
        for(var i = 0; i < this.options.numberOfPlanets; i++) {
            var planet = new Planet();
            this.physicsEngine.addBody(planet.particle);
            this.physicsEngine.attach(this.repulsion, planet.particle, this.star.particle);
            this.add(planet.modifier).add(planet.surface);
            this.planets.push(planet.particle);
        }
    }

    function _addMenu() {
        var menuView = new MenuView(['attractor']);
        var menuViewModifier = new StateModifier();
        this.add(menuViewModifier).add(menuView);

        menuView.on('menuItemClicked', function(data){
            console.log('item', data, 'clicked');
            if(data === 0) {
                this.play();
            } else if(data === 1) {
                console.log(this);
                // this.physicsEngine.removeBody(this.physicsEngine.getBodies()[0]);
                this._eventOutput.emit('changeLevel', 2);
            }
        }.bind(this));
    }

    Level1View.prototype.play = function play() {
        _addShip.call(this);
    };

    function _addShip() {
        var ship = new Ship();
        
    }

    module.exports = Level1View;
});