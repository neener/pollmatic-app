$(document).ready(function(){
	$("a.load_active_polls").on("click", function(e){
		$.ajax('/polls.json').done(function(data){
			$("div.content").html("")
			data.forEach(function(poll){
				var link = '<a href="/polls/' + poll.id + '">' + poll.question + '</a>' + '</br>'
				$("div.content").append(link)
			})
		})
		e.preventDefault();
	})

	$("a.load_expired_polls").on("click", function(e){
		$.ajax('/polls/expired.json').done(function(data){
			$("div.content").html("")
			data.forEach(function(poll){
				var link = '<a href="/polls/' + poll.id + '">' + poll.question + '</a>' + '</br>'
				$("div.content").append(link)
			})
		})
		e.preventDefault();
	})
})