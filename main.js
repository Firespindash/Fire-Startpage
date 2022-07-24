const button = document.getElementById('icon');
const sideMenu = document.getElementById('side-menu');
const clock = document.getElementById('clock');
const date = document.getElementById('date');
const weather = document.getElementById('weather');
const checkbox = document.getElementById('check');
const editBtn = document.getElementById('edit-mode');
const dialog = document.getElementById('dialog');
const inputBg = document.getElementById('input-bg');
const inputSearch = document.getElementById('input-search');
const inputName = document.getElementById('input-name');
const searchIcon = document.getElementById('search-icon');
const lineEffect = document.getElementById('line');
const inputImage = document.getElementById('input-image');
const okBtn = document.getElementById('ok-btn');
const fileName = document.getElementById('file-name');
const imageSelector = document.getElementById('image-selector');
const imageFrame = document.getElementById('bg-info');
const menu = document.getElementById('grid');
const menuBg = document.getElementById('menu');
const colInput = document.getElementById('col-input');
const rowInput = document.getElementById('row-input');
var interval, weatherInt, imgURL;
var rowsNumber = localStorage.getItem('rowInfo') == null ? 4 : Number(localStorage.getItem('rowInfo'));
var colsNumber = localStorage.getItem('colInfo') == null ? 4 : Number(localStorage.getItem('colInfo'));

const loadContent = () => {
    let list = JSON.parse(localStorage.getItem('apps')).items;
    let j = 1;
    for (let i = 0; i < list.length; i += 2) {
        var link = 'itemLink'.concat(j);
        var img = 'itemImg'.concat(j);
        var el = document.createElement('div');
        el.setAttribute('class', 'item');
        el.innerHTML =
            '<a href="' + list[i][link] +
            '"><img src="' + list[i + 1][img] + '"></a>';
        menu.appendChild(el);
        j++;
    }
};

const clearMenu = () => {
    while (menu.hasChildNodes()) {
        menu.removeChild(menu.firstChild);
    }
};

const lastNumber = (arr) => Number(JSON.stringify(arr[arr.length - 1]).match(/\d+/)[0]);

const checkInput = (value) => {
    let name = value;
    let httpMatch = name.match(/http\:/);
    let httpsMatch = name.match(/https\:/);
    let pointMatch = name.match(/\./);
    let hMatch = httpMatch == null ? false : true;
    let hsMatch = httpsMatch == null ? false : true;
    let pMatch = pointMatch == null ? false : true;
    if (hMatch || hsMatch) {
        if (pMatch) {
            name = name;
        }
        else {
            name += '.com';
        }
    }
    else if (pMatch) {
        name = 'https://' + name;
    }
    else {
        name = 'https://' + name + '.com';
    }
    return name;
};

const gridLength = (linetype) =>
    window
        .getComputedStyle(menu)
        .getPropertyValue('grid-template-' + linetype)
        .split('px').length - 1;

const checkGrid = () => {
    if (localStorage.getItem('rowInfo') != gridLength('rows')) {
        localStorage.setItem('rowInfo', gridLength('rows'));
        rowInput.value = localStorage.getItem('rowInfo');
    }
    if (localStorage.getItem('colInfo') != gridLength('columns'))
        localStorage.setItem('colInfo', gridLength('columns'));
};

const reload = () => {
    clearMenu();
    loadContent();
    addButtons();
};

const deploy = (arr) => {
    localStorage.removeItem('apps');
    localStorage.setItem('apps', arr);
};

const addElement = (linkpath, imgpath) => {
    let arr = JSON.parse(localStorage.getItem('apps')).items;
    let linkname = 'itemLink'.concat(lastNumber(arr) + 1);
    let imgname = 'itemImg'.concat(lastNumber(arr) + 1);
    arr.push({[linkname]: linkpath});
    arr.push({[imgname]: imgpath});
    let newArr = '{"items":' + JSON.stringify(arr) + '}';
    deploy(newArr);
    reload();
    checkGrid();
};

inputImage.addEventListener('change', function (e) {
    let file = e.target.files[0];
    fileName.innerText = file.name;
    let readImage = new FileReader();
    readImage.addEventListener('load', function (e) {
        imgURL = e.target.result;
    });
    readImage.readAsDataURL(file);
});

const addButton = () => {
    if (!document.getElementById('add')) {
        let btn = document.createElement('div');
        btn.setAttribute('class', 'item');
        btn.setAttribute('id', 'add');
        btn.setAttribute('onclick', 'showDialog("add", null)');
        btn.innerHTML = '<img src="add-btn.png">';
        menu.appendChild(btn);
    }
};

const addRMB = () => {
    let items = document.getElementsByClassName('item');
    for (let i = 0; i < items.length - 1; i++) {
        let removeBtn = document.createElement('div');
        removeBtn.setAttribute('class', 'remove-btn');
        removeBtn.setAttribute('onclick', 'removeItem(' + (i + 1) + ')');
        removeBtn.innerHTML = '<img src="remove.png">';
        items[i].appendChild(removeBtn);
    }
};

const editItem = (itemNumber, linkpath, imgpath) => {
    let arr = JSON.parse(localStorage.getItem('apps')).items;
    let newArr = [];
    for (let i = 1; i <= arr.length; i++) {
        if (i == itemNumber) {
            let linkname = 'itemLink'.concat(i);
            let imgname = 'itemImg'.concat(i);
            newArr.push({[linkname]: linkpath});
            newArr.push({[imgname]: imgpath});
            i++;
        }
        else {
            newArr.push(arr[i - 1]);
        }
    }
    let completeArr = '{"items":' + JSON.stringify(newArr) + '}';
    deploy(completeArr);
    reload();
};

const addEDB = () => {
    let items = document.getElementsByClassName('item');
    for (let i = 0; i < items.length - 1; i++) {
        let editButtons = document.createElement('div');
        editButtons.setAttribute('class', 'edit-btn');
        editButtons.setAttribute('onclick', 'showDialog("edit", ' + (i + 1) + ')');
        editButtons.innerHTML = '<img src="edit.png">';
        items[i].appendChild(editButtons);
    }
};

const addButtons = () => {
    addButton();
    addRMB();
    addEDB();
};

const addWrapper = () => {
    if (inputName.value) {
        let link = checkInput(inputName.value);
        let img = fileName.innerText ? imgURL : 'question-mark.png';
        closeDialog();
        addElement(link, img);
    }
    else {
        inputName.focus();
        // console.log("Error: Please input a link or website name.");
    }
};

const editWrapper = (itemNumber) => {
    if (inputName.value) {
        let link = checkInput(inputName.value);
        let img = fileName.innerText ? imgURL : 'question-mark.png';
        closeDialog();
        editItem(itemNumber, link, img);
    }
    else {
        inputName.focus();
        // console.log("Error: Please input a link or website name.");
    }
};

const closeDialog = () => {
    dialog.style.display = 'none';
    inputName.value = '';
    fileName.innerText = '';
};

const showDialog = (option, itemNumber) => {
    if (option == 'add') {
        okBtn.setAttribute('onclick', 'addWrapper()');
    }
    else if (option == 'edit') {
        okBtn.setAttribute('onclick', 'editWrapper(' + itemNumber + ')');
    }
    dialog.style.display = 'block';
};

const removeButton = () => {
    menu.removeChild(menu.lastChild);
};

const regen = (arr) => {
    let newArr = [];
    let j = 0;
    let num = 1;
    for (let i = 1; i < arr.length; i += 2) {
        let linkname = 'itemLink'.concat(num);
        let imgname = 'itemImg'.concat(num);
        j++;
        num++;
        if (!arr[i - 1]['itemLink'.concat(j)]) j++;
        let link = arr[i - 1]['itemLink'.concat(j)];
        let img = arr[i]['itemImg'.concat(j)];
        newArr.push({[linkname]: link});
        newArr.push({[imgname]: img});
    }
    let completeArr = '{"items":' + JSON.stringify(newArr) + '}';
    deploy(completeArr);
    reload();
    checkGrid();
};

const removeItem = (itemNumber) => {
    let arr = JSON.parse(localStorage.getItem('apps')).items;
    let num = itemNumber * 2;
    arr.splice(num - 2, 2);
    regen(arr);
};

window.onload = function () {
    if (localStorage.getItem('first') == null) {
        localStorage.setItem('first', 'no');
        let obj =
            '{ \
				"items": [ \
				  { "itemLink1": "https://mail.google.com/mail/u/0/#inbox" }, \
				  { "itemImg1": "gmail.png" }, \
				  { "itemLink2": "https://flathub.org/home" }, \
				  { "itemImg2": "flathub.png" }, \
  				  { "itemLink3": "https://en.wikipedia.org/wiki/The_Adventures_of_Tintin:_The_Secret_of_the_Unicorn_(video_game)" }, \
				  { "itemImg3": "wikipedia.png" }, \
  				  { "itemLink4": "https://github.com" }, \
				  { "itemImg4": "github.png" }, \
  				  { "itemLink5": "https://fonts.google.com/specimen/Comfortaa?selection.family=Comfortaa&sidebar.open" }, \
				  { "itemImg5": "google-fonts.png" }, \
  				  { "itemLink6": "https://www.colorhexa.com" }, \
				  { "itemImg6": "colorhexa.png" }, \
  				  { "itemLink7": "https://coolbackgrounds.io/black-background/" }, \
				  { "itemImg7": "cool-backgrounds.png" }, \
  				  { "itemLink8": "https://www.reddit.com/" }, \
				  { "itemImg8": "reddit.png" }, \
  				  { "itemLink9": "https://terminalroot.com.br/" }, \
				  { "itemImg9": "terminalroot.png" }, \
  				  { "itemLink10": "https://www.onesearch.com/" }, \
				  { "itemImg10": "onesearch.png" }, \
  				  { "itemLink11": "https://docs.invidious.io/instances/" }, \
				  { "itemImg11": "invidious.svg" }, \
  				  { "itemLink12": "https://www.w3schools.com/" }, \
				  { "itemImg12": "w3schools.png" }, \
				  { "itemLink13": "https://deno.land/" }, \
				  { "itemImg13": "deno.svg" } \
			    ] \
			  }';
        localStorage.setItem('apps', obj);
    }
    loadContent();
    dark = checkbox.checked ? '-dark' : '';
    if (checkbox.checked) {
        button.src = 'toggle-dark.png';
    }
    else {
        button.src = 'toggle.png';
    }
    if (localStorage.getItem('bgInfo') == null) {
        document.body.style.backgroundImage = 'url(bg.png)';
    }
    else {
        document.body.style.backgroundImage =
            'url(' + localStorage.getItem('bgInfo') + ')';
        imageFrame.src = localStorage.getItem('bgInfo');
    }
    menu.style.gridTemplateRows = 'repeat(' + rowsNumber + ', 64.7px)';
    menu.style.gridTemplateColumns = 'repeat(' + colsNumber + ', 64.7px)';
};

button.addEventListener('click', function () {
    if (sideMenu.style.right == '0%') {
        switchTheme();
        sideMenu.style.right = '-120%';
        dark = sideMenu.style.color == 'rgb(0, 0, 0)' ? '-dark' : '';
        button.src = 'toggle' + dark + '.png';
        clearInterval(interval);
        clearInterval(weatherInt);
    }
    else {
        switchTheme();
        update();
        interval = setInterval(update, 1000);
        weatherInt = setInterval(updateWeather, 10000);
        updateWeather();
        sideMenu.style.right = '0%';
        dark = sideMenu.style.color == 'rgb(0, 0, 0)' ? '-dark' : '';
        button.src = 'toggle-close' + dark + '.png';
        colInput.value = colsNumber ? colsNumber : 4;
        rowInput.value = rowsNumber ? rowsNumber : 4;
    }
});

imageSelector.addEventListener('change', function (event) {
    let file = event.target.files[0];
    if (file.type && file.type.indexOf('image') === -1) {
        return;
    }
    else {
        let readImage = new FileReader();
        readImage.addEventListener('load', function (event) {
            document.body.style.backgroundImage =
                'url(' + event.target.result + ')';
            imageFrame.src = event.target.result;
            localStorage.setItem('bgInfo', event.target.result);
        });
        readImage.readAsDataURL(file);
    }
});

const detectAdd = () => (document.getElementById('add') ? true : false);

const switchTheme = () => {
    if (checkbox.checked == true) {
        sideMenu.style.color = '#000';
        button.src = 'toggle-close-dark.png';
        dialog.style.color = '#000';
        dialog.style.borderColor = '#000';
        inputName.style.color = '#000';
        inputName.style.borderColor = '#000';
        fileName.style.color = '#000';
        searchIcon.src = 'magnifier-dark.png';
        lineEffect.style.borderColor = '#000';
        if (detectAdd())
            document.getElementById('add').style.filter = 'invert(1)';
    }
    else {
        sideMenu.style.color = '#fff';
        button.src = 'toggle-close.png';
        dialog.style.color = '#fff';
        dialog.style.borderColor = '#fff';
        inputName.style.color = '#fff';
        inputName.style.borderColor = '#fff';
        fileName.style.color = '#fff';
        searchIcon.src = 'magnifier.png';
        lineEffect.style.borderColor = '#fff';
        if (detectAdd())
            document.getElementById('add').style.filter = 'invert(0)';
    }
};

const clearBg = () => {
    document.body.style.backgroundImage = "url('bg.png')";
    localStorage.removeItem('bgInfo');
    imageFrame.src = 'bg.png';
};

const addCol = () => {
    if (Number(localStorage.getItem('colInfo')) < 25) {
        colsNumber += 1;
        menu.style.gridTemplateColumns = 'repeat(' + colsNumber + ', 64.7px)';
        localStorage.setItem('colInfo', colsNumber);
        colInput.value = colsNumber;
    }
};

const updateRow = () => {
    if (localStorage.getItem('rowInfo') != gridLength('rows'))
        localStorage.setItem('rowInfo', gridLength('rows'));
    rowInput.value = localStorage.getItem('rowInfo');
};

const removeCol = () => {
    if (Number(localStorage.getItem('colInfo')) > 4) {
        colsNumber -= 1;
        menu.style.gridTemplateColumns = 'repeat(' + colsNumber + ', 64.7px)';
        localStorage.setItem('colInfo', colsNumber);
        colInput.value = colsNumber;
        updateRow();
    }
};

const addRow = () => {
    if (Number(localStorage.getItem('rowInfo')) < 25) {
        rowsNumber += 1;
        menu.style.gridTemplateRows = 'repeat(' + rowsNumber + ', 64.7px)';
        updateRow();
    }
};

const appsItems = () => JSON.parse(localStorage.getItem('apps')).items.length / 2;

const gridSize = () => localStorage.getItem('rowInfo') * localStorage.getItem('colInfo');

const proportion = () => appsItems() / gridSize();

const removeRow = () => {
    if (Number(localStorage.getItem('rowInfo')) > 4) {
        let ratio = proportion();
        let lastEmpty = (gridSize() - localStorage.getItem('colInfo')) / gridSize();
        if (ratio <= lastEmpty) {
            rowsNumber -= 1;
            menu.style.gridTemplateRows = 'repeat(' + rowsNumber + ', 64.7px)';
            updateRow();
        }
    }
};

const removeRMB = () => {
    let btnList = document.getElementsByClassName('remove-btn');
    while (btnList.length > 0) {
        btnList[0].remove();
    }
    updateRow();
};

const removeEDB = () => {
    let btnList = document.getElementsByClassName('edit-btn');
    while (btnList.length > 0) {
        btnList[0].remove();
    }
};

const removeButtons = () => {
    removeButton();
    removeRMB();
    removeEDB();
};

const editMode = () => {
    if (detectAdd()) {
        removeButtons();
        editBtn.style.color = '#4c4c4c';
        editBtn.style.borderColor = '#4c4c4c';
        if (document.getElementById('dialog')) closeDialog();
    }
    else {
        addButtons();
        editBtn.style.color = '#4cfa4c';
        editBtn.style.borderColor = '#4cfa4c';
    }
};

const clearConfigs = () => {
    localStorage.clear();
    menu.style.gridTemplateColumns = 'repeat(4, 64.7px)';
    menu.style.gridTemplateRows = 'repeat(4, 64.7px)';
    menuBg.style.marginTop = '-178.4px';
    menuBg.style.marginLeft = '-202.4px';
    checkbox.checked = false;
    switchTheme();
    clearBg();
    colInput.value = 4;
    rowInput.value = 4;
    location.reload();
};

const addZero = (n) => (parseInt(n, 10) < 10 ? '0' : '') + n;

const update = () => {
    getTime();
    getDate();
};

const getTime = () => {
    time = new Date();
    hour = time.getHours();
    min = time.getMinutes();
    sec = time.getSeconds();
    clock.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
};

const getDate = () => {
    calendar = new Date();
    timestamp =
        ('0' + calendar.getDate()).slice(-2) +
        '/' +
        ('0' + (calendar.getMonth() + 1)).slice(-2) +
        '/' +
        calendar.getFullYear();
    date.innerHTML = `${timestamp}`;
};

const updateWeather = () => {
    weather.src = 'http://wttr.in/_t.png?format=3';
};
