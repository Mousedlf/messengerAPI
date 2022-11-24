const baseURL = "https://b1messenger.tk/"


const mainContainer = document.querySelector("#main")
const messagesPageButton = document.querySelector("#messagesPage")
const displayRegisterPageButton = document.querySelector("#displayRegisterPage")

const loginPageButton = document.querySelector("#loginPage")
const yourUsername = document.querySelector("#yourUsername")
const landingPageModal = document.querySelector('.modal')
const registerModal = document.querySelector('.register')

let token = null

const regUsername = document.querySelector("#regUsername")
const regPassword = document.querySelector("#regPassword")
const regButton = document.querySelector("#register")

const responseField = document.querySelector('#responseField')

regButton.addEventListener("click", () => {
    register(regUsername.value, regPassword.value)
})
messagesPageButton.addEventListener("click", displayMessagesPage)

loginButton.addEventListener("click", login)
displayRegisterPageButton.addEventListener("click", displayRegistry)


function displayRegistry() {
    registerModal.classList.add('registerDisplayBlock')
}

function clearMainContainer() {
    mainContainer.innerHTML = ""
}

function display(content) {
    //vider la div principale
    clearMainContainer()
    //et y ajouter le contenu qu'elle recoit
    mainContainer.innerHTML = content

}

function getMessageTemplate(message) {
    let template = `
                    <div id="${message.id}" class="d-flex align-items-center">
                        <p>${message.author.username}</p>
                        <p class="ms-2 py-1 px-3 bg-primary rounded-pill">${message.content}</p>
                        <i class="happy ms-2 fa-solid fa-face-laugh"></i>
                     </div>
                    `
    return template
}

async function putHappyReaction(){

    let url = `${baseURL}api/reaction/message/${message.id}/happy`
    let fetchParams = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }
    return await fetch(url, fetchParams)
        .then(response => response.json())
        .then(reactions => {
            console.log(reactions)

            /*reactionLol.innerHTML = " " + reactions.typeCount
            if (reactions.status === "reacted") {
                reactionLol.classList.add('activeReaction')
            } else {
                reactionLol.classList.remove('activeReaction')
            }*/
        })
}

function getMessagesTemplate(messages) {

    let messagesTemplate = ""
    messages.forEach(message => {
        messagesTemplate += getMessageTemplate(message)
    })
    return messagesTemplate
}

function getMessageFieldTemplate() {
    let template = `<div class="position-absolute bottom-0 pb-4 pt-3 bg-white w-100 d-flex align-items-center px-5">
                        <input type="text" name="" id="messageField" placeholder="Aa" class="bg-secondary form-control rounded-pill ">
                        <button class="btn btn-primary" id="sendMessage">Send</button>                    
                    </div>
                    `
    return template
}

async function getMessagesFromApi() {

    let url = `${baseURL}api/messages/`

    let fetchParams = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }

    return await fetch(url, fetchParams)
        .then(response => response.json())
        .then(messages => {
            messages.forEach(message => {
                //console.log(message.id)
            })
            return messages
        })
}

async function displayMessagesPage() {
    //consiste a afficher les messages + le champ d'entrée d'un nouveau message
    let messagesAndMessageField = ""

    getMessagesFromApi().then(messages => {

        messagesAndMessageField += getMessagesTemplate(messages)
        messagesAndMessageField += getMessageFieldTemplate()

        display(messagesAndMessageField)

        const messageField = document.querySelector("#messageField")
        const sendButton = document.querySelector("#sendMessage")
        sendButton.addEventListener("click", sendMessage)

        //Reaction häppi :)
        const emojisHappy = document.querySelectorAll('.happy')
        emojisHappy.forEach(emojiHappy =>{
            emojiHappy.addEventListener('click', ()=>{
                console.log('häppi?')
                putHappyReaction()
            })
        })
    })
}

function sendMessage() {
    let url = `${baseURL}api/messages/new`
    let body = {
        content: messageField.value
    }
    let bodySerialise = JSON.stringify(body)
    let fetchParams = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: bodySerialise
    }
    fetch(url, fetchParams)
    displayMessagesPage()
}

//problème lors affichage message erreur
function register() {
    let url = `${baseURL}register`
    let body = {
        username: regUsername.value,
        password: regPassword.value
    }
    let fetchParams = {
        method: "POST",
        body: JSON.stringify(body)
    }
    fetch(url, fetchParams)
        .then(response => response.json())
        .then(data => {
            if (data === "try with 6+ characters for password") {
                errorMessageRegister.innerHTML = "Try with 6+ chars for password."
            } else if (data === "username alredy taken") { // pq ça ne marche plus??
                errorMessageRegister.innerHTML = "Username alredy taken"
            } else {
                displayMessagesPage()
                console.log(data)
            }
        })
}

function login() {
    const usernameLogin = document.querySelector('#usernameLogin')
    const passwordLogin = document.querySelector('#passwordLogin')
    const loginButton = document.querySelector('#loginButton')

    let url = `${baseURL}login`
    let body = {
        username: usernameLogin.value,
        password: passwordLogin.value
    }
    let fetchParams = {
        headers: {"Content-Type": "application/json"},
        method: "POST",
        body: JSON.stringify(body)
    }
    fetch(url, fetchParams)
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                token = data.token
                displayMessagesPage()
                landingPageModal.classList.remove('modalDisplay')
                yourUsername.innerHTML = 'Hello ' + usernameLogin.value + '!'
            } else {
                errorMessageLogin.innerHTML = "Username and password don't match. Try again."
            }
        })
}


