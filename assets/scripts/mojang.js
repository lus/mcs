const states = new Map();
states.set('green', 'operational');
states.set('yellow', 'problematical');
states.set('red', 'critical');

const discontinuedServices = new Map();
discontinuedServices.set("sessionserver.mojang.com", true);

const refreshingSeconds = 60;

const infoTexts = new Map();
infoTexts.set('minecraft.net', 'The minecraft.net web page.');
infoTexts.set('session.minecraft.net', 'The current session server which is part of the user authentication workflow.');
infoTexts.set('account.mojang.com', 'The current account server which is part of the user authentication workflow.');
infoTexts.set('authserver.mojang.com', 'The current authentication server which is part of the user authentication workflow.');
infoTexts.set('sessionserver.mojang.com', 'The old session server which got discontinued.');
infoTexts.set('api.mojang.com', 'The Mojang API.');
infoTexts.set('textures.minecraft.net', 'The texture server which controls and serves skin and cape texture data.');
infoTexts.set('mojang.com', 'The mojang.com web page.');

function addElement(data) {
    document.getElementsByClassName('items')[0].innerHTML += `
        <div id="${data.id}" class="item animate__animated animate__fadeInUp">
            <div class="data">
                <div class="info">
                    <div class="status"><span class="label ${data.color}">${states.get(data.color)}</span></div>
                    <div>
                        <span class="url">${data.url}</span>
                        <span class="discontinued-notice label blue${discontinuedServices.get(data.url) ? '' : ' hidden'}">discontinued</span>
                    </div>
                </div>
                <div class="help" onclick="document.getElementById('${data.id}').getElementsByClassName('infotext')[0].classList.toggle('hidden');">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-info-circle" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#a7a7a7" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="12" cy="12" r="9" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                        <polyline points="11 12 12 12 12 16 13 16" />
                    </svg>
                </div>
            </div>
            <div class="infotext hidden">${data.infoText}</div>
        </div>
    `;
}

function fetchElements() {
    document.getElementsByClassName('items')[0].innerHTML = "";
    fetch('https://status.mojang.com/check')
        .then(response => response.json())
        .then(data => {
            for (var index in data) {
                let service = Object.keys(data[index])[0];
                let status = Object.values(data[index])[0];
                addElement({
                    id: service,
                    color: status,
                    url: service,
                    infoText: infoTexts.get(service)
                })
            }
        });
}

let remaining = refreshingSeconds;

function updateElements() {
    fetchElements();
    remaining = refreshingSeconds;
}

function updateRemainingTime() {
    document.getElementById('refreshing').innerText = remaining.toString();
    remaining--;
}

setInterval(updateElements, refreshingSeconds * 1000);
setInterval(updateRemainingTime, 1000);

updateElements();
updateRemainingTime();