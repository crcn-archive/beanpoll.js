AbstractDispatcher = require "../concrete/dispatcher"
Messanger = require "./messanger"

module.exports = class extends AbstractDispatcher
	

	###
	###

	_newMessanger: (message, middleware) ->
		new Messanger message, middleware, @