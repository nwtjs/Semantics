<h1>Semantics.JS</h1>

Semantics.JS provides a framework for using semantics to control javascript behavior on your website or rich internet application.

Inspired by WAI-ARIA and 508 compliance, this light library allows strong use of semantics to guide user behavior. All JS is hooked up to a single listener on the page, which dispatches out to various plugins. We call this uber bubbling.

Simply include the script on the page.

```HTML
<script type="text/javascript" src="../semantics.min.js"></script>

<script type="text/javascript">
	// It's also possible, but not necessary to use jQuery
	// This will ensure that callbacks receive jQuery objects
	Semantics.use('jQuery');
</script>
```

<h2>Example Application</h2>

Here we will create a TabView, and another TabView which inherits from the first one.

```HTML
<!-- This is a standard TabView, notice the data-js attribute -->
<div data-js="TabView.toggle">
	<ul>
		<li><a href="#tab1">Tab 1</a></li>
		<li><a href="#tab2">Tab 2</a></li>
		<li><a href="#tab3">Tab 3</a></li>
	</ul>
</div>

<div data-js="AjaxTabView.toggle">
	<ul>
		<li><a href="#tab1">Tab 1</a></li>
		<li><a href="#tab2">Tab 2</a></li>
		<li><a href="#tab3">Tab 3</a></li>
	</ul>
</div>

<script type="text/javascript">

Semantics.extend('View', {

	name: 'TabView',

	methods: {
		toggle: function(el) {
			console.log('We are toggling a regular TabView.', el);
		}
	}
});

Semantics.extend('TabView', {
	name: 'AjaxTabView',

	methods: {
		toggle: function(el) {
			console.log('We are toggling an ajax tab view', el);

			// Call the toggle method of a regular tab view.
			this._super();
		}
	}
});

```
