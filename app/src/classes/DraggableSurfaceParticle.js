define(function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Modifier = require('famous/core/Modifier');
    var GenericSync   = require('famous/inputs/GenericSync');

    var SurfaceParticle = require('classes/SurfaceParticle');

    function DraggableSurfaceParticle(surface, particle) {

        // inherit from SurfaceParticle
        SurfaceParticle.call(this, surface, particle);

        // initialize true position
        this._truePosition = this.particle.position.get();

        // this is what determines where this shows up in the UI
        this.modifier = new Modifier({
            transform: function() {
                console.log(this)
                return Transform.translate(
                    this.truePosition()[0],
                    this.truePosition()[1],
                    this.truePosition()[2]
                );
            }
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
            this.particle.setVelocity([
                data.velocity[0],
                data.velocity[1],
                0
                ]);
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
