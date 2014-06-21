/*** Star.js ***/

define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');
    var Circle = require('famous/physics/bodies/Circle');
    var GenericSync   = require('famous/inputs/GenericSync');


    function Star() {
        this.surface =  new Surface({
            size: [20, 20],
            properties: {
                background: '#F2B134',
                borderRadius: '50%',
                border: '2px solid #222',
                zIndex: 1
            }
        });

        this.particle = new Circle({
            position: [
                window.innerWidth / 2,
                window.innerHeight / 2.5,
                0
            ]
        });

        // initialize true position
        var _truePosition = this.particle.position.get();

        // this is what determines where planet shows up in the UI
        this.modifier = new Modifier({
            transform: function() {
                // console.log(this)
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
            this.particle.setVelocity([0, 0, 0]);
        }.bind(this));
    }

    // Star.prototype = Object.create(View.prototype);
    // Star.prototype.constructor = Star;

    // Star.DEFAULT_OPTIONS = {};

    module.exports = Star;
});



        