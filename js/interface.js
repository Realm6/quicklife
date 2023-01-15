const ageButton = document.getElementById('age-btn');

let modalBackground = document.getElementById('modal-background');
let eventBox = document.getElementById('event-box');
let eventTitle = document.getElementById('event-title');
let eventBody = document.getElementById('event-body')
let options = document.getElementsByClassName('option')

let textContainer = document.getElementById('text-container');

let year = Math.round(Math.random() * 20) + 2000;

const displayCustomization = () => {
    const characterScreen = document.getElementById('create-character-screen');
    characterScreen.innerHTML = `
    <h1>Customize your character</h1>
    <div class="input-group">
        <label>Name</label>
        <input id="name" type="text" autocomplete="off">

        <label>Surname</label>
        <input id="surname" type="text" autocomplete="off">

        <label>Age</label>
        <input min="0" max="70" id="age" type="number">

        <label>Gender</label>
        <select id="gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
        </select>

        <label>Nationality</label>
        <select id="nationality" value="american">
            ${nationalityList()}
        </select>

        <label>Money</label>
        <input min="0" step="10000" id="money" type="number">
        <button onclick="customCharacter()" class="create-btn">Create</button>
    </div>
    `
    //these two "prevent" typing white spaces in the inputs
    const inputName = document.getElementById('name');
    inputName.addEventListener('input', e => {
        e.target.value = e.target.value.trim()
    })

    const inputSurname = document.getElementById('surname');
    inputSurname.addEventListener('input', e => {
        e.target.value = e.target.value.trim()
    })
}

//related to events.js structure
const optionsHandler = () => {
    for (let option of options) {
        option.addEventListener('click', e => {
            textContainer.innerHTML += `<p>${e.target.getAttribute('data-msg')}</p>`;
            modalBackground.style.display = 'none';
            eventTitle.innerText = '';
            eventBody.innerHTML = '';
        })
    }
}

const closeEvent = () => {
    eventTitle.innerText = '';
    eventBody.innerHTML = '';
    modalBackground.style.display = 'none';
}


//im gonna move this somewhere else
const deathScreen = () => {
    const obituaryContainer = document.getElementById('obituary-container');

    const siblingLength = player.relationships.siblings.length;
    const dadName = player.relationships.parents[0].fullName
    const momName = player.relationships.parents[1].fullName
    const pronoun = player.gender === 'male' ? 'He' : 'She'

    obituaryContainer.innerHTML = `
    <p>${player.fullName} was born in ${player.birthplace} at year ${year - player.age}. ${pronoun} was son of ${dadName} and ${momName}${siblingLength !== 0 ? `, ${player.gender === 'male' ? 'brother' : 'sister'} of ${siblingLength} ${siblingLength > 1 ? 'persons' : 'person'}.` : '.'}</p><br>
    `

    if(player.cv.length !== 0){
        obituaryContainer.innerHTML += `<h4 class="yellow">He worked as:</h4>
        ${cvListifier(player)}<br>
        `
    } else obituaryContainer.innerHTML += `<p>${pronoun} never got a job.</p><br>`

    obituaryContainer.innerHTML += `<p>${pronoun} left this world with ${moneyFormat(player.money.total)} $ on his bank account. ${player.inventory.houses.length !== 0 ? `${pronoun} had ${player.inventory.houses.length}.` : `${pronoun} was homeless`}</p><br>`

    obituaryContainer.innerHTML += `
    <h3 class="yellow">Criminal record: </h3>
    <ul>
    <li><b class="yellow">Murder: </b>${player.criminalRecord.murder}</li>
    <li><b class="yellow">Murder attempts:</b>${player.criminalRecord.murderAttempts}</li>
    </ul><br>
    `

    obituaryContainer.innerHTML += `
    <p>${pronoun} passed away at age of ${player.age} ${player.deathCause} in ${player.location}</p>
    `

    document.getElementById('death-screen').style.display = 'block'
}

const annualChanges = () => {
    year++;
    for (let person of characters) {
        if(person.alive) person.age++;
    }

    textContainer.innerHTML += `
    <p><span class="yellow">${year} - ${player.age} years old</span></p>
    `

    //death possibility
    for(let person of characters){
        death(person)
    }

    if(!player.alive){
        const ageBtnContainer = document.getElementById('age-btn-container');
        ageBtnContainer.innerHTML = `
        <button id="dead-button" onclick="deathScreen()">Dead</button>
        `
    }

    // shows if player is in the stage of childhood, adulthood or elderhood
    lifeStageDisplayer()

    //this is for events such as first words and university
    specificEvents()

    //random messages
    if (Math.floor(Math.random() * 10) === 5)
        textContainer.innerHTML += `<p>${worldEventsMethodArr[Math.floor(Math.random() * worldEventsAmount)][1]()}</p>`
    

    //stat changes
    player.money.total += player.money.income - player.money.expenses

    // for university
    studyingProcess(textContainer)

    if (Math.floor(Math.random() * 2) === 1) {
        player.stats.happiness += Math.floor(Math.random() * 3)
    } else {
        player.stats.happiness -= Math.floor(Math.random() * 3);
    }

    statsBuffer()
    statsLimit(player)
    handleStatBars(player, true);
    skillLeveler()

    //scroll handling
    textContainer.scrollTop = textContainer.scrollHeight;

    //displaying flow of money
    moneyViewer()

    randomizeHouseStats()
}


ageButton.addEventListener('click', () => annualChanges() )

const closeMenu = document.getElementById('close-menu');
closeMenu.addEventListener('click', e => {
    menuTemplate.style.display = 'none'
})