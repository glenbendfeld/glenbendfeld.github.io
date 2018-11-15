// DEMO called from:    function demo_button_clicked(e)    in onclick_event.js
//var amt_of_wrongs = 0;




function undo_wrongs(){
  var wrongs = []; // gather wrongs
  for(var e = 0; e < board_size; e++){
    for(var f = 0; f < board_size; f++){
      if(matrix[e][f].style.color == "red" && !(bingo.includes(matrix[e][f]))){ // wrong red
        wrongs.push(matrix[e][f]);
        amt_of_wrongs += 1;
      }
    }
  }
  for(var w = 0; w < wrongs.length; w++){ // turn wrong white and its primes blue
    replace_primes_of_a_white(wrongs[w], true);
    running_anim_time += anim_interval;
    timeout_update_tally();
  }
  anim_timeout_list[anim_timeout_index++] = setTimeout(function(){answer_unanswered();}, running_anim_time);
}





function answer_unanswered(){
  var found_visible_primes = [];
  for(var q = 0; q < bingo.length; q++){ // examine bingo for white non primes
    if(bingo[q].style.color == "white" || bingo[q].style.color == "green"){
      var answer_primes = cmput_prime_factors_of_x(bingo[q].childNodes[0].nodeValue);
      var temp = [];
      for(var i = 0; i < answer_primes.length; i++){ // for each answer prime looking for
        for(var j = 0; j < prime_buttons.length; j++){ // look for unfound prime button
          if(prime_buttons[j].style.color != "black" && prime_buttons[j].childNodes[0].nodeValue == answer_primes[i] && !(temp.includes(j)) && !(found_visible_primes.includes(j))){
            temp.push(j);
            break;
          }
        }
      }
      var anim_answer_list = list_answer_buttons(found_visible_primes, temp, q);
      new_dictionary_entry(anim_answer_list, bingo[q]);
      click_answer_white(found_visible_primes, temp, q);
    }
  }
  timeout_check_for_win();
  timeout_reset_board();
}

function list_answer_buttons(found_visible_primes, temp, q){
  var anim_answer_list = [];
  // make answer list og prime buttons
  for(var t = 0; t < temp.length; t++){
    anim_answer_list.push(prime_buttons[temp[t]]);// make list to put into dictionary
  }
  return anim_answer_list;
}

function click_answer_white(found_visible_primes, temp, q){
  for(var g = 0; g < temp.length; g++){
    timeout(prime_buttons[temp[g]], "red", "oblique", running_anim_time);
    running_anim_time += anim_interval;
    found_visible_primes.push(temp[g]); // keep track so we don't find the same prime twice
  }
  timeout(bingo[q], "red", "oblique", running_anim_time); // white non_prime turn red
  for(var g = 0; g < temp.length; g++){
    timeout(prime_buttons[temp[g]], "black", "oblique", running_anim_time);
  }
  temp = [];
}





function replace_primes_of_a_white(btn, animate){  // interval used for animation if > 0
  if(!(animate)){ // used in reg gameplay
    var bn = btn.childNodes[1].childNodes[0].nodeValue;  // dictionary key (made in add_button_num)
    btn.style.color = "white";
    btn.style.fontStyle = "normal";
    var replacer = answered_primes_dictionary[bn]; // making a list from dict should i erase dict entry?
    for(var i = 0; i < replacer.length; i++){
      replacer[i].style.color = "blue";
      replacer[i].style.fontStyle = "normal";
      // -- UPDATE TALLY
      anim_timeout_list[anim_timeout_index++] = setTimeout(function(){update_tally();}, running_anim_time);
    }
  }
  else if(animate){
    timeout(btn, "white", "normal", running_anim_time);
    var bn = btn.childNodes[1].childNodes[0].nodeValue;  // dictionary key (made in add_button_num)
    var replacer = answered_primes_dictionary[bn];
    for(var i = 0; i < replacer.length; i++){
      timeout(replacer[i], "blue", "normal", running_anim_time);
    }
    running_anim_time += anim_interval;
  }
  delete answered_primes_dictionary[bn];
}





function reset_board(){
  amt_of_wrongs = 0;
  anim_timeout_list = [];
  for(var a = 0; a < bingo.length; a++){
    replace_primes_of_a_white(bingo[a], true);
  }
  anim_timeout_list[anim_timeout_index++] = setTimeout(function(){title_text.nodeValue = game_title;}, running_anim_time); // title change back to game on
  anim_timeout_list[anim_timeout_index++] = setTimeout(function(){mid_buttons[2].style.color = "red";}, running_anim_time); //  button visible
  //instruction_button_list[1].style.color = "black";
  //instruction_button_list[1].style.color = "black";
  //instruction_button_list[1].style.color = "black";
  anim_timeout_list[anim_timeout_index++] = setTimeout(function(){instruction_button_list[1].style.color = "black";}, running_anim_time); // works okay
  //running_anim_time += anim_interval/divisor;
  anim_timeout_list[anim_timeout_index++] = setTimeout(function(){instruction_button_list[2].style.color = "black";}, running_anim_time); // works okay
  //running_anim_time += anim_interval/divisor;
  anim_timeout_list[anim_timeout_index++] = setTimeout(function(){instruction_button_list[3].style.color = "black"; instruction_button_list[0].disabled = false; if(!(instruction_button_list[0].classList.contains("hov"))){instruction_button_list[0].classList.add("hov");};}, running_anim_time); // works okay

  anim_timeout_list[anim_timeout_index++] = setTimeout(function(){onclicks_disabled(false);}, running_anim_time);
  anim_timeout_list[anim_timeout_index++] = setTimeout(function(){running_anim_time = 0;}, running_anim_time);
}





function quick_reset_board(){
  amt_of_wrongs = 0;
  anim_timeout_list = [];
  // clear matrix
  for(var a = 0; a < board_size; a++){
    for(var b = 0; b < board_size; b++ ){
      if(matrix[a][b].style.color == "red" || matrix[a][b].style.color == "green"){
        replace_primes_of_a_white(matrix[a][b], false);
      }
    }
  }
  // clear primes
  for(var p = 0; p < prime_buttons.length; p++){
    if(prime_buttons[p].style.color == "red" || prime_buttons[p].style.color == "green" || prime_buttons[p].style.color == "black"){
      prime_buttons[p].style.color = "blue";
      prime_buttons[p].style.fontStyle = "normal";
      update_tally();
    }
  }
  title_text.nodeValue = game_title; // title change back to game on
  mid_buttons[2].style.color = "red"; //  button visible
  instruction_button_list[1].style.color = "black";
  instruction_button_list[2].style.color = "black";
  instruction_button_list[3].style.color = "black";
  instruction_button_list[0].disabled = false; // disable self hover tooo
  if(!(instruction_button_list[0].classList.contains("hov"))){
    instruction_button_list[0].classList.add("hov");
  }
  onclicks_disabled(false);
  answered_primes_dictionary = {};
  //amt_of_wrongs = 0;
  //anim_timeout_list = [];



}





function onclicks_disabled(tv){
  for(var h = 0; h < header_buttons.length; h++){ // disable header
    header_buttons[h].disabled = tv;
    hovs_disabled(header_buttons[h], tv);
  }
  for(var i = 0; i < board_size; i++){ // disable matrix   non primes
    for(var j = 0; j < board_size; j++){
      matrix[i][j].disabled = tv;
      hovs_disabled(matrix[i][j], tv);
    }
  }
  for(var m = 0; m < mid_buttons.length; m++){ // disable mids
    mid_buttons[m].disabled = tv;
    hovs_disabled(mid_buttons[m], tv);
  }
  for(var k = 0; k < prime_buttons.length; k++){ // disable primes
    prime_buttons[k].disabled = tv;
    hovs_disabled(prime_buttons[k], tv);
  }
  reset_button_list[0].disabled = tv; // disable reset button
  hovs_disabled(reset_button_list[0], tv);

  instruction_button_list[0].disabled = tv; // disable demo button
  hovs_disabled(instruction_button_list[0], tv);
}
function hovs_disabled(btn, tv){
  if(tv == true){ // true means disabled  //}(matrix[i][j].classList.contains("hov")){
    btn.classList.remove("hov");
  }
  else{
    btn.classList.add("hov");
  }
  update_non_prime_hover();
}




// ##########################  TIMEOUT FXS
function timeout_update_tally(){
  anim_timeout_list[anim_timeout_index++] = setTimeout(function(){update_tally();}, running_anim_time);

}
function timeout_check_for_win(){
  anim_timeout_list[anim_timeout_index++] = setTimeout(function (){check_for_win();}, running_anim_time);

}
function timeout_reset_board(){
  var timee = ((amt_of_wrongs + board_size) * anim_interval);
  anim_timeout_list[anim_timeout_index++] = setTimeout(function(){reset_board();}, timee);

  amt_of_wrongs = 0;

}
function timeout(btn, color, fontstyle, interval){
  anim_timeout_list[anim_timeout_index++] = setTimeout(function(){btn.style.color = color; btn.style.fontStyle = fontstyle;}, interval);
  anim_timeout_list[anim_timeout_index++] = setTimeout(function(){update_tally();}, running_anim_time);
}
// ##########################
