// $(document).ready(function(){
// 	$("a.load_active_polls").on("click", function(e){
// 		$.ajax('/polls.json').done(function(data){
// 			$("div.content ol").html("")
// 			data.forEach(function(poll){
// 				var link = '<a href="/polls/' + poll.id + '">' + poll.question + '</a>' + '</br>'
// 				$("div.content ol").append(link)
// 			})
// 		})
// 		e.preventDefault();
// 	})

// 	$("a.load_expired_polls").on("click", function(e){
// 		$.ajax('/polls/expired.json').done(function(data){
// 			$("div.content ol").html("")
// 			data.forEach(function(poll){
// 				var link = '<a href="/polls/' + poll.id + '">' + poll.question + '</a>' + '</br>'
// 				$("div.content ol").append(link)
// 			})
// 		})
// 		e.preventDefault();
// 	})

// })

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
		console.log('clicked expired polls')
		e.preventDefault()
		history.pushState(null, null, "polls/expired")
		getExpiredPolls()
	})

	$(document).on('click', ".show_link", function(e){
		e.preventDefault()
		$('#app-container').html('')
		let id = $(this).attr('data-id')
		fetch(`/polls/${id}.json`)
		.then(res => res.json())
		.then(poll => {
			let newPoll = new Poll(poll)
			let pollHtml = newPoll.formatShow()
			$('#app-container').append(pollHtml)
		})
	})
}

const getPolls = () => {
	fetch(`/polls.json`)
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
	fetch(`/polls/expired.json`)
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
}

Poll.prototype.formatIndex = function(){
	//build out the markup you want to display
	let pollHtml = `
		<a href="/polls/${this.id}" data-id="${this.id}" class="show_link"><h1>${this.question}</h1></a>
	`

	return pollHtml
}

Poll.prototype.formatShow = function(){
	let pollHtml = `
		<h3>${this.question}</h3>
	`
	return pollHtml
}

