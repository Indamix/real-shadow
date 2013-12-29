# [Real Shadow](http://indamix.github.io/real-shadow/) — Module that casts photorealistic shadows of [any shape](http://indamix.github.io/real-shadow/#/drop/)
Perfect for eye-catching demos and landing pages.  
Works in any browser supporting CSS box-shadow property.


Real Shadow registers itself as CommonJS module, AMD module or jQuery plugin (it depends on your environment).  
If there is no CommonJS, AMD or jQuery, Real Shadow registers itself in the global namespace.

## What's new
+ [text shadows](http://indamix.github.io/real-shadow/#/text/)
+ shadows can be of [any shape](http://indamix.github.io/real-shadow/#/drop/)
+ per-element settings (instead of global settings)
+ performance improvements

## Basic Usage with jQuery
```javascript
$(selector).realshadow(); // options are optional

$(selector).realshadow({

	followMouse: false,   // default: true

	pageX:       x,       // x coordinate of the light source
	pageY:       y        // y coordinate of the light source

	c: {                  // shadow color
		r: 1,             // red   channel for shadow
		g: 1,             // green channel for shadow
		b: 1,             // blue  channel for shadow
	},

	type: 'drop' / 'text' // optional, shadow type

});
```

## Basic Usage without jQuery
```javascript
realshadow(elements); // options are optional

realshadow(elements, options); // options example listed above
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

## Inset Shadows
```javascript
$(selector).realshadow({
	inset: true // default: false
});
```

## Inverse Shadows
```javascript
$(selector).realshadow({
	inverse: true // default: false
});
```

## Custom Shadow Shape
```javascript
$(selector).realshadow({
	type: 'drop'
});
```

## Text Shadow
```javascript
$(selector).realshadow({
	type: 'text'
});
```

## Update shadows during/after jQuery animations
```javascript
// before: apply Real Shadow to elements:
$(selector).realshadow(/* options, if needed */);

// update shadows during jQuery animation, i.e. each animation step:
$(selector).animate(/* animated properties */, {step: $.fn.realshadow.update});

// update shadows after jQuery animation is over:
$(selector).animate(/* animated properties */, $.fn.realshadow.update);
```
If you update shadows during jQuery animation, you don't need to update shadows after jQuery animation is over.

## Custom shadows length
```javascript
$(selector).realshadow({
	length: 5 // default is 7
});
```

## CommonJS usage
```javascript
var realshadow = require('realshadow');

realshadow(document.getElementsByClassName('someClass'));
realshadow(document.getElementsByTagName('li'), options);
```

## RequireJS / AMD usage
```javascript
require(['realshadow'], function(realshadow) {

	realshadow(document.getElementsByClassName('someClass'));
	realshadow(document.getElementsByTagName('li'), options);

});
```

## Reset Real Shadow
Real Shadow will release all added elements and remove all its event listeners
```javascript
realshadow.reset();
```


## Getting Real Shadow
Real Shadow is available in [GitHub](https://github.com/Indamix/real-shadow)
And you can get it using Bower:
```bash
bower install real-shadow
```

---
If you suppose that the usage of Real Shadow is unclear, feel free to contact me.