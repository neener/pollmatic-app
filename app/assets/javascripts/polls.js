'use strict';

$(() => {
	bindClickHandlers()
})

const bindClickHandlers = () => {
	$('.load_active_polls').on('click', (e) => {
		e.preventDefault()
		history.pushState(null, null, "polls")
		getPolls()
	})

	$('.load_expired_polls').on('click', (e) => {
		e.preventDefault()
		history.pushState(null, null, "#expired")
		getExpiredPolls()
	})

	$(document).on('click', ".show_link", function(e){
		e.preventDefault()
		$('#app-container').html('')
		let id = $(this).attr('data-id')
		fetch(`/polls/${id}.json`,{
		credentials: 'same-origin',
		headers: new Headers({
	        'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/json',
	        'Accept': 'application/json'
		})})
		.then(res => res.json())
		.then(poll => {
			let newPoll = new Poll(poll)
			newPoll.show()
		})
	})

	$(document).on('click', ".new_poll", function(e){
		e.preventDefault()
		$('#app-container').html('')
		$('#app-container').append(Poll.formatForm())
		bindAddInputButtonEventListener()
		$('#new_poll_form').on('submit', Poll.submitNewPoll)
	})


	$(document).on('click', '.next-poll', function(){
		let id = $(this).attr('data-id')
		fetch(`polls/${id}/next`)
		.then(res => res.json())
		.then(poll => {
			let newPoll = new Poll(poll);
			newPoll.show();
		})
	})
}

const getPolls = () => {
	fetch(`/polls.json`,{
		credentials: 'same-origin',
		headers: new Headers({
	        'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/json',
	        'Accept': 'application/json'
		})})
			.then(res => res.json())
			.then(polls => {
				$('#app-container').html('')
				polls.forEach(poll => {
					//creates a new poll object that is assign to the newPoll variable that has all the attributes assigned in the constructor function
					let newPoll = new Poll(poll)
					let pollHtml = newPoll.formatIndex()
					$('#app-container').append(pollHtml)
				})
			})
}

const bindAddInputButtonEventListener = () => {
	$('#add_new_poll_option').on('click', function(event) {
		event.preventDefault()
		Poll.addNewOptionInput()
	})
}

const getExpiredPolls = () => {
	fetch(`/polls/expired.json`,{
		credentials: 'same-origin',
		headers: new Headers({
	        'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/json',
	        'Accept': 'application/json'
		})})
			.then(res => res.json())
			.then(polls => {
				$('#app-container').html('')
				polls.forEach(poll => {
					let newPoll = new Poll(poll)
					let pollHtml = newPoll.formatIndex()
					$('#app-container').append(pollHtml)
				})
			})
}


function Poll(attributes){
	this.id = attributes.id
	this.question = attributes.question
	this.vote_count = attributes.vote_count
	this.poll_options = attributes.poll_options
	this.results = attributes.results
	this.current_user_has_voted = attributes.current_user_has_voted
	this.expired = attributes.expired
	this.option_number = attributes.poll_options.length
}

Poll.formatForm = function(){

	let pollFormHtml = `
		<form id="new_poll_form">
			<label for="question">Question:</label><br />
			<input type="text" name="question" /><br />

			<div id="poll_options">
				<label for="options">Options:</label><br />
				<div>
					<input type="text" name="poll_option" />
				</div>
			</div>

			<button id="add_new_poll_option">Add another poll option</button>

			<button type="submit">Submit</button>
		</form>

	`
	return pollFormHtml
}


Poll.addNewOptionInput = function() {
	$('#poll_options').append(`
		<div>
			<input type="text" name="poll_option"/>
		</div>
	`)
	bindAddInputButtonEventListener()
}

Poll.prototype.formatIndex = function(){
	//build out the markup you want to display
	let pollHtml = `
		<a href="/polls/${this.id}" data-id="${this.id}" class="show_link"><h1>${this.question}</h1></a>
	`
	return pollHtml
}

Poll.prototype.show = function(){
	if (this.current_user_has_voted || this.expired){
		$('#app-container').html(this.formatShow());
		//bind the next button
	} else {
		$('#app-container').html(this.formatVoteForm());
		let id = this.id
		$('#submit_vote').on('click', function(e){
			e.preventDefault();
			let poll_option_id = $('input[type="radio"]:checked:first').val();
			let token = $('meta[name="csrf-token"]').attr('content');
			fetch('/votes', {
				method: 'POST',
				credentials: 'same-origin',
				headers: new Headers({
					'X-CSRF-Token': token,
			        'X-Requested-With': 'XMLHttpRequest',
					'Content-Type': 'application/json',
			        'Accept': 'application/json'
				}),
				body: JSON.stringify({vote: {poll_option_id: poll_option_id, poll_id: id}})
			}).then(function(response){
				if (response.ok){
					return fetch(`/polls/${id}.json`,{
						credentials: 'same-origin',
						headers: new Headers({
					        'X-Requested-With': 'XMLHttpRequest',
							'Content-Type': 'application/json',
					        'Accept': 'application/json'
						})})
				} else {
					return response.json().then(function(json){
						let err = new Error(response.status);
						err.messages = json.errors;
						throw err;
					});	
				}
			}).then(res => res.json())
				.then(poll => {
					let newPoll = new Poll(poll);
					console.log(newPoll.current_user_has_voted)
					newPoll.show();
				}).catch(function(err){
				let messages = err.messages;
				messages.forEach(function(mess){
					$('#app-container').append("<p>" + mess + "</p>")
				});
			})
		})
		//bind the next button
	}
};

Poll.prototype.formatShow = function(){
	let results = this.results.reduce(function(str, result){
		return str + `${result[0]}: ${result[1]}<br />`;
	},"")
	
	let pollHtml = `
		<h3>${this.question}</h3>
		<h4>${results}</h4>
		<button class="next-poll" data-id=${this.id}>Next</button>
	`
	return pollHtml
}

function getPollFormData() {
	return {
	  poll: {
	    question: $('input[name="question"]').val(),
	    poll_options: $('input[name="poll_option"]').serializeArray().map(input => input.value)
	  }
	}
}

function headers() {
	return new Headers({
		'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/json',
        'Accept': 'application/json'
	})
}

Poll.submitNewPoll = function(e){
	e.preventDefault()

	var request = {
		method: 'POST',
		credentials: 'same-origin',
		headers: headers(),
		body: JSON.stringify(getPollFormData())
	}
	
	fetch('/polls', request)
		.then(response => response.json())
		.then(data => new Poll(data).show())
		.catch((e) => e.messages.forEach(message => $('#app-container').append(`<p>${message}</p>`)))
}

Poll.prototype.formatVoteForm = function(){
	let html = `${this.question} 
		<form>`
		this.poll_options.forEach(function(option, index){
			html +=  `<input type="radio" name="poll_option_id" value="${option.id}"> ${option.option} </input><br />`
		})
		html += `<button id="submit_vote">Submit</button></form>`
	return html;

}
