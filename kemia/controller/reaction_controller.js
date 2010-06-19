goog.provide('kemia.controller.ReactionController');
goog.require('goog.events.EventTarget');
goog.require('goog.debug.Logger');

/** 
 * @constructor 
 * @extends {goog.events.EventTarget} 
 */ 
kemia.controller.ReactionController = function(parentController) { 
  goog.events.EventTarget.call(this);
  this.setParentEventTarget(parentController);
}; 
goog.inherits(kemia.controller.ReactionController, goog.events.EventTarget); 

kemia.controller.ReactionController.prototype.handleMouseOver = function(Reaction, e){
	this.dispatchEvent(kemia.controller.ReactionController.EventType.MOUSEOVER);
};

kemia.controller.ReactionController.prototype.handleMouseOut = function(Reaction, e){
	this.dispatchEvent(kemia.controller.ReactionController.EventType.MOUSEOUT);
};
/** @enum {string} */ 
kemia.controller.ReactionController.EventType = { 
  MOUSEOVER: 'reaction_mouseover',
  MOUSEOUT: 'reaction_mouseout'
}; 

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.ReactionController.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.ReactionController');
