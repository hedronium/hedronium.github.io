# Hedronium Homepage

## Add Yourself

### The Markup
You add a bit of markup that defines you into the div with selector `div.faces`

The actual markup follows this general template:
```HTML
<div class="face">
	<div class="pic">
		<img src="{{ PATH TO IMAGE }}" alt="{{ YOUR NAME }}">
	</div>
	<h3>{{ YOUR NAME }}</h3>
	<p>{{ FUNNY QUOTE }}</p>
	<div class="social">
		{{ SOCIAL MEDIA LINKS }}
	</div>
</div>
```
You add a "face" into the "faces" list. Geddit geddit geddit? HUEHUEHUE. *sigh* Nevermind.

While writing your name remember to wrap your primary identifier with emphasis tags (`<em></em>`) this allows the CSS to style
the name you go by as being brighter than the rest of your name. Example:

```HTML
<h3>James <em>Bond<em></h3>
```

Note: Don't be an idiot. Do not add the `em` tags in the `alt` atribute for the image.


### The Image
![NIGUUH DON'T SAY A WORD](./images/faces/shishir.jpg)  
The image should be a square jpg with `200x200 px` dimensions. Anything other 
than a square and you will be pochafied. YOU HAVE BEEN WARNED.
