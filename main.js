const buttonMessages = document.querySelector('#buttonMessages')
const containerMessages = document.querySelector('.messages')

function getMessages(){
    let url = 'https://192.168.12.246:8000/messages/'
    fetch(url)
        .then(donnees => donnees.json())
        .then(data => {
            data.forEach(message =>{
                console.log(message.content)
                addMessageTemplate(message)
            })
        })
}

buttonMessages.addEventListener('click', getMessages)

function addMessageTemplate(message){
    let template = `
            <div class="card">
                <div class="card-body">
                    <h6 class="card-subtitle mb-2 text-muted">Time</h6>
                    <p class="card-text">${message.content}</p>
                </div>
            </div>
    `
    containerMessages.innerHTML += template
}


