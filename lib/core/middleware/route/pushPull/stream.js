var Structr = require('structr'),
EventEmitter = require('sk/core/events').EventEmitter;

/**
 the bridge between the listener, and responder. Yeah, Yeah. the listener
94 */

var proto = {

	/**
	 */

	'_init': function(ttl)
	{
		this._em = new EventEmitter();	

		this.response = {};

		if(ttl)
		{
			this.cache(ttl);
		}
	},

	/**
	 */

	'cache': function(ttl)
	{
		if(this._caching) return;
		this._caching = true;


		//store the buffer incase data comes a little quicker than we can handle it.
		var buffer = this._buffer = [], self = this;

		this.on({
			write: function(chunk)
			{
				buffer.push(chunk)
			}
		});
	},

	/**
	 */

	'on': function(listeners)
	{
		for(var type in listeners)
		{
			this._em.addListener(type, listeners[type]);
		}
	},


	/**
	 */

	'second on': function(type, callback)
	{
		this._em.addListener(type, callback);
	},

	/**
	 */

	'respond': function(data)
	{
		Structr.copy(data, this.response, true);
	},

	/**
	 */

	'error': function(data)
	{
		this._em.emit('error', data);
	},

	/**
	 */

	'write': function(data)
	{
		if(!this._sentResponse)
		{

			//WHOOAAHH, what are you doing!? Okay, I know it looks stupid, it is. BUT, consider this scenario:
			//via HTTP, the session object is *saved* to the database once toJSON is called, which is ONLY called when *this* happens.  We do not want
			//the session to save before we're done writing to it, or handling it. 
			this.response = JSON.parse(JSON.stringify(this.response));

			this._em.emit('response', this.response);
		}

		this._em.emit('write', data);
	},

	/**
	 */

	'end': function(data)
	{
		//SUPER NOTE: end can be called *once*. After that, all the listeners are disposed of
		if(data) this.write(data);

		this.finished = true;

		this._em.emit('end', data);

		//remove the event listeners to avoid mem leaks
		this._em.dispose();
	},

	/**
	 */

	'pipe': function(stream)
	{

		//IF there is a buffer, that means it came faster than we can handle it. This sort of thing
		//occurrs when there are pass-thru routes which hold up the final callback. e.g: authenticating a user against
		//a database
		if(this._buffer && this._buffer.length)
		{
			if(stream.response) stream.response = this.response;

			for(var i = 0, n = this._buffer.length; i < n; i++)
			{
				stream.write(this._buffer[i]);
			}	
		}

		//already finished? return
		if(this.finished)
		{
			return stream.end();
		}

		//looks like the bridge is still handling data, so listen for the rest
		this.on({
			write: function(data)
			{
				stream.write(data);
			},
			end: function()
			{
				stream.end();
			},
			error: function(e)
			{
				if(stream.error) stream.error(e);
			},
			response: function(data)
			{
				if(stream.respond) stream.respond(data);
			}
		});
	}
};

var Stream = Structr(Structr.copy(proto, {
		
	/**
	 * @param the current request
	 * @param ttl time to keep cached version in memory before dumping it
	 */

	'__construct': function(ttl)
	{
		this._init(ttl);
	}

}));

Stream.proto = proto;


module.exports = Stream;