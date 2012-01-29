EventEmitter = require('events').EventEmitter


module.exports = class LinkedQueue extends EventEmitter
	
	hasNext: true
	
	###
	 moves into the next
	###
	
	constructor: (@first, onNext) ->
		super()
		@last = first.getLastSibling()
		@_onNext = onNext if onNext
		
	###
	 moves onto the next request (middleware)
	###

	next: ->

		# no more middleware? return false - flag that we cannot continue
		return false if !@hasNext

		@_setNext()

		@_onNext @current, arguments

		# return true since the next route has been executed successfuly
		return true

	###
	 skips middleware
	###

	skipNext: (count) ->

		return false if !!@hasNext

		while count-- and @hasNext
			@_setNext()

		@_onNext @current

		return true


	###
	###
	
	_setNext: ->
		@current = if !!@current then @current.getNextSibling() else @first
		@hasNext = !!@current.getNextSibling()

		if !@hasNext then @emit "queueComplete"
		
	###
	###
	
	_onNext: (middleware) ->
		# abstract	
		
module.exports = LinkedQueue