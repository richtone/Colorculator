var r = 10000;
var	lastOp = null;
var	result = 0;
var line = "0";
var lineTemp = 0;
var chain = "";
var state = 0; // 0 = start, 1 = after number, 2 = after operation, 3 = after enter

function displayWrite() {
	if(line.length>0) { // ak je v "line" zadané číslo
		$(".mainLine").html(line);
		$(".chainLine").html(chain);
	}
	else {
		$(".mainLine").html("0");		
		$(".chainLine").html("");
	}
	
	setColor();	
}
function lineInput(num) {
	
		switch(state) {
		case 0: state0(); break;
		case 1: state1(); break;	// bolo stlačené číslo	
		case 2: state2(); break;	// bola stlačená operácia
		case 3: state3(); break;	// bol sltačený enter
		default: break;
	}
	
	function state0() {
		line = num;
	}	
	function state1() {
		if(line.length<15) line += num;
	}	
	function state2() {
		//lineTemp += parseFloat(num);
		console.log(line, lineTemp, parseFloat(line))		
		line = num;
	}
	function state3() {
		chain = "";
		line = "0";
		result = 0;
	}
	console.log(line, result);
	
	state = 1;
	displayWrite();
}
function writeDecimalPoint() {	
	if (state == 1) {
		if(line.length<13 && !line.includes(".")) line += ".";
	} else {
		line = "0.";
		state = 1;
	}
	displayWrite();
}
function clearInput() { // vynulovanie
	lastOp = null;
	result = 0;
	line = "0";
	chain = "";
	state = 0;
	lineTemp = 0;
	displayWrite();
}
function backspace() { // zmazanie posledného čísla
	line = line.slice(0, -1);
	displayWrite();
}
function plusminus() {
	if (line === "") line = (-1*result).toString(); // z dôvodu, že po operácii sa line vyprázdňuje
	else line = (-1*parseFloat(line)).toString();
	displayWrite();
}
function sum() {
	console.log("sum start", result, line, chain);
	var lineNum = parseFloat(line);
	
	switch(state) {
		case 0: return; break;		// ukončíme returnom
		case 1: state1(); break;	// stlačené číslo	
		case 2: state2(); break;	// ak bola stlačená operácia
		case 3: state3(); break;	// ak bol stlačený enter
		default: break;
	}
	
	function state1() {
		lineTemp = lineNum;
		
		if(lastOp !== null) { // ak bola zadaná operácia
			switch(lastOp) {
				case "+": result += lineNum; break;
				case "-": result -= lineNum; break;
				case "/": result = Math.round((result/lineNum)*r)/r; break;
				case "*": result *= lineNum;	break;
			}
			chain += " " + line;
			line = result.toString();		
		}
	}		
	function state2() {
		switch(lastOp) {
			case "+": result += lineNum; break;
			case "-": result -= lineNum; break;
			case "/": result = Math.round((result/lineNum)*r)/r; break;
			case "*": result *= lineNum;	break;
		}
		chain = chain.slice(0,-2) + lastOp + " " + lineNum + "   ";
		line = result.toString();
	}
	function state3() {
		switch(lastOp) {
			case "+": result += lineTemp; break;
			case "-": result -= lineTemp; break;
			case "/": result = Math.round((result/lineTemp)*r)/r; break;
			case "*": result *= lineTemp;	break;
			default: return;
		}		
		chain += " " + lastOp + " " + lineTemp;
		line = result.toString();
	}
	
	state = 3;
	displayWrite();
	console.log("sum end",result, line, chain);	
}

function calc(getOp) {
	if(state === 0) return 0; // zrušíme ak je stav 0
	var lineNum = parseFloat(line);	
	console.log("calc start", result, line, chain, lastOp);	
	
	if(state === 3) { // ak bol sltačený enter
		chain = line;
		lastOp = null;
	}
	
	if(lastOp === null)  { // bez predchádzajúcej operácie
		result = lineNum; // uložíme si vložené číslo
		chain = line + " " + getOp  + " ";
	} else {
		switch(lastOp) {
			case "+": result += lineNum; break;
			case "-": result -= lineNum; break;
			case "/": result = Math.round((result/lineNum)*r)/r; break;
			case "*": result *= lineNum;	break;
		}
		chain += " " + line + " " + getOp + " ";
		line = result.toString();
	}
	
	lastOp = getOp;
	state = 2;
	displayWrite();	
	console.log("calc end",result, line, chain);	
}

$(".operation").click(function(event) {
	calc($(this).html());
});
$(".num").click(function(event) {
	lineInput($(this).html());
});
$("#Enter").click(sum);
$("#Backspace").click(backspace);
$("#Delete").click(clearInput);
$("#PlusMinus").click(plusminus);
$("#Point").click(writeDecimalPoint);

$(document).keydown(function(event) {
	console.log(event.key);
	switch(event.key) {
		case "/": calc("/"); break;
		case "*": calc("*"); break;
		case "-": calc("-"); break;
		case "+": calc("+"); break;
		case "": plusminus(); break;
		case "=": sum(); break;
		case ".":
		case ",":
			writeDecimalPoint();
			break;
		default: 	$("#"+event.key.toString()).click(); break;
	}
});

function setColor() { // pomocná funkcia pre displayWrite
	
	if(line == "0") color = "white";
	else if(line.length < 2) {		
			switch (line) {
				case "0": color = "rgb(204, 153, 255)"; break;
				case "1": color = "rgb(153, 204, 255)"; break;
				case "2": color = "rgb(102, 204, 255)"; break;
				case "3": color = "rgb(102, 255, 255)"; break;
				case "4": color = "rgb(153, 255, 204)"; break;
				case "5": color = "rgb(153, 255, 153)"; break;
				case "6": color = "rgb(204, 255, 153)"; break;
				case "7": color = "rgb(255, 255, 153)"; break;
				case "8": color = "rgb(255, 204, 153)"; break;
				case "9": color = "rgb(255, 153, 153)"; break;
			}
	}	else {
		color = "linear-gradient(to right";
		for(var i = 0; i < line.length; i++) {
			//console.log(i, line.split(""), line.split("")[i]);
			color += ",";
			switch (line.split("")[i]) {
				case "0": color += "rgb(204, 153, 255)"; break;
				case "1": color += "rgb(153, 204, 255)"; break;
				case "2": color += "rgb(102, 204, 255)"; break;
				case "3": color += "rgb(102, 255, 255)"; break;
				case "4": color += "rgb(153, 255, 204)"; break;
				case "5": color += "rgb(153, 255, 153)"; break;
				case "6": color += "rgb(204, 255, 153)"; break;
				case "7": color += "rgb(255, 255, 153)"; break;
				case "8": color += "rgb(255, 204, 153)"; break;
				case "9": color += "rgb(255, 153, 153)"; break;
				case ".": color = color.slice(0,-1); break; // zrušiť vloženú čiarku
			}
		}
		color += ")";
	}
	
	//$(".calc").addClass("trans");
	$("body").css("background", color);
	//$(".calc").removeClass("trans");
}