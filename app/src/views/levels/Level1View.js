/*** Level1.js ***/

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

    var Star = require('classes/Star');
    var Planet = require('classes/Planet');

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
        numberOfPlanets: 1
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
        var star = new Star();
        this.physicsEngine.addBody(star.particle);
        this.add(star.modifier).add(star.surface);
        this.star = star; // so we can access it for planets
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
        var planet = new Planet();

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
                _addSun.call(this);
            } else if(data === 1) {
                // console.log(this);
                // this.physicsEngine.removeBody(this.physicsEngine.getBodies()[0]);
                this._eventOutput.emit('nextLevel', 1);
            }
        }.bind(this));
    }

    module.exports = Level1View;
});