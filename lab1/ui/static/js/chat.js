const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const user = urlParams.get('name');

const socket = io({query: {name: user}})
const form = document.getElementById(`form`)
const input = document.getElementById(`input`)
const messages = document.getElementById(`messages`)



socket.on(`chat message`, (msg, name) => {
    let item = document.createElement(`li`)
    if (name == null) {
        console.log("noname")
    }
    item.textContent = `${name}: ${msg}`
    messages.appendChild(item)
    window.scrollTo(0, document.body.scrollHeight);
})


form.addEventListener("submit", (e) => {
    e.preventDefault()
    if (input.value) {
        console.log(input.value)
        socket.emit('chat message', input.value)
        input.value = ''
    }
})