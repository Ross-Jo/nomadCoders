const nameContainer = document.querySelector(".js-name");

const USER_LS = "user_name";

function paintName(name) {
    nameContainer.innerHTML = "";
    const title = document.createElement("span");
    title.className = "name__text"
    title.innerHTML = `Hello ${name}`
    nameContainer.appendChild(title);
}

function handleSubmit(event) {
    event.preventDefault(); // submit 이벤트에 의해 input칸에 입력된 text가 화면상에서 없어지는 default behavior가 일어나지 않게 됨
    const form = event.target;
    const input = form.querySelector("input");
    const value = input.value;
    localStorage.setItem(USER_LS, value);
    paintName(value);
}

function paintInput() {
    const input = document.createElement("input");
    input.placeholder = "Type your name here";
    input.type = "text";
    input.className = "name__input";
    
    const form = document.createElement("form");
    form.addEventListener("submit", handleSubmit);
    form.appendChild(input);
    nameContainer.appendChild(form);
}

function loadName() {
    const currentUser = localStorage.getItem(USER_LS);
    if (currentUser === null){
        paintInput();
    } else {
        paintName(name);
    }
}

function init() {
    loadName();
}

init();