var player = document.querySelector('#player');
var box = document.querySelector('#box');
var logEl = document.querySelector('#log');
var currentCell = 312;
var facing = 'up';
var ammo = 100;
var health = 10;
var maxHealth = 10;
var steps = 0;
var energy = 15;
var ammoUsed = 0;
var name = 'Default Noob';
var lootArray = [];
var food = 10;
var maxEnergy = 15;
var foodEl = document.querySelector('#food');
var lootEl = document.querySelector('#loot');
var nameEl = document.querySelector('#name');
var ammoEl = document.querySelector('#ammo');
var healthEl = document.querySelector('#health');
var energyEl = document.querySelector('#energy')
var ammoUsedEl = document.querySelector('#ammo-used');
var stepsEl = document.querySelector('#steps-taken');
var generatedMap;
var ammoTakes = document.querySelector('#ammotakes');
var foodTakes = document.querySelector('#foodtakes');
var lootAmmo = document.querySelector('#lootammonum');
var lootFood = document.querySelector('#lootfoodnum');
var lootAmmoWrap = document.querySelector('#lootammo');
var lootFoodWrap = document.querySelector('#lootfood');
var fightingMode = false;
var saveBoxHTML;
var playerFightingOrigin;

var takeF = function (item, amount) {
    if (item == 'ammo') {
        if (amount == 'all') {
            ammo += lootArray[currentCell].ammo;
            lootArray[currentCell].ammo = 0;
        } else {
            lootArray[currentCell].ammo--;
            ammo++;
        }
    }
    if (item == 'food') {
        if (amount == 'all') {
            food += lootArray[currentCell].food;
            lootArray[currentCell].food = 0;
        } else {
            lootArray[currentCell].food--;
            food++;
        }
    }
    ammoEl.innerHTML = 'Ammo: ' + ammo;
    foodEl.innerHTML = 'Food: ' + food + ' [E to eat]';
    lootAmmo.innerHTML = lootArray[currentCell].ammo;
    lootFood.innerHTML = lootArray[currentCell].food;
    lootAmmoWrap.style.display = ((lootArray[currentCell].ammo == 0) ? 'none' : 'block');
    lootFoodWrap.style.display = ((lootArray[currentCell].food == 0) ? 'none' : 'block');
    setCookie('loot', JSON.stringify(lootArray));
    setCookie('food', food, 30);
    setCookie('ammo', ammo, 30);
};

function generateMap(length) {
    var text = '';
    var possible = "                                       ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,*****************'''''''''''''''''''CCCC";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        if (text.endsWith(',')) {
            possible = "                 ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,********''''''''''''''CCCC";
        }
        if (text.endsWith('*')) {
            possible = "           *********************************************************************,,,,,,,,,,''''''''CCCCCCC";
        }
        if (text.endsWith("'")) {
            possible = "              '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''',,,,,,,,,,,,,,,,*******CCCC";
        }
    }
    return text;
}
setCookie('maxhealth', maxHealth, 30);

if (getCookie('map') == "") {
    var generatedMap = generateMap(625);
} else {
    generatedMap = getCookie('map');
}
var mapHTML;
var textRows = generatedMap.match(/.{1,25}/g);
for (var j = 0; j < 25; j += 2) {
    textRows[j] = textRows[j].split('').reverse().join('');
}
mapHTML = '<td>' + textRows.join('').split('').join('</td><td>') + '</td>';
mapHTML = '<table><tr>' + mapHTML.match(/.{1,250}/g).join('</tr><tr>') + '</tr></table>';
setCookie('map', generatedMap, 100);

document.querySelectorAll('td').forEach(function (element, index) {
    element.id = 'c' + index;
});

setCookie('maxenergy', maxEnergy);

checkCookie();

function lootSpawn(chest) {
    this.ammo = Math.floor(Math.random() * 10);
    this.food = Math.floor(Math.random() * 5);
    if (chest) {
        this.ammo++;
        this.food++;
        this.ammo *= 3;
        this.food *= 3;
    }
    setCookie('loot', JSON.stringify(lootArray));
}

function move(direction) {
    if (fightingMode == false && energy >= 0.4) {
        if (direction == 'up') {
            currentCell = ((currentCell > 24) ? currentCell - 25 : currentCell);
            player.style.transform = 'rotate(0deg)';
        }
        if (direction == 'right') {
            currentCell = (((currentCell + 1) % 25 != 0) ? currentCell + 1 : currentCell);
            player.style.transform = 'rotate(90deg)';
        }
        if (direction == 'left') {
            currentCell = (((currentCell + 1) % 25 != 1) ? currentCell - 1 : currentCell);
            player.style.transform = 'rotate(270deg)';
        }
        if (direction == 'down') {
            currentCell = ((currentCell < 600) ? currentCell + 25 : currentCell);
            player.style.transform = 'rotate(180deg)';
        }
        player.style.top = document.querySelector('#c' + currentCell).getBoundingClientRect().y + 'px';
        player.style.left = document.querySelector('#c' + currentCell).getBoundingClientRect().x + 'px';
        facing = direction;
        steps++;
        stepsEl.innerHTML = 'Steps taken: ' + steps;
        setCookie('steps', steps, 30);
        energy -= 0.4;
        energyEl.innerHTML = 'Energy: ' + Math.round(energy) + '/' + maxEnergy;
        setCookie('energy', energy, 30);
        setCookie('maxenergy', maxEnergy, 30);
        if (lootArray[currentCell] == undefined)
            lootArray[currentCell] = new lootSpawn((document.querySelector('#c' + currentCell).innerHTML == 'C'));
        setCookie('loot', JSON.stringify(lootArray));
        lootAmmo.innerHTML = lootArray[currentCell].ammo;
        lootFood.innerHTML = lootArray[currentCell].food;
        lootAmmoWrap.style.display = ((lootArray[currentCell].ammo == 0) ? 'none' : 'block');
        lootFoodWrap.style.display = ((lootArray[currentCell].food == 0) ? 'none' : 'block');
        lootArray[currentCell].take = takeF;
        if (document.querySelector('#c' + currentCell).innerHTML == "'")
            document.querySelector('#loot-heading').innerHTML = "[']" + ' Plains';
        if (document.querySelector('#c' + currentCell).innerHTML == "*")
            document.querySelector('#loot-heading').innerHTML = "[*]" + ' Forest';
        if (document.querySelector('#c' + currentCell).innerHTML == ",")
            document.querySelector('#loot-heading').innerHTML = "[,]" + ' Swamp';
        if (document.querySelector('#c' + currentCell).innerHTML == "C")
            document.querySelector('#loot-heading').innerHTML = "[C]" + ' Chest';
        if (document.querySelector('#c' + currentCell).innerHTML == " ")
            document.querySelector('#loot-heading').innerHTML = "[ ]" + ' Empty';
        if (Math.random() >= 0.95) {
            if (fightingMode == false)
                saveBoxHTML = box.innerHTML;
            fightingMode = true;
            console.log('battle! clash! 🦆 vs 🐉. ');
            box.innerHTML = '';
            player.style.transform = 'rotate(0deg)';
            facing = 'up';
            player.style.left = 'calc(50% - 10px)';
            box.style.transform = 'scale(0.40)';
            box.style.borderWidth = '5px';
            player.style.top = box.offsetHeight - 140 + 'px';
        }
    } else if (fightingMode == true && energy >= 0.4) {
        if (direction == 'right') {
            player.style.left = player.getBoundingClientRect().x + 20 + 'px';
        }
        if (direction == 'left') {
            player.style.left = player.getBoundingClientRect().x - 20 + 'px';
        }
    } else {
        log("You have no energy! Get food fast!");
    }
}
document.body.onkeyup = function (e) {
    e.key=e.key.toLowerCase();
    if (document.activeElement != nameEl) {
        if (e.key=="w" || e.key=="arrowup") {
            move('up');
        }
        if (e.key == "d" || e.key == "arrowright") {
            move('right');
        }
        if (e.key == "a" || e.key=="arrowleft") {
            move('left');
        }
        if (e.key == "s" || e.key=="arrowdown") {
            move('down');
        }
        if (e.key == " ") {
            if (energy >= 0.2) {
                shoot(facing);
            } else {
                log("You have no energy! Get food fast!");
            }
        }
        if (e.key == "e") {
            eat(1);
        }
        if (fightingMode==true&&energy>=0.4) {
            if (e.key=="escape") {
                fightingMode=false;
            }
        }
    }
}
if (getCookie('map') == "") {
    var mapHTML;
    var textRows = generatedMap.match(/.{1,25}/g);
    for (var j = 0; j < 25; j += 2) {
        textRows[j] = textRows[j].split('').reverse().join('');
    }
    mapHTML = '<td>' + textRows.join('').split('').join('</td><td>') + '</td>';
    mapHTML = '<table><tr>' + mapHTML.match(/.{1,250}/g).join('</tr><tr>') + '</tr></table>';
    setCookie('map', generatedMap, 100);
} else {
    mapHTML = getCookie('map');
    mapHTML = '<td>' + textRows.join('').split('').join('</td><td>') + '</td>';
    mapHTML = '<table><tr>' + mapHTML.match(/.{1,250}/g).join('</tr><tr>') + '</tr></table>';
    setCookie('map', generatedMap, 100);
}
box.innerHTML = mapHTML;
document.querySelectorAll('td').forEach(function (element, index) {
    element.id = 'c' + index;
});

if (lootArray[currentCell] == undefined)
    lootArray[currentCell] = new lootSpawn((document.querySelector('#c' + currentCell).innerHTML == 'C'));
setCookie('loot', JSON.stringify(lootArray));
lootArray[currentCell].take = takeF;
lootAmmo.innerHTML = lootArray[currentCell].ammo;
lootFood.innerHTML = lootArray[currentCell].food;
lootAmmoWrap.style.display = ((lootArray[currentCell].ammo == 0) ? 'none' : 'block');
lootFoodWrap.style.display = ((lootArray[currentCell].food == 0) ? 'none' : 'block');
document.querySelectorAll('.take').forEach(function (element) {
    var x = element.id.slice(0, 3);
    var y = element.id.slice(3, 0);
    element.addEventListener('click', function () {
        lootArray[currentCell].take(y, x);
    });
});

player.style.top = document.querySelector('#c' + currentCell).getBoundingClientRect().y + 'px';
player.style.left = document.querySelector('#c' + currentCell).getBoundingClientRect().x + 'px';

function shoot(direction) {
    if (ammo > 0) {
        var bullet = document.createElement('div');
        bullet.className = 'bullet';
        bullet.innerHTML = "<img src='https://docs.google.com/drawings/d/e/2PACX-1vRvOD7wfLZjsv5S_O6hurMZnJO4u0vwxCyvgjk63VUl5phcveesBNzOi9PLn4gNSFir4lFm5sPxnFd8/pub?w=720&amp;h=719' height='18px' width='18px'>"
        bullet.style.top = player.getBoundingClientRect().y + 'px';
        bullet.style.left = player.getBoundingClientRect().x + 'px';
        var playerX = player.getBoundingClientRect().x;
        var playerY = player.getBoundingClientRect().y;
        document.body.appendChild(bullet);
        var i = 0;
        var x = setInterval(function () {
            if (direction == 'up') {
                bullet.style.top = playerY - i + 'px';
            } else if (direction == 'right') {
                bullet.style.left = playerX + i + 'px';
            } else if (direction == 'left') {
                bullet.style.left = playerX - i + 'px';
            } else if (direction == 'down') {
                bullet.style.top = playerY + i + 'px';
            }
            i += 10;
        }, 33);
        ammo--;
        ammoUsed++;
        ammoEl.innerHTML = 'Ammo: ' + ammo;
        ammoUsedEl.innerHTML = 'Ammo used: ' + ammoUsed;
        setCookie('ammo', ammo);
        setCookie('ammoused', ammoUsed);
        energy -= 0.2;
        energyEl.innerHTML = 'Energy: ' + Math.round(energy) + '/' + maxEnergy;
        setCookie('energy', energy);
        setTimeout(function () {
            clearInterval(x);
            bullet.parentNode.removeChild(bullet);
        }, 500);
    } else {
        log('Out of ammo! Reload.');
    }
}
var regenDegenInterval = setInterval(function () {
    if (Math.round(energy) > 0)
        energy++;
    if (energy > maxEnergy)
        energy = maxEnergy;
    if (Math.round(energy) == maxEnergy && health < maxHealth) {
        energy = maxEnergy;
        health += 3;
    }
    if (Math.round(energy) == 0) {
        health -= Math.floor(maxHealth / 3);
        healthEl.innerHTML = 'Health: ' + health + '/' + maxHealth;
    }
    if (health < 0) {
        var saveHTML = document.body.innerHTML;
        document.body.innerHTML = "<p style='font-size: 100px; position: absolute; top: 50%; width: 100%; text-align: center;'>YOU DIED<br><span style='font-size: 20px;'>respawning in: 3</span></p>"
        setTimeout(function () {
            document.body.innerHTML = "<p style='font-size: 100px; position: absolute; top: 50%; width: 100%; text-align: center;'>YOU DIED<br><span style='font-size: 20px;'>respawning in: 2</span></p>"
        }, 1000);
        setTimeout(function () {
            document.body.innerHTML = "<p style='font-size: 100px; position: absolute; top: 50%; width: 100%; text-align: center;'>YOU DIED<br><span style='font-size: 20px;'>respawning in: 1</span></p>"
        }, 2000);
        setTimeout(function () {
            document.body.innerHTML = saveHTML;
        }, 3000);
        energy = maxEnergy;
        health = maxHealth;
        energyEl.innerHTML = 'Energy: ' + Math.round(energy) + '/' + maxEnergy;
        healthEl.innerHTML = 'Health: ' + health + '/' + maxHealth;
        setCookie('energy', energy);
        setCookie('health', health);
    }
    energyEl.innerHTML = 'Energy: ' + Math.round(energy) + '/' + maxEnergy;
    healthEl.innerHTML = 'Health: ' + health + '/' + maxHealth;
    setCookie('energy', energy);
    setCookie('health', health);
}, 5000);

function log(message) {
    logEl.innerHTML = message + '<br>' + logEl.innerHTML;
}

setInterval(function () {
    name = nameEl.innerHTML;
    setCookie('name', name, 30);
}, 1000)

function eat(amount) {
    if (energy < maxEnergy && food >= amount) {
        food -= amount;
        energy += amount * 3;
        if (energy > maxEnergy)
            energy = maxEnergy;
        foodEl.innerHTML = 'Food: ' + food + ' [E to eat]';
        energyEl.innerHTML = 'Energy: ' + Math.round(energy) + '/' + maxEnergy;
        setCookie('food', food);
        setCookie('energy', energy);
    } else if (energy < maxEnergy && food < amount) {
        log('You have no food!')
    } else if (energy = maxEnergy) {
        log("Your energy is full. No need to eat.");
    }
}

if (document.querySelector('#c' + currentCell).innerHTML == "'")
    document.querySelector('#loot-heading').innerHTML = "[']" + ' Plains';
if (document.querySelector('#c' + currentCell).innerHTML == "*")
    document.querySelector('#loot-heading').innerHTML = "[*]" + ' Forest';
if (document.querySelector('#c' + currentCell).innerHTML == ",")
    document.querySelector('#loot-heading').innerHTML = "[,]" + ' Swamp';
if (document.querySelector('#c' + currentCell).innerHTML == "C")
    document.querySelector('#loot-heading').innerHTML = "[C]" + ' Chest';
if (document.querySelector('#c' + currentCell).innerHTML == " ")
    document.querySelector('#loot-heading').innerHTML = "[ ]" + ' Empty';

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var checker = getCookie('checker');
    if (checker == "yup") {
        name = getCookie('name');
        health = Number(getCookie('health'));
        maxHealth = Number(getCookie('maxhealth'));
        ammo = Number(getCookie('ammo'));
        energy = Number(getCookie('energy'));
        maxEnergy = Number(getCookie('maxenergy'));
        food = Number(getCookie('food'));
        steps = Number(getCookie('steps'));
        ammoUsed = Number(getCookie('ammoused'));
        generatedMap = getCookie('map');
        lootArray = JSON.parse(getCookie('loot'));
    }
}

setCookie('checker', 'yup', 30);

nameEl.innerHTML = name;
healthEl.innerHTML = 'Health: ' + health + '/' + maxHealth;
energyEl.innerHTML = 'Energy: ' + Math.round(energy) + '/' + maxEnergy;
ammoEl.innerHTML = 'Ammo: ' + ammo;
foodEl.innerHTML = 'Food: ' + food + ' [E to eat]';
ammoUsedEl.innerHTML = 'Ammo used: ' + ammoUsed;
stepsEl.innerHTML = 'Steps taken: ' + steps;
document.querySelector('#log-heading').innerHTML = 'Log';
lootAmmo.innerHTML = lootArray[currentCell].ammo;
lootFood.innerHTML = lootArray[currentCell].food;
lootAmmoWrap.style.display = ((lootArray[currentCell].ammo == 0) ? 'none' : 'block');
lootFoodWrap.style.display = ((lootArray[currentCell].food == 0) ? 'none' : 'block');
lootArray[currentCell].take = takeF;
document.querySelectorAll('.take').forEach(function (element) {
    var x = element.id.slice(0, 3);
    var y = element.id.slice(3);
    element.addEventListener('click', function () {
        lootArray[currentCell].take(y, x);
    });
});
logEl.innerHTML = 'You awake into a strange world.';
setTimeout(function () { log('Your memories are a messy blur.') }, 1500);
setTimeout(function () { log('Distant flashbacks of the battlefield swirl through your mind.') }, 3000);