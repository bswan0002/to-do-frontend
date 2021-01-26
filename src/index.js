// FETCH

function postUser(e) {
  e.preventDefault();
  fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      username: e.target.username.value,
    }),
  })
    .then((resp) => resp.json())
    .then((user) => {
      if (user.id) {
        debugger;
        console.log(user);
      } else {
        alert("Username already taken");
      }
    })
    .catch((error) => console.log(error));
}

function getUser(e) {
  e.preventDefault();
  fetch(`http://localhost:3000/users/${e.target.username.value}`)
    .then((resp) => resp.json())
    .then((user) => console.log(user))
    .catch((error) => console.log(error));
}

function postTask(e) {
  e.preventDefault();
  fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: e.target,
      description: e.target,
      due_date: e.target,
      priority_level: e.target,
      duration: e.target,
      user_id: e.target,
    }),
  })
    .then((resp) => resp.json())
    .then((task) => console.log(task))
    .catch((error) => console.log(error));
}
function updateTask(e) {
  e.preventDefault();
  fetch(`http://localhost:3000/tasks/${e.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: e.target,
      description: e.target,
      due_date: e.target,
      priority_level: e.target,
      duration: e.target,
      user_id: e.target,
    }),
  })
    .then((resp) => resp.json())
    .then((task) => console.log(task))
    .catch((error) => console.log(error));
}

function deleteTask(task) {
  fetch(`http://localhost:3000/tasks/${task.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}

function postNote(e) {
  e.preventDefault();
  fetch("http://localhost:3000/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: e.target,
      body: e.target,
      user_id: e.target,
    }),
  })
    .then((resp) => resp.json())
    .then((user) => console.log(user))
    .catch((error) => console.log(error));
}

function updateNote(e) {
  e.preventDefault();
  fetch(`http://localhost:3000/notes/${e.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: e.target,
      body: e.target,
      user_id: e.target,
    }),
  })
    .then((resp) => resp.json())
    .then((user) => console.log(user))
    .catch((error) => console.log(error));
}

function deleteNote(note) {
  fetch(`http://localhost:3000/notes/${note.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}
// HANDLERS

// LISTENERS

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderPage();

  // redo later
  const calendar = document.createElement("div");
  calendar.className = "auto-jsCalendar";
  document.body.appendChild(calendar);
});

// DOM

function renderHeader() {
  const nav = document.createElement("nav");
  nav.className = "navbar navbar-light bg-light";

  const navContainer = document.createElement("div");
  navContainer.className = "container-fluid";

  const titleDiv = document.createElement("div");
  const title = document.createElement("h1");
  title.innerText = "To-do: come up with name";
  titleDiv.appendChild(title);

  const navUl = document.createElement("ul");
  navUl.className = "nav justify-content-end";

  const signUpLi = document.createElement("li");
  const signInLi = document.createElement("li");
  signUpLi.className = "nav-item";
  signInLi.className = "nav-item";

  const signUpButton = document.createElement("button");
  signUpButton.className = "btn";
  signUpButton.innerText = "Sign Up";
  signUpButton.addEventListener("click", renderSignUp);

  const signInButton = document.createElement("button");
  signInButton.className = "btn";
  signInButton.innerText = "Sign In";
  signInButton.addEventListener("click", renderSignUp);

  signInLi.appendChild(signInButton);
  signUpLi.appendChild(signUpButton);
  navUl.append(signUpLi, signInLi);
  navContainer.append(titleDiv, navUl);
  nav.appendChild(navContainer);
  document.body.append(nav);
}

function renderSignUp(e) {
  const page = document.querySelector(".container");
  page.innerHTML = "";

  const form = document.createElement("form");
  form.className = "mt-4";
  const formDiv = document.createElement("div");

  const formTitle = document.createElement("h2");
  formTitle.innerText = e.target.innerText;

  const uLabel = document.createElement("label");
  uLabel.className = "form-label";
  uLabel.innerText = "Username";

  const uInput = document.createElement("input");
  uInput.className = "form-control mb-2";
  uInput.setAttribute("name", "username");

  const submit = document.createElement("button");
  submit.className = "btn btn-primary";
  submit.innerText = "Submit";

  form.addEventListener("submit", (event) => {
    if (e.target.innerText === "Sign Up") {
      postUser(event);
    } else {
      getUser(event);
    }
  });

  formDiv.append(formTitle, uLabel, uInput, submit);
  form.appendChild(formDiv);
  page.appendChild(form);
}

function renderPage() {
  const page = document.createElement("div");
  page.className = "container";

  document.body.appendChild(page);
}
