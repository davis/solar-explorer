/*** SurfaceParticle.js ***/

define(function(require, exports, module) {
    var Modifier = require('famous/core/Modifier');

    function SurfaceParticle(options) {
        this.surface = options.surface;
        this.particle = options.particle;

        this.modifier = new Modifier({
            transform: function() {
                var cache = this.particle.getPosition();
                return Transform.translate(
                    cache[0],
                    cache[1],
                    cache[2]
                );
            }.bind(this)
        });
    }

    // methods would go here
    SurfaceParticle.prototype.something = function() {

    };

    module.exports = SurfaceParticle;
});