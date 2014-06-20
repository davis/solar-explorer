/*** main.js ***/

define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');

    var AppView = require('views/AppView');

    var mainContext = Engine.createContext();
    mainContext.setPerspective(1000);

    mainContext.add(new AppView());
});



