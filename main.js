const baseURL = "https://b1messenger.tk/"

const mainContainer = document.querySelector("#main")
const messagesPageButton = document.querySelector("#messagesPage")
//const loginPageButton = document.querySelector("#loginPage")
const yourUsername = document.querySelector("#yourUsername")


let token = null
let myUsername

const displayRegisterPageButton = document.querySelector("#displayRegisterPage")
const registerPopUp = document.querySelector('.register')
const regUsername = document.querySelector("#regUsername")
const regPassword = document.querySelector("#regPassword")
const regButton = document.querySelector("#register")

const errorMessageRegister = document.querySelector('#errorMessageRegister')
const refreshMessages = document.querySelector('#refresh')

regButton.addEventListener("click", () => {
    register(regUsername.value, regPassword.value)
})
messagesPageButton.addEventListener("click", displayMessagesPage)
loginButton.addEventListener("click", login)

refreshMessages.addEventListener('click', displayMessagesPage)

displayRegisterPageButton.addEventListener("click", displayRegistry)
function displayRegistry() {
    registerPopUp.classList.remove('d-none')
}


window.addEventListener("load", function() {
    setTimeout(
        function open(event) {
            document.querySelector(".popup").style.display = "block";
        },
        1000
    )
});


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

    let timeStamp = message.createdAt
    //let date = timeStamp.split("T")[0]
    let time = timeStamp.substring(11,16)

    let day = timeStamp.substring(8,10)
    let month = timeStamp.substring(5,7)
    let year = timeStamp.substring(2,4)

    let date = day +"/"+month+"/"+year

    let template
    if(message.author.username == myUsername){
        template = `
                     <div id="${message.id}" class="editMessageForm mb-3 d-none  d-flex align-items-center">
                        <input type="text" id="${message.id}" class="editMessageField bg-warning form-control rounded-pill" placeholder="Type in the new version of the message">
                        <i id="${message.id}" class="sendEdit mx-3 fa-sharp fa-solid fa-paper-plane text-secondary"></i>
                        <i id="${message.id}" class="fermerEdit fa-solid fa-xmark"></i>
                     </div>
                     <div id="${message.id}" class="d-flex align-items-center justify-content-start flex-row-reverse">
                        <p id="messageContent" class="text-white py-1 px-3 bg-primary rounded-pill">${message.content}
                            <i id="${message.id}" class="ms-4 edit fa-solid fa-pen"></i>
                            <i id="${message.id}" class="delete ms-2 fa-solid fa-trash"></i>
                        </p>
                        <p class="badge text-secondary fw-normal ms-2">${time}, ${date}</p>
                        <i id="${message.id}" class="happy ms-2 fa-solid fa-face-laugh"></i>
                     </div>

                    `
    } else {
        template = `
                    <div id="${message.id}" class="d-flex align-items-center">
<!--                        <span class="circle bg-danger"></span>-->
                        <p>${message.author.username}</p>
                        <p class="text-white ms-2 py-1 px-3 bg-primary rounded-pill">${message.content}</p>
                    <div>
                    <div class="d-flex">
                        <p class="badge text-secondary fw-normal">${time}, ${date}</p>
                        <i id="dotMenuIcons" class="fa-solid fa-ellipsis-vertical ms-2" ></i>
                        <div class="dotMenuItems" hidden>
                            <i id="${message.id}" class="happy  ms-2 fa-solid fa-face-laugh"></i>
                            <i id="${message.id}" class="love ms-2 fa-solid fa-heart"></i>
                            <i id="${message.id}" class="sad ms-2 fa-solid fa-face-frown"></i>
                        </div>
                    </div>
                    
</div>
                    
                     </div>
                    `
    }
    return template
}




function getMessagesTemplate(messages) {

    let messagesTemplate = ""
    messages.forEach(message => {
        messagesTemplate = getMessageTemplate(message) + messagesTemplate
    })
    return messagesTemplate
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
        display(messagesAndMessageField)

        const sendButton = document.querySelector("#sendMessage")
        sendButton.addEventListener("click", sendMessage)

        //Get all reaction häppi :)
        const emojisHappy = document.querySelectorAll('.happy')
        emojisHappy.forEach(emojiHappy =>{
            emojiHappy.addEventListener('click', ()=>{
                putHappyReaction(emojiHappy.id)
                emojiHappy.classList.add('bg-warning')

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

        const editMessageForms = document.querySelectorAll('.editMessageForm')
        editMessageForms.forEach(editMessageForm =>{
            const closeEditFields = document.querySelectorAll('.fermerEdit')
            closeEditFields.forEach(closeEditField =>{
                closeEditField.addEventListener('click', ()=>{
                    editMessageForm.classList.add('d-none')
                    console.log('andouille')
                })
            })

        })

        const editMessageFields = document.querySelectorAll('.editMessageField')
        editMessageFields.forEach(editMessageField =>{
            editMessageField.addEventListener('click', ()=>{
                console.log(editMessageField.id)
                editMessageField.classList.remove('bg-warning')
            })
        })

        const editButtons = document.querySelectorAll('.edit')
        editButtons.forEach(editButton =>{
            editButton.addEventListener('click', ()=>{
                console.log(editButton.id)
                editMessageForms.classList.remove('d-none')
            })
        })

        const sendEditButtons = document.querySelectorAll('.sendEdit')
        sendEditButtons.forEach(sendEditButton =>{
            sendEditButton.addEventListener('click', ()=>{
                console.log(sendEditButton.id)
                sendEditButton.classList.add('text-danger')
                editMyMessage(sendEditButton.id)

            })
        })


//essais
        function toggle(){
            const dotMenuItemGroups = document.querySelectorAll(".dotMenuItems")
            dotMenuItemGroups.forEach(dotMenuItemGroup =>{
                dotMenuItemGroup.toggleAttribute('hidden')
                console.log('toggle')
            })
        }

        // Get all Dot Menus
        const menuPointsIcons = document.querySelectorAll("#dotMenuIcons")
        menuPointsIcons.forEach(menuPointsIcon =>{
            menuPointsIcon.addEventListener('toggle', toggle)
        })
    })
}

/*trouvé sur SO, comm de 2017: dans HTML : onmouseover="MouseOver(this);" onmouseout="MouseOut(this);"
function MouseOver(elem) {
    elem.style.color = "red";
}
function MouseOut(elem) {
    elem.style.color = "blue";
}*/


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
        messageField.value = ""

}


//problème lors affichage messages erreur et succes !
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
            if (data == "try with 6+ characters for password") {
                errorMessageRegister.innerHTML = "Try with 6+ chars for password."
            } else if (data == "username alredy taken") { // pq ça ne marche plus??
                errorMessageRegister.innerHTML = "Username alredy taken"
            } else {
                console.log(data)
                //errorMessageRegister.innerHTML = "Account successfully created. You can log in now!"
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
                document.querySelector(".popup").style.display = "none";
                yourUsername.innerHTML = 'Welcome ' + usernameLogin.value + '!'
            } else {
                errorMessageLogin.innerHTML = "Username and password don't match. Try again."
            }
        })
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
            console.log(reactions.typeCount)
            if (reactions.status == "reacted") {
                //.classList.add('bg-warning')
            } else {
                //.classList.remove('activeReaction')
            }

        })
}

function editMyMessage(id){
    /*    if( .value == ""){
            console.log('empty')
        } else {*/
    let url =`${baseURL}api/messages/${id}/edit`
    let body = {
        content: "message by default" // comment link le editMessageField correponsant au message?
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
            //.value = ""
        })
    // }

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





