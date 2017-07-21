/* A server side player class used for keeping track of existing players. */
var RADIUS = 7.5;
var VEL = [0,0];
var COLOR = "#5BD9ED";

var ServerPlayer = function(startPos) {
    var pos = startPos,
        velocity = VEL,
        radius = RADIUS,
        color = COLOR,
        id;
    
    var getPos = function() {
        return pos;
    };

    var setPos = function(newPos) {
        pos = newPos;
    };

    return {
        getPos: getPos,
        setPos: setPos,
        id: id
    }
};

exports.ServerPlayer = ServerPlayer;