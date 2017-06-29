$(document).ready(function(){
	$("a.load_active_polls").on("click", function(e){
		$.ajax('/polls.json').done(function(data){
			$("body").html("")
			data.forEach(function(poll){
				var link = '<a href="/polls/' + poll.id + '">' + poll.question + '</a>'
				$("body").append(link)
			})
		})
		e.preventDefault();
	})
})