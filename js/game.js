var test_mode = false; // top row is the solution always

var title_text = null;
var game_title = " Find Primes ";
var game_over_title = " Primes Found ";
var new_solution_title = " New Solution! ";
var reset_symbol = "|<-";


var tally_label = "x";
var tally_size = "3vmin";
var tal = false;
var running_tally = 1;

var size_label = "2 by 2";
var range_label = "9 - 49";
var reg_font_size = "5vmin"; // button font size
var top_button_size = "3vmin";
var mid_button_size = "2.5vmin";
var tool_tip_font_size = "1.5vmin";

var instructions_1 = "Sort the prime factors below ";
var instructions_2 = "to match the non-prime products above ";
var instructions_3 = "so that a bingo line is formed.";
var reading_time = 1000; // used in demo_button_clicked() in onclick_functions.js
var running_anim_time = 0; // used in demo.js
var anim_interval = 400;
var anim_timeout_list = [];
var anim_timeout_index = 0;
var amt_of_wrongs = 0;


var board_size = 2;
var range = [0, 49];

var header_buttons = []; // not really used yet
var matrix = [];
var non_primes = [];
var bingo = [];
var prime_buttons = [];
var relevant_primes = [];
var answered_primes_dictionary = {};
var answer_list = [];
var button_num = 0;
var mid_buttons = [];
var hint_prime_buttons = [];
var instruction_button_list = [];
var reset_button_list = [];



function play(){
  create_header_buttons(); // in create.js
  create_board(); // in create.js
  determine_bingo(); // in this file
  create_mid_buttons(); // in create.js
  var primes = cmput_primes(); // in this file
  create_prime_buttons(primes); // in create.js
  create_instruction_buttons(); // in create.js
}

function determine_bingo(){
  if(test_mode){
    rando = 0;
  }
  else{
    var rando = getRandomIntInclusive(0, ((board_size * 2)+1));
  }
  if(rando >= 0 && rando < board_size){
    bingo = matrix[rando];
  }
  else if(rando >= board_size && rando < (board_size * 2)){
    bingo = create_col_list(rando);
  }
  else if(rando == (board_size * 2)){
    for(var i = 0; i < board_size; i++){
      bingo[i] = matrix[i][i];
    }
  }
  else if(rando == ((board_size * 2)+1)){
    var l = board_size - 1;
    for(var k = 0; k < board_size; k++){
      bingo[k] = matrix[k][l];
      l--;
    }
  }
}





function update_tally(){
  var no_reds = true;
  running_tally = 1;
  for(var i = 0; i < prime_buttons.length; i++){
    if(prime_buttons[i].style.color == "red"){
      running_tally *= parseInt(prime_buttons[i].childNodes[0].nodeValue);
      no_reds = false;
    }
  }
  if(no_reds){
    running_tally = 1;
  }
  if(mid_buttons[2].childNodes[0].nodeValue != tally_label){
    mid_buttons[2].childNodes[0].nodeValue = running_tally;
  }
}





function cmput_primes(){
  var all_primes = [];
  var temp = [];
  var amt_of_primes = 0;
  for(var i = 0; i < board_size; i++){
    var x = parseInt(bingo[i].childNodes[0].nodeValue);
    temp = cmput_prime_factors_of_x(x);
    for(var k = 0; k < temp.length; k++){
      all_primes[amt_of_primes++] = temp[k];
    }
  }
  all_primes.sort(function(a,b){return a - b;});
  return all_primes;
}





function update_non_prime_hover(){
  // see if any primes are clicked
  var there_is_a_red_prime = false;
  for(var x = 0; x < prime_buttons.length; x++){
    if(prime_buttons[x].style.color == "red"){
      there_is_a_red_prime = true;
    }
  }
  if(there_is_a_red_prime){
    for(var y = 0; y < board_size; y++){
      for(var z = 0; z < board_size; z++){
        if(matrix[y][z].style.color == "white"){
          if(!(matrix[y][z].classList.contains("hov"))){
            matrix[y][z].classList.add("hov");
          }
        }
      }
    }
  }
  else{
    for(var y = 0; y < board_size; y++){
      for(var z = 0; z < board_size; z++){
        if(matrix[y][z].style.color == "white"){
          if(matrix[y][z].classList.contains("hov")){
            matrix[y][z].classList.remove("hov");
          }
        }
      }
    }
  }
}





function add_button_num(btn){ // used to make dictionary keys for remembering prime answers
  var s = document.createTextNode(button_num++);
  var span = document.createElement('span');
  span.style.fontSize = "0px";
  span.style.color = "black";
  span.appendChild(s);
  btn.appendChild(span);
}
function new_dictionary_entry(anim_answer_list, btn){
  add_button_num(btn); // dict key for white bingo elem
  var b_num = btn.childNodes[1].childNodes[0].nodeValue;  // dictionary key
  answered_primes_dictionary[b_num] = anim_answer_list; // add new correct answer to dict
}






function check_answer(btn, number){
  var correct = false;
  var answer_tally = 1;
  for(var i = 0; i < prime_buttons.length; i++){
    if(prime_buttons[i].style.color == "red"){
      answer_tally *= parseInt(prime_buttons[i].childNodes[0].nodeValue);
      answer_list.push(prime_buttons[i]);
    }
  }
  if(answer_tally == number){
    correct = true;
  }
  return correct;
}





function check_for_win(){
  if(count_colors_in_bingo("red") == board_size){
    answer_reveal("green", bingo);
    title_text.nodeValue = game_over_title; // win
    if(mid_buttons[0].classList.contains("hov")){ // remove hint .hov
      mid_buttons[0].classList.remove("hov");
    }
    mid_buttons[2].style.color = "black";

  }
  else{
    answered_code = parse_answered_code();
    if(is_unintended_win(answered_code)){ // unintended win
      answer_reveal("green", bingo);
      title_text.nodeValue = new_solution_title;
      if(mid_buttons[0].classList.contains("hov")){
        mid_buttons[0].classList.remove("hov");
      }
      mid_buttons[2].style.color = "black";
    }
  }
}





function parse_answered_code(){
  var answered_code = '';
  var hits = 0;
  for(var i = 0; i < board_size; i++){
    for(var j = 0; j < board_size; j++){
      if(matrix[i][j].style.color == "red"){
        answered_code += String(i) + String(j);
        hits++;
        if(hits == board_size){
          break;
        }
      }
    }
    if(hits == board_size){
      break;
    }
  }
  return answered_code;
}





function is_unintended_win(answered_code){
  var match = false;
  var index_code = '';
  for(var i = 0; i < board_size; i++){ // check rows
    index_code = '';
    for(var j = 0; j < board_size; j++){
      index_code += String(i) + String(j);
    }
    if(index_code == answered_code){
      return true;
    }
  }
  for(var i = 0; i < board_size; i++){ // check columns
    index_code = '';
    for(var j = 0; j < board_size; j++){
      index_code += String(j) + String(i);
    }
    if(index_code == answered_code){
      return true;
    }
  }
  index_code = '';
  for(var i = 0; i < board_size; i++){ // diag top left to bot right
    index_code += String(i) + String(i);
  }
  if(index_code == answered_code){
    return true;
  }
  var l = board_size - 1;
  index_code = '';
  for(var i = 0; i < board_size; i++){ // diag top right to bot left
    index_code += String(i) + String(l);
    l--;
  }
  if(index_code == answered_code){
    return true;
  }
  return false;
}





// //////////////////////////////////////////////////////////////////////////////////// Utility fxs





function is_prime(n){ // from W3schools
  if (n === 1 || n === 0){
    return false;
  }
  else if(n === 2){
    return true;
  }
  else{
    for(var x = 2; x < n; x++){
      if(n % x === 0){
        return false;
      }
    }
    return true;
  }
}





function cmput_prime_factors_of_x(x){
  var list_of_prime_factors = [];
  for(var prime = 0; prime < relevant_primes.length; prime++){ //here 'prime' is the index in list
    while(x % relevant_primes[prime] == 0){
      list_of_prime_factors.push(relevant_primes[prime]);
      x = x / relevant_primes[prime];
      x = Math.floor(x);
    }
    if(x == 1){
      break;
    }
  }
  return list_of_prime_factors;
}



function getRandomIntInclusive(min, max){ // h ttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
/*def random2or4(self): // use to limit easy non primes?
 if random.random() > 0.90:
 return 4
 else: return 2 */






function count_colors_in_bingo(color){
  var matches = 0;
  for(var i = 0; i < board_size; i++){
    if(bingo[i].style.color == color){
      matches++;
    }
  }
  return matches;
}





function return_hinted_colors(rando){
  bingo[rando].style.color = "white";
  bingo[rando].style.fontStyle = "normal";
  for(var i = 0; i < hint_prime_buttons.length; i++){
    if(hint_prime_buttons[i].style.fontStyle == "oblique"){
      hint_prime_buttons[i].style.color = "red";
    }
    else if(hint_prime_buttons[i].style.fontStyle == "italic"){
      hint_prime_buttons[i].style.color = "black";
      hint_prime_buttons[i].style.fontStyle = "oblique";
    }
    else{
      hint_prime_buttons[i].style.color = "blue";
    }
  }
}





function answer_reveal(color, list){
  var ct = 0;
  var flick = setInterval(function(){
                          list[ct++].style.color = color;

                          if(ct==list.length){
                            clearInterval(flick)};}, 100);
  setTimeout(function(){
             clearInterval(flick); }, 1000);
}
