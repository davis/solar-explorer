define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');
    var Circle = require('famous/physics/bodies/Circle');
    var GenericSync   = require('famous/inputs/GenericSync');

    function Planet() {
        this.surface =  new Surface({
            size: [100, 100],
            properties: {
                // background: '#' + Math.floor(Math.random()*16777215).toString(16),
                background: '#ED553B',
                borderRadius: '50%',
                border: '2px solid #222'
            }
        });

        this.particle = new Circle({
            position: [
                Math.random() * window.innerWidth / 2 + 200,
                Math.random() * window.innerHeight / 2.5,
                0
            ],
            velocity: [0, 0.2, 0]
        });

        // initialize true position
        var _truePosition = this.particle.position.get();

        // this is what determines where this shows up in the UI
        this.modifier = new Modifier({
            transform: function() {
                return Transform.translate(this.truePosition()[0], this.truePosition()[1], this.truePosition()[2]);
            }.bind(this)
        });

        this.truePosition = function() {
            if(this.override) {
                this.particle.setPosition(this._truePosition);
            } else {
                this._truePosition = this.particle.getPosition();
            }
            return this._truePosition;
        };

        this.sync = new GenericSync(['mouse', 'touch']);
        this.surface.pipe(this.sync);

        // initialize override as falsy
        this.sync.on('start', function() { this.override = true; }.bind(this));

        // set trueposition via delta
        this.sync.on('update', function(data) {
            var cache = this.truePosition();
            this._truePosition = [
                cache[0] + data.delta[0],
                cache[1] + data.delta[1],
                cache[2]
            ];
        }.bind(this));

        // preserve velocity on mouseup
        this.sync.on('end', function(data) {
            this.override = false;
            this.particle.setVelocity([
                data.velocity[0],
                data.velocity[1],
                0
            ]);
        }.bind(this));
    }

    module.exports = Planet;
});
