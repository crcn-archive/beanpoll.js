var Structr = require('structr'),
Controller  = require('./controller');

require.paths.unshift(__dirname + '/beans');

var Loader = Controller.extend({
	
	/**
	 */


	'override __construct': function()
	{
		this._super();
		
		this._params = {};
	},

	/**
	 */

	'params': function(params)
	{
		Structr.copy(params || {}, this._params);	
	},

	/**
	 */

	'require': function(source)
	{
		if(source instanceof Array)
		{
			for(var i = source.length; i--;)
			{
				this.require(source[i]);
			}
		}
		else
		if(typeof src == 'object' && typeof src.bean == 'function')
		{
			source.plugin(this._controller, source.params || this._params[ source.name ] || {});
		}
		else
		{
			return false;
		}
		
		return this;
	}
	
});

module.exports = Loader;