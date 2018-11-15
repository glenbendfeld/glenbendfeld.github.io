
function make_a_button(fx, content, list, index, color, size){
  var btn = document.createElement("BUTTON");
  btn.addEventListener('click', fx, false);
  btn.style.fontStyle = "normal";
  var t = document.createTextNode(content);
  btn.appendChild(t);
  document.body.appendChild(btn);
  btn.style.color = color;
  btn.style.fontSize = size;
  if(list == mid_buttons || list == prime_buttons || list == header_buttons){
    btn.classList.add("hov");
  }
  btn.classList.add("fade_in");
  list[index] = btn;
  if(content == "+" || content == "-" || content == "?" || content == reset_symbol || fx == null){
    return btn;
  }
}




function create_header_buttons(){
  var size_up_btn = make_a_button(size_up_clicked, "+", header_buttons, 0, "white", top_button_size);
  add_tooltip(size_up_btn, size_label);
  var decrease_board_btn = make_a_button(size_down_clicked, "-", header_buttons, 1, "white", top_button_size);
  add_tooltip(decrease_board_btn, size_label);
  create_title(game_title, reg_font_size);
  var range_up_btn = make_a_button(range_up_clicked, "+", header_buttons, 2, "white", top_button_size);
  add_tooltip(range_up_btn, range_label);
  var range_down_btn = make_a_button(range_down_clicked, "-", header_buttons, 3, "white", top_button_size);
  add_tooltip(range_down_btn, range_label);
}





function create_title(content, size){
  var t = document.createTextNode(content);
  var span = document.createElement('span');
  span.classList.add("fade_in");
  span.style.fontSize = size;
  span.appendChild(t);
  title_text = t;
  document.body.appendChild(span);
}





function add_tooltip(btn, content){
  btn.classList.add("tooltip");
  var span = document.createElement('span');
  span.classList.add("tooltiptext");
  span.style.fontSize = tool_tip_font_size;
  var words = document.createTextNode(content);
  span.appendChild(words);
  btn.appendChild(span);
}





function create_board(){ // answer code list for checking for unintended win built here
  parse_range();
  for(var i = 0; i < board_size; i++){
    var div = document.createElement("div");
    document.body.appendChild(div);
    var row = [];
    for(var j = 0; j < board_size; j++){
      if(test_mode){
        var rando = 22;
      }
      else{
        var rando = non_primes[Math.floor(Math.random() * non_primes.length)];
      }
      make_a_button(non_prime_clicked, rando, row, j, "white", "");
    }
    matrix[i] = row;
  }
}
function parse_range(){
  var omits = [16, 32, 64, 128, 256, 512]; // powers of two omitted to limit 2s on board
  non_primes = [];
  relevant_primes = [2, 3, 5, 7];
  var limit = Math.ceil(range[1]/2); // limit relevant primes to half of upper range
  for(var num = 9; num < range[1]; num++){ // 9 is lowest non prime on board
    if(!(omits.includes(num))){
      if(!(is_prime(num))){
        non_primes.push(num);
      }
      else if(num <= limit){
        relevant_primes.push(num);
      }
    }
  }
}





function create_col_list(rand){
  col = [];
  for(var i = 0; i < board_size; i++){
    col[i] = matrix[i][rand - board_size];
  }
  return col;
}





function create_mid_buttons(){
  var tally_content = null;
  if(tal){
    tally_content = running_tally;
  }
  else{
    tally_content = tally_label;
  }
  var ind = 0;
  var div = document.createElement("div");
  document.body.appendChild(div);
  make_a_button(hint_clicked, "hint", mid_buttons, ind++, "green", mid_button_size);
  make_a_button(middle_clicked, "", mid_buttons, ind++, "black", mid_button_size); // used only as a spacer at this point
  make_a_button(tally_clicked, tally_content, mid_buttons, ind++, "red", tally_size); // tally button made
  make_a_button(middle_clicked, "", mid_buttons, ind++, "black", mid_button_size); // used only as a spacer at this point
  make_a_button(new_game_clicked, "new", mid_buttons, ind++, "yellow", mid_button_size);
}





function create_prime_buttons(primes){
  var count = 0;
  for(var i = 0; i < primes.length; i++){
    if(count++ % board_size == 0){ // make new rows
      var div = document.createElement("div");
      document.body.appendChild(div);
    }
    make_a_button(prime_clicked, primes[i], prime_buttons, i, "blue", "");
  }
}





function create_instruction_buttons(){
  var div1 = document.createElement("div");
  document.body.appendChild(div1);
  var instruction_button1 = make_a_button(demo_button_clicked, "?", instruction_button_list, 0, "white", top_button_size);
  add_tooltip(instruction_button1, "demo");
  instruction_button1.classList.add("hov");
  instruction_button1.style.position = "relative";
  instruction_button1.style.left = "-28vmin"; // shift to the left to keep out of the way

  var reset_button = make_a_button(quick_reset_board, reset_symbol, reset_button_list, 0, "white", mid_button_size);
  reset_button.classList.add("hov");
  add_tooltip(reset_button, "reset");
  reset_button_list[0];

  reset_button.style.position = "relative";
  reset_button.style.left = "28vmin"; // shift to the left to keep out of the way

  var div2 = document.createElement("div");
  document.body.appendChild(div2);
  var instruction_button2 = make_a_button(null, instructions_1, instruction_button_list, 1, "black", top_button_size);
  instruction_button2.style.width = "80vmin";
  instruction_button2.classList.remove("hov");

  var div3 = document.createElement("div");
  document.body.appendChild(div3);
  var instruction_button3 = make_a_button(null, instructions_2, instruction_button_list, 2, "black", top_button_size);
  instruction_button3.style.width = "80vmin";
  instruction_button3.classList.remove("hov");

  var div4 = document.createElement("div");
  document.body.appendChild(div4);
  var instruction_button4 = make_a_button(null, instructions_3, instruction_button_list, 3, "black", top_button_size);
  instruction_button4.style.width = "80vmin";
  instruction_button4.classList.remove("hov");
}
