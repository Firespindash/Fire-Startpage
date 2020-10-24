const button = document.getElementById('icon');
const sideMenu = document.getElementById('side-menu');
const clock = document.getElementById('clock');
const date = document.getElementById('date');
const weather = document.getElementById('weather');
const checkbox = document.getElementById('check');
const imageSelector = document.getElementById('image-selector');
const imageFrame = document.getElementById('bg-info');
const menu = document.getElementById('grid');
const menuBg = document.getElementById('menu');
const colInput = document.getElementById('col-input');
const rowInput = document.getElementById('row-input');
var interval;
var rowsNumber = localStorage.getItem("rowInfo") == null ? 4 : Number(localStorage.getItem("rowInfo"));
var colsNumber = localStorage.getItem("colInfo") == null ? 4 : Number(localStorage.getItem("colInfo"));
var verticalAlign = localStorage.getItem("vAlign") == null ? -178.4 : Number(localStorage.getItem("vAlign"));
var horizontalAlign = localStorage.getItem("hAlign") == null ? -202.4 : Number(localStorage.getItem("hAlign"));

window.onload = function(){
	dark = checkbox.checked ? "-dark" : "";
	checkbox.checked ? button.src="toggle-dark.png" : button.src="toggle.png";
  if (localStorage.getItem("bgInfo") == null) { document.body.style.backgroundImage = "url(bg.png)"; }
   else { document.body.style.backgroundImage = "url(" + localStorage.getItem("bgInfo") + ")"; imageFrame.src = localStorage.getItem("bgInfo"); }
  menu.style.gridTemplateRows = "repeat(" + rowsNumber + ", 64.7px)";
  menu.style.gridTemplateColumns = "repeat(" + colsNumber + ", 64.7px)";
	menuBg.style.marginTop = "" + verticalAlign + "px";
  menuBg.style.marginLeft = "" + horizontalAlign + "px";
}

button.addEventListener('click', function(){
	if (sideMenu.style.right == "0%") {
		switchTheme();
    sideMenu.style.right = "-120%";
    document.getElementById('blur-wall').style.right = "-120%";
    dark = sideMenu.style.color == "rgb(0, 0, 0)" ? "-dark" : "";
    button.src = "toggle"+dark+".png";
    clearInterval(interval);
  }
  else {
   	switchTheme();
   	update(); interval = setInterval(update, 1000);
   	sideMenu.style.right = "0%";
   	document.getElementById('blur-wall').style.right = "0%";
   	dark = sideMenu.style.color == "rgb(0, 0, 0)" ? "-dark" : "";
   	button.src = "toggle-close"+dark+".png";
  }
});

imageSelector.addEventListener('change', function(event){
	const file = event.target.files[0];
  if (file.type && file.type.indexOf('image') === -1) {
  	return;
  }
  else {
    const readImage = new FileReader();
    readImage.addEventListener('load', function(event){
  		document.body.style.backgroundImage = "url(" + event.target.result + ")";
    	imageFrame.src = event.target.result;
    	localStorage.setItem("bgInfo", event.target.result);
		});
    readImage.readAsDataURL(file);
  }
});

const switchTheme = () => { if ( checkbox.checked == true ) { sideMenu.style.color = "#000"; button.src = "toggle-close-dark.png"; }
 else { sideMenu.style.color = "#fff"; button.src = "toggle-close.png"; }}

const clearBg = () => { document.body.style.backgroundImage = "url('bg.png')"; localStorage.removeItem("bgInfo"); imageFrame.src = "bg.png"; }

const addCol = () => {
	if (Number(localStorage.getItem("colInfo")) < 25) {
		colsNumber+=1; menu.style.gridTemplateColumns = "repeat(" + colsNumber + ", 64.7px)"; localStorage.setItem("colInfo", colsNumber);
    horizontalAlign -= 43.3;
    menuBg.style.marginLeft = "" + horizontalAlign + "px"; localStorage.setItem("hAlign", horizontalAlign);
    colInput.value = colsNumber;
  }
}

const removeCol = () => {
	if (Number(localStorage.getItem("colInfo")) > 4) {
    colsNumber-=1; menu.style.gridTemplateColumns = "repeat(" + colsNumber + ", 64.7px)"; localStorage.setItem("colInfo", colsNumber);
    horizontalAlign += 43.3;
    menuBg.style.marginLeft = "" + horizontalAlign + "px"; localStorage.setItem("hAlign", horizontalAlign);
    colInput.value = colsNumber;
	}
}

const addRow = () => {
	if (Number(localStorage.getItem("rowInfo")) < 25) {
  	rowsNumber+=1; menu.style.gridTemplateRows = "repeat(" + rowsNumber + ", 64.7px)"; localStorage.setItem("rowInfo", rowsNumber);
    verticalAlign -= 35.5;
    menuBg.style.marginTop = "" + verticalAlign + "px"; localStorage.setItem("vAlign", verticalAlign);
    rowInput.value = rowsNumber;
  }
}

const removeRow = () => {
	if (Number(localStorage.getItem("rowInfo")) > 4) {
  	rowsNumber-=1; menu.style.gridTemplateRows = "repeat(" + rowsNumber + ", 64.7px)"; localStorage.setItem("rowInfo", rowsNumber);
    verticalAlign += 35.5;
    menuBg.style.marginTop = "" + verticalAlign + "px"; localStorage.setItem("vAlign", verticalAlign);
    rowInput.value = rowsNumber;
	}
}

const clearConfigs = () => {
	localStorage.removeItem("rowInfo"); localStorage.removeItem("colInfo"); localStorage.removeItem("vAlign"); localStorage.removeItem("hAlign");
  menu.style.gridTemplateColumns = "repeat(4, 64.7px)"; menu.style.gridTemplateRows = "repeat(4, 64.7px)"; menuBg.style.marginTop = "-178.4px"; menuBg.style.marginLeft = "-202.4px";
  checkbox.checked = false; switchTheme(); clearBg(); colInput.value = 4; rowInput.value = 4; location.reload();
}

const addZero = (n) => (parseInt(n, 10) < 10 ? '0' : '') + n;

const update = () => { getTime(); getDate(); updateWeather(); }

const getTime = () => { time = new Date(); hour = time.getHours(); min = time.getMinutes(); sec = time.getSeconds();
	clock.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`; }

const getDate = () => { calendar = new Date(); timestamp = ("0"+calendar.getDate()).slice(-2) + '/' + ("0"+(calendar.getMonth()+1)).slice(-2) + '/' + calendar.getFullYear();
	date.innerHTML = `${timestamp}`; }

const updateWeather = () => weather.src = "http://wttr.in/_t.png?format=3";
