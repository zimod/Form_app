//this will focus on the name text field when loading the page
const auto_focus = ()=>{
  $("#name").focus();
};

//this will show the text field when the user selects "Other" in the job role
const other_job = ()=>{
  $("#other-title").hide();//hide our field first
  $("#title").change(function(){
    if($( "#title option:selected" ).val() === "other"){//this condition is true when the selected option is "Other"
       $("#other-title").show(); //show the other field
    }else{// conditions that "others" are not selected
       $("#other-title").hide();//hide the other field
    }
  });
};

const shirt_color = ()=>{

  const helper = (val1,val2,val3)=>{// a helper function for the color selection

    $("#color").show();
    $("#color-label").show();
    $("#color option").hide();
    $("#color option[value= '"+val1+"']").show();//show al related color for js pun
    $("#color option[value= '"+val2+"']").show();
    $("#color option[value= '"+val3+"']").show();
    $("#color option").attr("selected",false);//make all other options not selected
    $("#color option[value= '"+val1+"']").attr("selected",true);//select the cornflowerblue color
  };

  $("#color").hide();//we need to hide all options at start for no selection
  $("#color-label").hide();
  const $no_selected_design = $(`<option selected value="no_select">Please Select a T-shirt Theme</option>`);//this is when no theme is selected by user
  $("#color").prepend($no_selected_design);//append it to the selection

  $("#design").change(function(){//we display the color options according to design options
    const $design_value = $( "#design option:selected" ).val();//this is the value of selected design

    if($design_value ==="default"){//if the user selects the default
      helper("no_select");
    }else if($design_value ==="js puns"){//if the user selects js puns
      helper("cornflowerblue","darkslategrey","gold");
    }else{//heart js
      helper("tomato","steelblue","dimgrey");
    }
  });
};

//this function will check conflict on dates , if there is one then it will disable the related checkbox
const check_conflict = ()=>{
  $(".activities input").change(function(){// triggers when the user uses the checkbox
     let $meeting_label = $(this).parent();
     let $meeting_time = $(this).parent().attr('class');//this is the related className of the checkbox label in html
     if($(this).prop('checked')){//use prop instead of attr because it has a default value
       $meeting_label.siblings('.'+ $meeting_time).children().attr("disabled",true);//This is very important because it will select all siblings with the same class name
     }else{
       $meeting_label.siblings('.'+ $meeting_time).children().attr("disabled",false);//This is very important because it will select all siblings with the same class name
     }
 });
};

//this function will calculate the total cost for all meetings, and show it in the page
const total_expense = ()=>{
  const $total_amount = $(`<h2>Total:$</h2>`);//first create out total header
  $(".activities").append($total_amount);//append it to the activities fieldset
  $total_amount.hide();//no need to show this when user didnt check anything

  $(".activities").change(function(){// triggers when the user use the checkbox
    //This is very important, the function maps all the checked box value into myArray
     let myArray = $(".activities input:checked").map(function(){
       return $(this).val();
    }).get();//Important to note that map doesn't return an array, it returns a jQuery wrapper around an array. You have to use .get() to get the actual array

    let total = 0;//total is our total amount here
    for(let i = 0;i<myArray.length;i++){
      total += parseInt(myArray[i]);
    }

    if(total!==0){
     $total_amount.text("Total:$"+total);
     $total_amount.show();//show the amount
   } else{//total is 0
     $total_amount.hide();//hide the amount
   }
  });
};

//this function will show and hide pay method sections according to user selection
const pay_methods = ()=>{
  const show_hide =(a,b,c)=>{//helper function that show a and hide b,c
    a.show();
    b.hide();
    c.hide();
  };
   show_hide($("#credit-card"),$("#paypal"),$("#bitcoin"));//set the default to credit card option
   $("#payment").change(function(){//this will trigger when the user select one payment methods
     const $payment_value = $("#payment option:selected").val();
     console.log($payment_value);
       if($payment_value === "credit card"){
         show_hide($("#credit-card"),$("#paypal"),$("#bitcoin"));
       }else if($payment_value === "paypal"){
         show_hide($("#paypal"),$("#credit-card"),$("#bitcoin"));
       }else if($payment_value === "bitcoin"){
         show_hide($("#bitcoin"),$("#paypal"),$("#credit-card"));
       }else{//default
         show_hide($("#credit-card"),$("#paypal"),$("#bitcoin"));
       }
   });
};

const form_validation = ()=>{
  let flag = true;//flag to check for submission

  //create the error message in html and hide it
  const $activity_error = $(`<h5>Please select at least one activity</h5>`);
  $activity_error.css("color","red");
  $("#activity-legend").append($activity_error);
  $activity_error.hide();

  const $shirt_error = $(`<h5>Don't forget to grab a shirt!</h5>`);
  $shirt_error.css("color","red");
  $("#shirt_legend").append($shirt_error);
  $shirt_error.hide();
  //real time email validation
  $("#mail").on("keyup",function(){//use keyup event handler, keyup is triggered when the keyboard is released
      if($("#mail").val().indexOf("@") === -1 || $("#mail").val().indexOf(".com") === -1){//the input contains no @ sign or .com
        $("#mail-label").text("Email:(please provide a valid email address)");
        $("#mail-label").css("color","red");
        flag = false;
      }else{//the input has both @ and .com
        $("#mail-label").text("Email:");
        $("#mail-label").css("color","#184f68");
      }
  });

  //handler for submit button
  $("#btn-submit").on("click",function(e){

    e.preventDefault();//prevent default submission
    //name field
    if($("#name").val() === ''){//if name field is empty
       $("#name-label").text("Name:(please provide your name)");
       $("#name-label").css("color","red");
       flag = false;
    }else{// name field is not empty
      $("#name-label").text("Name:");
      $("#name-label").css("color","#184f68");

    }
    //email
    if($("#mail").val() === ''){
      $("#mail-label").text("Email:(currently is empty)");
      $("#mail-label").css("color","red");
      flag = false;
    }

   //t-shirt
    if($("#design option:selected").val() === "default"){//the user did not make a t-shirt selection
       $shirt_error.show();
       flag = false;
    }else{//user made a shirt selection
      $shirt_error.hide();

    }
   //activity checkbox
    if($(".activities input:checked").length === 0){//no check box is selected
       $activity_error.show();
       flag = false;
    }else{//at least one selected
       $activity_error.hide();

    }
    //credit card
  if($("#payment option:selected").val() === "credit card" || $("#payment option:selected").val() === "select_method"){//user has to choose credit card option before checkings
   //credit card number
   console.log($("#payment option:selected").val());
    if($("#cc-num").val().length >= 13 && $("#cc-num").val().length <= 16){//first check if the length of credit number is correct
      if($.isNumeric($("#cc-num").val())){//second check if the input is actually numbers only
           //correct input
          $("#cc-label").text("Card Number:");
          $("#cc-label").css("color","#184f68");

      }else{//incorrect format of input, not all are numbers
         $("#cc-label").text("Card Number: incorrect number");
         $("#cc-label").css("color","red");
         flag = false;
      }
    }else if($("#cc-num").val().length === 0){//empty field
       $("#cc-label").text("Please enter a credit card number");
       $("#cc-label").css("color","red");
       flag = false;
    }else{//too short or too long
      $("#cc-label").text("Number should between 13 and 16 digits");
      $("#cc-label").css("color","red");
      flag = false;
    }
    //credit card zip code
    if($("#zip").val().length === 5){//correct length
       $("#zip-label").text("Zip Code:");
       $("#zip-label").css("color","#184f68");

    }else{//incorrect length
       $("#zip-label").text("Zip Code: 5 digits");
       $("#zip-label").css("color","red");
       flag = false;
    }
    //credit card CVV
    if($("#cvv").val().length === 3){//input is 3 digits
        if($.isNumeric($("#cvv").val())){//input is 3 number
          //correct input
          $("#cvv-label").text("CVV:");
          $("#cvv-label").css("color","#184f68");

        }else{//not numbers
          $("#cvv-label").text("CVV: Incorrect");
          $("#cvv-label").css("color","red");
          flag = false;
        }
      }else{//input is not 3 digits
        $("#cvv-label").text("CVV: Incorrect");
        $("#cvv-label").css("color","red");
        flag = false;
    }
  }

    //flag check
    if(flag){
      $("form").submit();
    }
  });
};








const main = ()=>{
  auto_focus();
  other_job();
  shirt_color();
  check_conflict();
  total_expense();
  pay_methods();
  form_validation();

};
main();
