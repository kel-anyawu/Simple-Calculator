const numBtn = document.getElementsByClassName("number");
const operationBtn = document.getElementsByClassName("operator");
const equalsBtn = document.getElementById("equal");
const clearBtn = document.getElementById("clear");
const deleteBtn = document.getElementById("delete");
const calculationDisplay = document.getElementById("previousOperation");
const resultDisplay = document.getElementById("currentOperation");


//     EVENT LISTENER FOR ALL BUTTONS
loadEventListeners();
function loadEventListeners(){
     // for number buttons
     for (let i = 0; i < numBtn.length; i++)
     numBtn[i].addEventListener("click", displayContent);

     //for operation buttons
     for (let i = 0; i < operationBtn.length; i++)
     operationBtn[i].addEventListener("click", addOperator);

     //for clear
     clearBtn.addEventListener("click", clearDisplay);

     //for delete
     deleteBtn.addEventListener("click", deleteValue);

     //for equals button
     equalsBtn.addEventListener("click", handleEquals);
}

function displayContent(e){
     const currentValue = calculationDisplay.textContent;
     let input = e.target.textContent;

     calculationDisplay.textContent = currentValue == "0" ? input : currentValue + input;
     //if (currentValue == 0)   currCalc.textContent = input;
     //else currCalc.textContent = currentValue + input;
}

function addOperator(e){
     const currentValue = calculationDisplay.textContent;
     let input = e.target.textContent;

     //Validate Inputs
     if (InputIsValid(currentValue, input))   calculationDisplay.textContent = currentValue + input;
}

function clearDisplay(e){
     calculationDisplay.textContent = 0;
}

function deleteValue(e){
     if (calculationDisplay.textContent != "0"){

          const value = [];
          for (let i = 0; i < calculationDisplay.textContent.length-1; i++){
               value.push(calculationDisplay.textContent[i])
          }
          let valueString = "";
          for (let i = 0; i < value.length; i++){
               valueString += value[i];
          }
          calculationDisplay.textContent = valueString == "" ? "0" : valueString;
     }
}


function handleEquals(e){
     const calcString = calculationDisplay.textContent;
     let calcFragments = [];
     let tempString = "";

     if (isNaN(calcString[calcString.length-1])) {          
          console.log("Notify wrong input");
     }else{
          //separate the strings into fragments so we can apply bodmas
          for (let i = 0; i < calcString.length; i++){

               if (isNaN(parseFloat(calcString[i]))){

                    if (tempString != "" && calcString[i] != ".") calcFragments.push(tempString);
                    else tempString += calcString[i];

                    if (calcString[i] != ".") calcFragments.push(calcString[i]);
                    if (tempString[tempString.length-1] != ".") tempString = "";
               }
               else{
                    tempString += calcString[i];
               }
          }
          if (tempString != "") calcFragments.push(tempString);

          //
          //do the actual calculation
          //          

          //first check for division
          let i = calcFragments.indexOf("÷");
          while (i != -1) {
               calcFragments = calculate(calcFragments, i, "÷")
               i = calcFragments.indexOf("÷");
          }

          //then multiplication
          i = calcFragments.indexOf("×");
          while (i != -1) {
               calcFragments = calculate(calcFragments, i, "×");
               i = calcFragments.indexOf("×");
          }

          //then addition
          i = calcFragments.indexOf("+");
          while (i != -1) {
               calcFragments = calculate(calcFragments, i, "+");
               i = calcFragments.indexOf("+");
          }

          //then subtraction
          i = calcFragments.indexOf("-");
          while (i != -1) {
               if (calcFragments.length > 2)     calcFragments = calculate(calcFragments, i, "-");
               else     calcFragments.splice(0, 2, calcFragments[0].toString() + calcFragments[1].toString());
               i = calcFragments.indexOf("-");
          }
          //set result on screen
          resultDisplay.textContent = calcFragments.toString();          
     }
}

     function calculate(array, i, operator){

          let firstOperand,secondOperand;
          if (OperandsAreNegative(array, i)){
               //if the element precceding the operands in the array is a "-" then concatenate the operand and the preceeding element and treat the operand as a negative value.
               firstOperand = array[i - 2] + array[i - 1];
               secondOperand = array[i + 1] + array[i + 2];
               if (operator == "+")          tempResult = parseFloat(firstOperand) + parseFloat(secondOperand);
               else if (operator == "-")     tempResult = parseFloat(firstOperand) - parseFloat(secondOperand);
               else if (operator == "×")     tempResult = parseFloat(firstOperand) * parseFloat(secondOperand);
               else if (operator == "÷")     tempResult = parseFloat(firstOperand) / parseFloat(secondOperand);

               //if the result is a negative value, introduce a "-" character before tempResult
               if(tempResult < 0)  array.splice(i - 2, 5, "-", tempResult*-1);
               else {
                    if (isNaN(parseFloat(array[i-3])))      array.splice(i - 2, 5, tempResult);
                    else     array.splice(i - 2, 5, "+", tempResult);
               }
               return array;
     
          }else if (FirstOperandIsNegative(array, i)){
               firstOperand = array[i - 2] + array[i - 1];
               if (operator == "+")          tempResult = parseFloat(firstOperand) + parseFloat(array[i + 1]);
               else if (operator == "-")     tempResult = parseFloat(firstOperand) - parseFloat(array[i + 1]);
               else if (operator == "×")     tempResult = parseFloat(firstOperand) * parseFloat(array[i + 1]);
               else if (operator == "÷")     tempResult = parseFloat(firstOperand) / parseFloat(array[i + 1]);

               if(tempResult < 0)  array.splice(i - 2, 4, "-", tempResult*-1);
               else{
                    if (isNaN(parseFloat(array[i-3])))     array.splice(i - 2, 4, tempResult);
                    else     array.splice(i - 2, 4, "+", tempResult);
               }
               return array;
     
          }else if (SecondOperandIsNegative(array, i)){
               secondOperand = array[i + 1] + array[i + 2];
               if (operator == "+")          tempResult = parseFloat(array[i - 1]) + parseFloat(secondOperand);
               else if (operator == "-")     tempResult = parseFloat(array[i - 1]) - parseFloat(secondOperand);
               else if (operator == "×")     tempResult = parseFloat(array[i - 1]) * parseFloat(secondOperand);
               else if (operator == "÷")     tempResult = parseFloat(array[i - 1]) / parseFloat(secondOperand);

               if(tempResult < 0)  array.splice(i - 1, 4, "-", tempResult*-1);
               else {
                    if (isNaN(parseFloat(array[i-2])))     array.splice(i - 1, 4, tempResult);
                    else     array.splice(i - 1, 4, "+", tempResult);
               }
               return array;
     
          }else{
               if (operator == "+")          tempResult = parseFloat(array[i - 1]) + parseFloat(array[i + 1]);
               else if (operator == "-")     tempResult = parseFloat(array[i - 1]) - parseFloat(array[i + 1]);
               else if (operator == "×")     tempResult = parseFloat(array[i - 1]) * parseFloat(array[i + 1]);
               else if (operator == "÷")     tempResult = parseFloat(array[i - 1]) / parseFloat(array[i + 1]);
               
               array.splice(i - 1, 3, tempResult);     return array;
          }
     }


function OperandsAreNegative(array, i){

     if (array[i - 2] == "-" && array[i + 1] == "-") return true;
}

function FirstOperandIsNegative(array, i){

     if (array[i - 2] == "-") return true;
}

function SecondOperandIsNegative(array, i){

     if (array[i + 1] == "-") return true;
}

function InputIsValid(value, input){
     OverTwoOperators = false;
     WrongOperator = false;
     InvalidInput = false;
     const operators = ["+", "-", "×", "÷"];
     const lastNum = value[value.length-1];
     const numBeforeLast = value[value.length-2];

     if (operators.includes(lastNum) && operators.includes(numBeforeLast) && operators.includes(input))
          OverTwoOperators = true;
     if (operators.includes(lastNum) && (input == "÷" || input == "×"  || input == "+"))
          WrongOperator = true;
     if (lastNum =="." && (operators.includes(input) || input == "."))    InvalidInput = true;
     
     if (!OverTwoOperators && !WrongOperator && !InvalidInput)     return true;
}