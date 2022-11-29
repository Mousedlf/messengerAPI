const baseURL = "https://b1messenger.tk/"

const mainContainer = document.querySelector("#main")
const messagesPageButton = document.querySelector("#messagesPage")
const displayRegisterPageButton = document.querySelector("#displayRegisterPage")
const loginPageButton = document.querySelector("#loginPage")
const yourUsername = document.querySelector("#yourUsername")
const landingPageModal = document.querySelector('.modal')
const registerModal = document.querySelector('.register')

let token = null
let myUsername

const regUsername = document.querySelector("#regUsername")
const regPassword = document.querySelector("#regPassword")
const regButton = document.querySelector("#register")


regButton.addEventListener("click", () => {
    register(regUsername.value, regPassword.value)
})
messagesPageButton.addEventListener("click", displayMessagesPage)
loginButton.addEventListener("click", login)
displayRegisterPageButton.addEventListener("click", displayRegistry)

const messageContent = document.querySelector('#messageContent')



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
    let template
    if(message.author.username == myUsername){
        template = `
                     <div id="${message.id}" class="d-flex align-items-center">
                        <p>${message.author.username}</p>
                        <p id="messageContent" class="ms-2 py-1 px-3 bg-primary rounded-pill">${message.content}
                            <i id="${message.id}" class="ms-4 edit fa-solid fa-pen"></i>
                            <i id="${message.id}" class="delete ms-2 fa-solid fa-trash"></i>
                        </p>
                        <i id="${message.id}" class="happy ms-2 fa-solid fa-face-laugh"></i>
                     </div>
                    `
    } else {
        template = `
                    <div id="${message.id}" class="d-flex align-items-center">
                        <p>${message.author.username}</p>
                        <p class="ms-2 py-1 px-3 bg-primary rounded-pill">${message.content}</p>
                        <i id="${message.id}" class="happy ms-2 fa-solid fa-face-laugh"></i>
                     </div>
                    `
    }
    return template
}

// ici à revoir classList.add et .remove
async function putHappyReaction(id){
    let url = `${baseURL}api/reaction/message/${id}/happy`
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
            // .innerHTML = " " + reactions.typeCount
            if (reactions.status === "reacted") {
                //.classList.add('activeReaction')
            } else {
                //.classList.remove('activeReaction')
            }

        })
}

function editMyMessage(id){
    let url =`${baseURL}api/messages/${id}/edit`
    let body = {
        content: messageField.value
    }
    let fetchParams = {
        method : 'PUT',
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body : JSON.stringify(body)
    }
    fetch(url, fetchParams)
        .then(response => response.json())
        .then(data =>{
            console.log(data)

        })
}

function deleteMyMessage(id){
    let url = `${baseURL}api/messages/delete/${id}`
    let fetchParams = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }
    return  fetch(url, fetchParams)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            displayMessagesPage()
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
    let template = `<div class="position-absolute bottom-0 mb-4 mt-3 bg-white w-100 d-flex align-items-center">
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

        //Get all reaction häppi :)
        const emojisHappy = document.querySelectorAll('.happy')
        emojisHappy.forEach(emojiHappy =>{
            emojiHappy.addEventListener('click', ()=>{
                putHappyReaction(emojiHappy.id)

            })
        })

        // Get all Delete buttons
        const delButtons = document.querySelectorAll('.delete')
        delButtons.forEach(delButton =>{
            delButton.addEventListener('click', ()=>{
                deleteMyMessage(delButton.id)
            })
        })

        // Get all Edit buttons
        const editButtons = document.querySelectorAll('.edit')
        editButtons.forEach(editButton =>{
            editButton.addEventListener('click', ()=>{
                editMyMessage(editButton.id)
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
                token = data.token;
                myUsername = usernameLogin.value;
                displayMessagesPage()
                landingPageModal.classList.remove('modalDisplay')
                yourUsername.innerHTML = 'Hello ' + usernameLogin.value + '!'
            } else {
                errorMessageLogin.innerHTML = "Username and password don't match. Try again."
            }
        })
}


