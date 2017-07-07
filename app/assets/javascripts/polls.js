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
		$('#submit_new_poll').on('click', Poll.submitNewPoll)
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
					//creates a new post object that is assign to the newPoll variable that has all the attributes assigned in the constructor function
					let newPoll = new Poll(poll)
					let pollHtml = newPoll.formatIndex()
					$('#app-container').append(pollHtml)
				})
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
					//creates a new post object that is assign to the newPoll variable that has all the attributes assigned in the constructor function
					let newPoll = new Poll(poll)
					let pollHtml = newPoll.formatIndex()
					$('#app-container').append(pollHtml)
				})
			})
}


function Poll(poll){
	this.id = poll.id
	this.question = poll.question
	this.vote_count = poll.vote_count
	this.poll_options = poll.poll_options
	this.results = poll.results
	this.current_user_has_voted = poll.current_user_has_voted
	this.expired = poll.expired
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

Poll.formatForm = function(){

	let pollFormHtml = `
		<label for="question">Question:</label><br />
		<input type="text" id="poll_question" /><br />

		<label for="options">Options:</label><br />
		<input type="text" id="option_1" />
		<input type="text" id="option_2" />
		<input type="text" id="option_3" /><br />

		<button id="submit_new_poll">Submit</button>

	`
	return pollFormHtml
}

Poll.submitNewPoll = function(e){
	e.preventDefault()
	let token = $('meta[name="csrf-token"]').attr('content');
	let question = $("#poll_question").val()
	let poll_option_1 = $("#option_1").val()
	let poll_option_2 = $("#option_2").val()
	let poll_option_3 = $("#option_3").val()
	console.log(token)
	fetch('/polls', {
		method: 'POST',
		credentials: 'same-origin',
		headers: new Headers({
			'X-CSRF-Token': token,
	        'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/json',
	        'Accept': 'application/json'
		}),
		body: JSON.stringify({poll: { question: question, poll_option_options: [poll_option_1, poll_option_2, poll_option_3]}})
	}).then(function(response){
		if (response.ok){
			return response.json();
		} else {
			return response.json().then(function(json){
				let err = new Error(response.status);
				err.messages = json.errors;
				throw err;
			});	
		}
	}).then(function(data){
		var poll = new Poll(data)
		poll.show();
	}).catch(function(err){
		let messages = err.messages;
		messages.forEach(function(mess){
			$('#app-container').append("<p>" + mess + "</p>")
		});
	})

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
