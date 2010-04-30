$(function(){
    if ($('form#electionsurvey').length) {
        var more_explanation_label_unfolded = $('ul.questions > li div.more_explanation label').html();
        var more_explanation_label_folded = "After you answer, optional space for a short explanation is available.";

        // Enable/disable more explanation fields at start according to status of radio buttons
        $('ul.questions textarea').attr('disabled', 'disabled').addClass('disabled'); //.hide();
        $('ul.questions div.more_explanation label').html(more_explanation_label_folded);
        $('ul.questions > li').has('input:radio:checked').find('textarea').removeAttr('disabled').removeClass('disabled'); //.show();
        $('ul.questions > li').has('input:radio:checked').find('div.more_explanation label').html(more_explanation_label_unfolded);
        // Allow editing of more explanations when radio button has been pressed
        $('input:radio').change(function(){
            $(this).closest('ul.questions > li').find('textarea').removeAttr('disabled').removeClass('disabled'); //.show(600);
            $(this).closest('ul.questions > li').find('div.more_explanation label').html(more_explanation_label_unfolded);
        });

        // Autosave the form when any part of it changes
        $('input:radio').add('ul.questions textarea').change(autosave_survey_form);
        // Autosave if they close the window (in case in middle of typing in textarea)
        window.onbeforeunload = autosave_survey_form;
        // Autosave when the submit button is clicked (although this will do an onbeforeunload also?)
        $('form#electionsurvey').submit(autosave_survey_form);

        // Prevent too much text in the more explanation fields
        $('ul.questions').find('textarea').textLimiter(250, { limitColor: '#FF0000' });
    }

    $('table.answers tr.what-you-think a').click(function() {
	    $(this).css('background-color', '#eee');
	    var table = $(this).parents('table.answers');
	    var cell = $(this).parent();
	    $('tr > td', table).css('background-color', '#fff');
	    column = cell.parent("tr").children().index(cell) + 1;
	    $('tr > td:nth-child('+column+')[class!=explanation]', table).css('background-color', '#ffc');
	    var colindex = $.inArray($(this).parents('td'), $('td', $(this).parents('tr')));
	    table.find('tr.what-they-think').fadeIn(600);
	    table.find('.explanation').css('visibility', 'visible');
	    table.find('.you').html('<strong>You</strong>');
	    table.find('.you').css('background','none');

	    var li = $(this).closest('li.answer');

        question = li.children('.statement').children('blockquote').html();
        answer = (6-column)*25;
        survey_answer_selected(question, answer);
        
	    $('html,body').animate({ 'scrollTop': li.offset().top });
	    return false;
	});

    if ($('form#postcode_form').length) {
        $('form#postcode_form #id_postcode').focus()
    }
});

// Store form data on server so can come back to it later
function autosave_survey_form() {
    var token = $('input#token').val();
    // see if the form is modified at all, i.e. we have
    // some fields in it other than token / questions_submitted
    var fields = $('form#electionsurvey').serializeArray();
    var filled_in = false;
    jQuery.each(fields, function(i, field){
        if (field.name != 'token' && field.name != 'questions_submitted') {
            filled_in = true;
        }
    });
    if (filled_in) {
        // store all the form data
        var ser = $('form#electionsurvey').serialize();
        // submit it to the server
        $.ajax({ url: "/survey/autosave/" + token, context: document.body, type: 'POST', data: { 'ser': ser }, success: function(){
            $('div#autosave').stop(true, true).show().fadeOut(2000);
        }});
    }
}

function survey_answer_selected(question, answer) {
    candidate_answers = questions[escape(question)];

    if(escape(question) in scores_undo) {
        candidate_scores_undo = scores_undo[escape(question)];
        for(candidate in candidate_scores_undo)
            scores[candidate] -= candidate_scores_undo[candidate];
        delete scores_undo[escape(question)];
    }

    scores_undo[escape(question)] = {};

    for(candidate in candidate_answers) {
        candidate_answer = candidate_answers[candidate];
        if(candidate_answer == answer) {
            scores[candidate] += 2;
            scores_undo[escape(question)][candidate] = 2;
        }
        else if(candidate_answer == answer + 25 || candidate_answer == answer -25) {
            scores[candidate] += 1;
            scores_undo[escape(question)][candidate] = 1;
        }
    }

    update_candidate_most_agree();
}

function update_candidate_most_agree() {
    agree_most = "no-one";
    agree_most_score = 0;
    scoretext = "<ul>";
    for(candidate in scores) {
        if(agree_most_score < scores[candidate]) {
            agree_most = candidate;
            agree_most_score = scores[candidate];
        }
        scoretext += "<li>" + candidate_names[candidate] + " <small>(" + candidate_parties[candidate] + ")</small> <strong>" + scores[candidate] + " points</strong></li>";
    }
    $("#agree_most").html(scoretext + "</ul>");
    $("#you_agree_with").val(agree_most)
    update_sharing();
}

function update_sharing() {
    candidate_code = $("#you_agree_with").val();
    candidate_name = $("#you_agree_with :selected").text();
    if(candidate_code != "no-one" && candidate_code != "secret")
        candidate_name += " (" + candidate_parties[$("#you_agree_with").val()] + ")";
    var sharing_text = text1 + candidate_name + text2;
    $("#pastetext").val(sharing_text);
    $("#twitterlink").attr("href", "http://twitter.com/home/?status=" + escape(sharing_text));
}


