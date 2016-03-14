# [SURVIVOR][link]
[link]: http://vwb.github.io/survival/

A browser based javascript game utilizing Canvas and jQuery libraries. 

![Survival GameScreen](http://res.cloudinary.com/dpxg23zze/image/upload/v1457916620/Screen_Shot_2016-03-13_at_5.49.31_PM_osgsjm.png)

## Goal

You start as a small cell in a big world, and your goal is simply to survive until you are the last alive. You can absorb cells smaller than you, but be careful because bigger ones can absorb you.

Tap on the arrow keys or w-a-s-d to move, but be aware, every action has a cost. With each propulsion you will see a little bit of your body leave to provide the momentum and your overall size shrink. It is a balancing game to maintain your momentum, but not let it take you into your own death.

## Implementation Details

#### Hand Rolled Collision Detection

Decided to implement own collision detection, etc instead of incorporating a physics library for instance. Since every object is a we essentially check if the distance between any two items is larger than the sum of its radius.

We find the total distance using the basic formula for distance between two points:

	var xDistance = Math.pow((this.pos[0] - other.pos[0]), 2);
	var yDistance = Math.pow((this.pos[1] - other.pos[1]), 2);
	var totalDistance = Math.sqrt((xDistance + yDistance));

Then using the sum of the radius for each we return true or false based on whether the summed radius is larger than total distance or not. 

This function is called for every object at every "step" or render that the canvas performs.

#### 'Shrinking' algorithm

The shrinking or absorbing effect that occurs when an object collides with another is fairly simple. Knowing that with every render (called every 20 milliseconds), an object will be returning true or false in regards to its collision status.

If a collision does occur, all that is needed is to simply modify the radii of the two in an inverse manner based upon their sizes:

	if (this.radius > other.radius) {

	  var ratio = 1
	  this.radius += ratio/2
	  other.radius -= ratio

	  if (other.radius <= 1){
	    this.game.remove(other)
	  }

	}

Since this is calculated every step in an optimization it was necessary to use a simple value for the ratio otherwise framerate would often suffer early in the game when hundreds of elements may be colliding at the same time.

The reduction of size increase to size decrease ensures that an "absorbing" effect occurs where the smaller loses size far more rapidly than the larger element.

#### Calculating placement of propulsion pieces

To determine the placement of the propulsion pieces it is necessary to mirror the current velocity of the player cell and then offset the x,y coordinate normalized by that velocity and the current radius.

	var XOffset = -1 * ((velX/(Math.abs(velX)+Math.abs(velY)))) * (saveRadius + (saveRadius / 2.5) );
	var YOffset = -1 * ((velY/(Math.abs(velX)+Math.abs(velY)))) * (saveRadius + (saveRadius / 2.5) );

The absolute values are used to ensure that no cancellation of negatives occur while normalizing, but then are reinstated at the end by multiplying the entire response by -1.
