var framework = 'nwt',
	classes = {};

function View() {
	
}

classes.View = new View();

/**
 * Semantics constructor
 * @constructor
 */
function SemanticsJS() {
	this.CLICK_ATTR = 'js';
	this.MOUSE_ATTR = 'mouse';
	this.SCROLL_ATTR = 'scroll';
}

SemanticsJS.prototype = {

		/**
		 * Enables semantic dispatchers
		 * Defaults to enabling click to js
		 * Possibilities are: scroll, mousemove
		 * @param string Type of listener to enable
		 * @param string data- attribute to assign the listener to
		 * @param integer Max number of parents to ascend (defaults to unlimited)
		 */
		enable: function(action, dataAttr, limit) {
			nwt.one('body').on(action, function(e) {

				var initialNode = e.target,
					currNode = e.target,
					i = 1;

				while(true) {

					if (currNode.data(dataAttr)) {
						Semantics.dispatch(initialNode, currNode, dataAttr);
						break;
					}

					// Iterate up through the dom
					currNode = currNode.parent();

					if( !currNode || i > limit ) {
						break;
					}
					i++;
				}
			});
		},

		/**
		 * Extends a Semantics class with a definition
		 */
		extend: function(base, definition) {
			definition.extend = base;
			classes[definition.name] = definition;
		},

		
		/**
		 * Dispatches an action based upon the target node and callback node
		 * @param object Target (clicked) element
		 * @param object Callback element, or element we found with the disoatched class
		 */
		dispatch: function(targetEl, callbackEl, dataAttr) {
			var className = callbackEl.data(dataAttr),
				parts = className.split('.'),
				numParts = parts.length,
				i,
				callback,
				userClass;

			for (i = 0; i < numParts; i++) {
				var part = parts[i];

				if (i == 0 && classes[part]) {
					callback = classes[part].methods;
					userClass = classes[part];
				} else if (callback[part]){
					callback = callback[part];
				}
			}

			// Give the method some scope
			// Assign this._super to the callback

			if (userClass.extend) {
				if (classes[userClass.extend].methods) {
					userClass._super = classes[userClass.extend].methods;
	
					// Build the callback for the super method
					for (i = 1; i < numParts; i++) {
						var part = parts[i];
						if (userClass._super[part]) {
							userClass._super = userClass._super[part];
						}
					}
				}
			}

			callback.apply(userClass, [Semantics.getNode(targetEl), Semantics.getNode(callbackEl)]);
		},

		
		/**
		 * Returns a node based on the current UI framework 
		 */
		getNode: function(el) {
			var node = el;
			if (framework == 'jquery') {
				node = $(node._node);
			}
			return node;
		},


		/**
		 * Implements the JS framework of choice for callbacks
		 * Defaults to: 'nwt', valid options are: nwt, jQuery
		 */
		use: function(type) {
			framework = type.toLowerCase();
		}
};


// Enable click and mousemove listeners on page load
nwt.ready(function(){
	Semantics.enable('click', Semantics.CLICK_ATTR);
	Semantics.enable('mousemove', Semantics.MOUSE_ATTR, 1);

	// Scroll is not enabled by default because it doesn't bubble
	// The use should be careful about using scoll dispatch anyway
	// Semantics.enable('scroll', Semantics.SCROLL_ATTR);
});

window.Semantics = new SemanticsJS();
