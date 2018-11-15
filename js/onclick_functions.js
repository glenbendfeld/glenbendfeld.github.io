function size_up_clicked(e){
  var btn = e.target || e.srcElement; // e.target is for Firefox
  anim_timeout_list = [];
  anim_timeout_index = 0;
  size_label = "size " + board_size + " by " + board_size;
  if(board_size < 5){
    board_size += 1;
    new_game_clicked(e);
  }
  else if(board_size == 5){
    btn.style.color = "red";
    setTimeout(function(){btn.style.color = "white"; }, 500);
  }
}
function size_down_clicked(e){
  var btn = e.target || e.srcElement; // e.target is for Firefox
  anim_timeout_list = [];
  anim_timeout_index = 0;
  size_label = "size " + board_size + " by " + board_size;
  if(board_size > 2){
    board_size -= 1;
    new_game_clicked(e);
  }
  else if(board_size == 2){
    btn.style.color = "red";
    setTimeout(function(){btn.style.color = "white"; }, 500);
  }
}




function middle2_clicked(e){ // not needed yet...
  //  var btn = e.target || e.srcElement; // e.target is for Firefox
}





function range_up_clicked(e){
  var btn = e.target || e.srcElement; // e.target is for Firefox
  anim_timeout_list = [];
  anim_timeout_index = 0;
  if(range[1] < 900){ // [0,99], [100, 199], ..., [800, 899], [900, 999].
    if(range[1] == 49){
      range[1] += 50;
    }
    else{
      //range[0] += 100;
      range[1] += 100;
    }
    new_game_clicked(e);
  }
  else if(range[1] ==  999){
    //range[0] = 9;
    //range[1] = 999;
    btn.style.color = "red";
    setTimeout(function(){btn.style.color = "white"; }, 500);
  }
}
function range_down_clicked(e){
  var btn = e.target || e.srcElement; // e.target is for Firefox
  anim_timeout_list = [];
  anim_timeout_index = 0;
  if(range[1] > 49){
    if(range[1] == 99){
      range[1] -= 50;
    }
    else{
      //range[0] -= 100;
      range[1] -= 100;
    }
    new_game_clicked(e);
  }
  else if(range[1] ==  49){
    btn.style.color = "red";
    setTimeout(function(){btn.style.color = "white"; }, 500);
  }
}





function non_prime_clicked(e){
  var btn = e.target || e.srcElement; // e.target is for Firefox
  var number = parseInt(btn.childNodes[0].nodeValue);
  if(btn.childNodes.length == 1){
    add_button_num(btn); // add dictionary key
  }
  //var b_num = btn.childNodes[1].childNodes[0].nodeValue;  // dictionary key
  if(!(btn.style.fontStyle == "oblique")){ // if unanswered
    if(check_answer(btn, number)){
      btn.style.fontStyle = "oblique";
      if(title_text.nodeValue == game_over_title){//} || title.nodeValue == "primes_found" || title.nodeValue == "PRIMES_FOUND"){
        btn.style.color = "green";
      }
      else{
        btn.style.color = "red";
      }
      for(var i = 0; i < answer_list.length; i++){ // turn primes black
        answer_list[i].style.color = "black";
      }
      //answered_primes_dictionary[b_num] = answer_list; // add new correct answer to dict
      new_dictionary_entry(answer_list, btn)
      answer_list = [];
      if(primes_are_gone()){
        check_for_win();
      }
    }
    else{ // wrong answer
      for(var i = 0; i < answer_list.length; i++){
        answer_list[i].style.color = "blue";
        answer_list[i].style.fontStyle = "normal";
      }
      answer_list = [];
    }
  }
  else if(btn.style.color == "red" || btn.style.color == "green"){ // undo the red (answered) non prime
    replace_primes_of_a_white(btn, 0);

    // change title back & hint .hov back & tally visiblt
    if(title_text.nodeValue == game_over_title || title_text.nodeValue == new_solution_title){
      title_text.nodeValue = game_title;
      mid_buttons[2].style.color = "red";
      if(!(mid_buttons[0].classList.contains("hov"))){
        mid_buttons[0].classList.add("hov");
      }
      for(var s = 0; s < board_size; s++){
        if(bingo[s].style.color == "green" && bingo[s].style.fontStyle == "oblique"){
          bingo[s].style.color = "red";
        }
        else if(bingo[s].style.color == "green" && bingo[s].style.fontStyle == "normal"){
          bingo[s].style.color = "white";
        }
      }
    }
  }
  update_non_prime_hover();
  if(mid_buttons[2].childNodes[0].nodeValue != tally_label){
    update_tally();
  }

}
function primes_are_gone(){
  var gone = true;
  for(var i = 0; i < prime_buttons.length; i++){
    if(prime_buttons[i].style.color != "black"){
      gone = false;
    }
  }
  return gone;
}





function hint_clicked(e){
  if(hint_prime_buttons.length == 0 && count_colors_in_bingo("green") < board_size){ // count_colors_in_bingo() is there to prevent infinite loop
    var btn = e.target || e.srcElement; // e.target is for Firefox
    var hint_found = false;
    while(!(hint_found)){ // find a white non_prime to use for hint
      var rando = getRandomIntInclusive(0, board_size-1);
      if(!(bingo[rando].style.fontStyle == "oblique") && !(bingo[rando].style.color == "green")){
        hint_found = true;
      }
    }
    var hint_primes = cmput_prime_factors_of_x(bingo[rando].childNodes[0].nodeValue);
    for(var i = 0; i < hint_primes.length; i++){ // find prime to use for green hinted non_prime
      var found_it = false;
      for(var j = 0; j < prime_buttons.length; j++){ // first look for an available prime (red or blue)
        if(prime_buttons[j].style.color != "black" && !(hint_prime_buttons.includes(prime_buttons[j])) && prime_buttons[j].childNodes[0].nodeValue == hint_primes[i]){
          hint_prime_buttons.push(prime_buttons[j]);
          found_it = true;
          break;
        }
      }
      if(!found_it){ // look for a darkened prime
        for(var b = 0; b < prime_buttons.length; b++){
          if(prime_buttons[b].style.color == "black" && !(hint_prime_buttons.includes(prime_buttons[b])) && prime_buttons[b].childNodes[0].nodeValue == hint_primes[i]){
            prime_buttons[b].style.fontStyle = "italic"; // differentiate to return to black
            hint_prime_buttons.push(prime_buttons[b]);
            break;
          }
        }
      }
    }
    answer_reveal("green", hint_prime_buttons);
    setTimeout(function(){ bingo[rando].style.color = "green"; }, 500);
    setTimeout(function(){ bingo[rando].style.fontStyle = "italic"; }, 500); // new
    setTimeout(function(){ return_hinted_colors(rando); }, 2500);
    setTimeout(function(){ hint_prime_buttons = []; }, 2550);
  }
}





function middle_clicked(e){ // unused yet. for sound later?
  //var btn = e.target || e.srcElement; // e.target is for Firefox
  //var name = (btn.childNodes[0].nodeValue);
}
function tally_clicked(e){ //mid_buttons[2] is tally button
  var btn = e.target || e.srcElement; // e.target is for Firefox
  if(btn.childNodes[0].nodeValue == tally_label){
    update_tally();
    btn.childNodes[0].nodeValue = running_tally;
    tal = true;
  }
  else{
    btn.childNodes[0].nodeValue = tally_label;
    tal = false;
  }
}





function new_game_clicked(e){
  anim_timeout_list = [];
  anim_timeout_index = 0;

  matrix = [];
  non_primes = [];
  bingo = [];
  prime_buttons = [];
  relevant_primes = [];
  difficulty_buttons = [];
  mid_buttons = [];
  instruction_button_list = [];

  answered_primes_dictionary = {};
  answer_list = [];
  button_num = 0;
  document.body.innerHTML = "";

  running_tally = 1;
  size_label = board_size + " by " + board_size;
  range_label = "9 - " + range[1];
  running_anim_time = 0;

  play();
}





function prime_clicked(e){
  var btn = e.target || e.srcElement; // e.target is for Firefox
  if((btn.style.color == "blue")){
    btn.style.fontStyle = "oblique";
    btn.style.color = "red";
  }
  else if(btn.style.color == "red"){
    btn.style.fontStyle = "normal";
    btn.style.color = "blue";
  }
  update_non_prime_hover();
  if(mid_buttons[2].childNodes[0].nodeValue != tally_label){
    update_tally();
  }
}





function demo_button_clicked(e){
  var btn = e.target || e.srcElement; // e.target is for Firefox
  for(var p = 0; p < prime_buttons.length; p++){ // unselect primes in any are red
    if(prime_buttons[p].style.color == "red"){
      prime_buttons[p].style.color = "blue";
      prime_buttons[p].style.fontStyle = "normal";
    }
  }
  answer_list = [];
  if(instruction_button_list[1].style.color == "black"){ // if instructions are hidden
    if(!(title_text.nodeValue == game_over_title || title_text.nodeValue == new_solution_title)){
      btn.disabled = true;
      instruction_button_list[1].style.color = "white";
      instruction_button_list[2].style.color = "white";
      instruction_button_list[3].style.color = "white";
      running_anim_time += reading_time;
      onclicks_disabled(true); // ################################### ANIM BEGINS
      undo_wrongs(); // in demo.js
    }
  }
}
