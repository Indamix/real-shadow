# [Real Shadow](http://indamix.github.com/real-shadow/) - jQuery Plugin that casts photorealistic shadows
Perfect for eye-catching demos and landing pages.

Works in any browser supporting CSS box-shadow property.

## Basic Usage

```javascript
$(selector).realshadow(); // options are optional

$(selector).realshadow({

	followMouse: false,   // true by default

	pageX:       x,       // x coordinate of the light source
	pageY:       y        // y coordinate of the light source

	c: {                  // shadow color
		r: 1,             // red   channel for shadow
		g: 1,             // green channel for shadow
		b: 1,             // blue  channel for shadow
	}

});
```

To specify different colors for each element, you can use "rel" attribute:

```html
<span rel="r"></span>
<span rel="g"></span>
<span rel="b"></span>
<span rel="rg"></span>
<span rel="gb"></span>
<span rel="br"></span>
<span rel="rgb"></span>
```

```javascript
$('span').realshadow();
```