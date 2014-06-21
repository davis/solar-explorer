/*** DraggableSurfaceParticle.js ***/

define(function(require, exports, module) {
    var Modifier    = require('famous/core/Modifier');
    var Transform   = require('famous/core/Transform');
    var GenericSync = require('famous/inputs/GenericSync');

    var SurfaceParticle = require('classes/SurfaceParticle');

    function DraggableSurfaceParticle(options) {

        // inherit from SurfaceParticle
        SurfaceParticle.call(this, options);

        // initialize true position
        this._truePosition = this.particle.position.get();

        // this is what determines where this shows up in the UI
        // overrides parent class SurfaceParticle's implementation
        this.modifier = new Modifier({
            transform: function() {
                return Transform.translate(
                    this.truePosition()[0],
                    this.truePosition()[1],
                    this.truePosition()[2]
                );
            }.bind(this)
        });

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
            if(options.throwable) {
                this.particle.setVelocity([
                    data.velocity[0],
                    data.velocity[1],
                    0
                ]);
            } else {
                this.particle.setVelocity([0, 0, 0]);
            }
        }.bind(this));
    }

    DraggableSurfaceParticle.prototype = Object.create(SurfaceParticle.prototype);
    DraggableSurfaceParticle.prototype.constructor = DraggableSurfaceParticle;

    DraggableSurfaceParticle.prototype.truePosition = function() {
        if(this.override) {
            this.particle.setPosition(this._truePosition);
        } else {
            this._truePosition = this.particle.getPosition();
        }
        return this._truePosition;
    };

    module.exports = DraggableSurfaceParticle;
});