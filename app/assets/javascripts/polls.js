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
		fetch(`/polls.json`)
			.then(res => res.json())
			.then(data => console.log(data))
	})
}



	function Poll(poll){
		this.id = poll.id
		this.question = poll.question
		this.vote_count = poll.vote_count
		this.poll_options = poll.poll_options
	}