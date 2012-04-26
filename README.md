# [Real Shadow](http://indamix.github.com/real-shadow/) - jQuery Plugin that casts photorealistic shadows
Works in any browser supporting CSS box-shadow

## Basic Usage

	$(selector).realshadow();

	$(selector).realshadow({

		followMouse: false, // true by default

		pageX:       x,     // x coordinate of the light source
		pageY:       y      // y coordinate of the light source

		c: {                // can specify shadow color
			r: 1,           // red   channel for shadow
			g: 1,           // green channel for shadow
			b: 1,           // blue  channel for shadow
		}

	});

To specify differen colors for each element, you can use "rel" attribute:

	<span rel="r"></span>
	<span rel="g"></span>
	<span rel="b"></span>

	$('span').realshadow();