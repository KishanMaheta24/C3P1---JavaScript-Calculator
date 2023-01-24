var inp = "";
let operators = [];
let operands = [];
let final = "";


var accumulator_value = 0;

const ops = ['*', '+', '-', '/', '%', '^', '(', ')', "|"];

//appending input to main string

function appendToInp(e) {
    inp = inp + e;
    document.getElementById("inp").value = inp;
}

//to check if given char is operator
function isOperator(inp) {
    let i = 0;
    for (i = 0; i < ops.length; i++) {
        if (ops[i] == inp) {
            return true;
        }

    }
    return false;
}

// function to check input from button and perform tasks accordingly

function processData(e) {
    if (e == "erase") {
        inp = inp.substring(0, inp.length - 1);

        document.getElementById("inp").value = inp;

    }
    else if (e === "=") {
        console.log("equal" + inp);
        evalFunctionUtil(inp);
        operands = [];
        operators = [];
        final = "";
        inp = "";

    }
    else if (e === "C") {
        inp = "";
        document.getElementById("inp").value = "";
        operands = [];
        operators = [];
        final = "";
    }
    else if (e === "MC") {
        accumulator_value = 0;
        console.log(accumulator_value);
    }
    else if (e == "MS") {
        let temp = document.getElementById("inp").value;

        if (isFloat(parseFloat(temp))) {
            accumulator_value = parseFloat(temp);
        }
        else if (isInt(parseInt(temp))) {
            accumulator_value = parseInt(temp);
        }
    }
    else if (e === "MR") {
        inp = inp + accumulator_value;
        document.getElementById("inp").value = inp;
    }
    else if (e === "M+") {
        let temp = document.getElementById("inp").value;

        if (isFloat(parseFloat(temp))) {
            accumulator_value += parseFloat(temp);
        }
        else if (isInt(parseInt(temp))) {
            accumulator_value += parseInt(temp);
        }
    }
    else if (e === "M-") {
        let temp = document.getElementById("inp").value;

        if (isFloat(parseFloat(temp))) {
            accumulator_value -= parseFloat(temp);
        }
        else if (isInt(parseInt(temp))) {
            accumulator_value -= parseInt(temp);
        }
    }
    else {
        appendToInp(e)
    }
}

//utility function to tokanize inputs properly
function evalFunctionUtil(inp) {
    let temp = inp.split(/\*|\-|\+|\/|\(|\)|\^|\||\%/);

    const tokens = [];
    for (let i in temp) {
        if (temp[i] != " ") {
            tokens.push(temp[i]);
        }
    }

    for (let i = 0; i < inp.length; i++) {
        if (isOperator(inp[i])) {
            operators.push(inp[i]);
        }

    }

    let i = 0;

    for (i = 0; i < operators.length; i++) {
        if (tokens[i] !== '') {
            final = final + tokens[i] + " " + operators[i] + " ";

        } else {
            final = final + operators[i] + " ";
        }
    }
    final = final + tokens[tokens.length - 1];


    document.getElementById("inp").value = evaluate(final);


}


function inputData(val) {
    inp = val;
}

//main function to evaluate expression
function evaluate(expression) {

    if (expression == "") {

        return "";
    }
    let tokens = expression.split(' ');

    let values = [];


    let ops = [];

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] == ' ') {
            continue;
        }


        //log function
        if (tokens[i] == "log") {
            i++;
            let temp = "";
            if (tokens[i] == "(") {
                i++;
                while (tokens[i] != ")") {
                    temp += tokens[i] + " ";
                    i++;
                }
            }
            values.push(Math.log10(evaluate(temp)));
            continue;
        }

        //ln function

        if (tokens[i] == "ln") {
            i++;
            let temp = "";
            if (tokens[i] == "(") {
                i++;
                while (tokens[i] != ")") {
                    temp += tokens[i] + " ";
                    i++;
                }
            }
            values.push(Math.log(evaluate(temp)));
            continue;
        }

        //modulo function

        if (tokens[i] == "|") {
            i++;
            let temp = "";
            while (tokens[i] != "|") {
                temp = temp + tokens[i] + " ";
                i++;
            }
            values.push(Math.abs(evaluate(temp)));
            continue;
        }

        //exponantial function

        if (tokens[i] == "exp") {
            i++;
            let temp = "";
            if (tokens[i] == "(") {
                i++;
                while (tokens[i] != ")") {
                    temp += tokens[i] + " ";
                    i++;
                }
            }
            values.push(Math.exp(evaluate(temp)));
            continue;
        }


        //checking if pi and e are there
        if (tokens[i] == "π") {
            values.push(parseFloat(Math.PI));
            continue
        }
        if (tokens[i] == "e") {
            values.push(parseFloat(Math.E));
            continue;
        }


        //factorial evluation
        if (tokens[i][tokens[i].length - 1] == "!") {
            console.log("fact");

            let num = parseInt(tokens[i].substring(0, tokens[i].length - 1));
            values.push(factorial(num));
            continue;
        }


        if (isFloat(parseFloat(tokens[i]))) {
            values.push(parseFloat(tokens[i]));

        }
        else if (isInt(parseInt(tokens[i]))) {

            values.push(parseInt(tokens[i]));

        }

        else if (tokens[i] == '(') {
            ops.push(tokens[i]);
        }


        else if (tokens[i] == ')') {
            while (ops[ops.length - 1] != '(') {
                values.push(applyOp(ops.pop(),
                    values.pop(),
                    values.pop()));
            }
            ops.pop();
        }

        else if (tokens[i] == '+' ||
            tokens[i] == '-' ||
            tokens[i] == '*' ||
            tokens[i] == '/' ||
            tokens[i] == '^' ||
            tokens[i] == '%') {


            while (ops.length > 0 &&
                hasPrecedence(tokens[i],
                    ops[ops.length - 1])) {
                values.push(applyOp(ops.pop(),
                    values.pop(),
                    values.pop()));
            }

            ops.push(tokens[i]);
        }
    }


    while (ops.length > 0) {
        values.push(applyOp(ops.pop(),
            values.pop(),
            values.pop()));
    }

    return values.pop();
}

//checking precedence of operators

function hasPrecedence(op1, op2) {
    if (op2 == '(' || op2 == ')') {
        return false;
    }
    if (op1 == '^' && (op2 == '*' || op2 == '/' || op2 == '+' || op2 == '-')) {
        return false;
    }
    else if ((op1 == '*' || op1 == '/') &&
        (op2 == '+' || op2 == '-')) {
        return false;
    }
    else {
        return true;
    }
}


function applyOp(op, b, a) {
    // console.log(op, a, b);

    switch (op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '%':
            return a % b;
        case '^':
            return Math.pow(a, b);
        case '/':
            if (b == 0) {
                document.write("DIVIDE BY ZERO");
            }
            return parseFloat(a / b, 3);
    }
    return 0;
}


//checking if number is int or float
function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}

//function for factorial input

function factorial(inp) {
    let ans = 1;
    // console.log();
    for (let i = 1; i <= inp; i++) {
        ans = ans * i;
    }
    return ans;
}


//this function restricts the input to limited characters
var ASCII = [33, 37, 40, 41, 42, 43, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 94];
function checkInput(event) {

    let ASCII_temp = (event.which) ? event.which : event.keyCode;
    for (let i = 0; i < ASCII.length; i++) {
        if (ASCII[i] == ASCII_temp) {
            return true;
        }
    }
    console.log(ASCII_temp);

    return false;
}


//function to check wheather the enter key is pressed
document.onkeypress = function (e) {
    // console.log(inp,e);
    if (e.key == "Enter") {

        inp = document.getElementById("inp").value;
        console.log(inp);
        processData("=");
    }
};