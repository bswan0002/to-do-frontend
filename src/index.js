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
        renderTaskForm(user);
        renderTaskList(user);
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
    .then((user) => {
      renderTaskForm(user);
      renderTaskList(user);
    })
    .catch((error) => console.log(error));
}

function postTask(e, user) {
  e.preventDefault();
  fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: e.target.title.value,
      description: e.target.description.value,
      due_date: e.target.due_date.value,
      priority_level: e.target.priority_level.value,
      duration: parseInt(e.target.duration.value),
      user_id: user.id,
    }),
  })
    .then((resp) => resp.json())
    .then((task) => {
      renderTask(task);
      e.target.reset();
    })
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
      title: e.target.title.value,
      description: e.target.description.value,
      due_date: e.target.due_date.value,
      priority_level: e.target.priority_level.value,
      duration: e.target.duration.value,
      user_id: user.id,
    }),
  })
    .then((resp) => resp.json())
    .then((task) => renderTaskList(user))
    .catch((error) => console.log(error));
}

function deleteTask(event) {
  fetch(
    `http://localhost:3000/tasks/${event.target.parentElement.dataset.id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  ).then(event.target.parentElement.remove());
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
function handleDate(date) {
  let time = date.split("-");
  let month = time[0].slice(2);
  let day = time[1];
  let year = time[2].slice(0, 2);
  return `${month}-${day}-${year}`;
}
function handleEditTask(event) {
  debugger;
}
// LISTENERS

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderPage();
  renderCalendar();
});

// DOM
function renderTaskList(user) {
  const div = document.querySelector(".justify-content-around");
  const innerDiv = document.createElement("div");
  innerDiv.className = "col-4 mt-4";
  const header = document.createElement("h2");
  header.textContent = "Task List";
  const ul = document.createElement("ul");
  ul.id = "task-list";
  ul.className = "list-group";
  innerDiv.append(header, ul);
  div.appendChild(innerDiv);
  user.tasks.forEach((task) => {
    renderTask(task);
  });
}

function renderTask(task) {
  const ul = document.getElementById("task-list");
  const li = document.createElement("li");
  li.textContent = `${task.title} | ${handleDate(task.due_date)}`;
  li.dataset.id = task.id;
  li.className = "list-group-item";
  const deleteBTN = document.createElement("button");
  const editBTN = document.createElement("button");
  deleteBTN.textContent = "Delete";
  deleteBTN.className = "btn btn-danger";
  deleteBTN.addEventListener("click", deleteTask);
  editBTN.textContent = "Edit";
  editBTN.className = "btn btn-success";
  editBTN.addEventListener("click", handleEditTask);
  li.append(editBTN, deleteBTN);
  ul.appendChild(li);
}
function renderTaskForm(user) {
  const page = document.querySelector(".container");
  document.querySelector("form").remove();
  const outerDiv = document.createElement("div");
  outerDiv.setAttribute("class", "row justify-content-around");
  const innerDiv = document.createElement("div");
  innerDiv.className = "col-4";
  const form = document.createElement("form");
  form.className = "mt-4";
  const formDiv = document.createElement("div");

  const formTitle = document.createElement("h2");
  formTitle.innerText = "Create New Task";

  const titleLabel = document.createElement("label");
  titleLabel.className = "form-label";
  titleLabel.innerText = "Title";

  const titleInput = document.createElement("input");
  titleInput.className = "form-control mb-2";
  titleInput.setAttribute("name", "title");

  const descriptionLabel = document.createElement("label");
  descriptionLabel.className = "form-label";
  descriptionLabel.innerText = "Description";

  const descriptionInput = document.createElement("input");
  descriptionInput.className = "form-control mb-2";
  descriptionInput.setAttribute("name", "description");

  const dateLabel = document.createElement("label");
  dateLabel.className = "form-label";
  dateLabel.innerText = "Due Date";

  const dateInput = document.createElement("input");
  dateInput.className = "form-control mb-2 datepicker";
  dateInput.setAttribute("type", "text");
  dateInput.placeholder = "Select Date";
  dateInput.setAttribute("name", "due_date");

  const priorityLabel = document.createElement("label");
  priorityLabel.className = "form-label";
  priorityLabel.innerText = "Priority Level";

  const priorityInput = document.createElement("input");
  priorityInput.className = "form-control mb-2";
  priorityInput.setAttribute("name", "priority_level");

  const durationLabel = document.createElement("label");
  durationLabel.className = "form-label";
  durationLabel.innerText = "Estimated Duration";

  const durationInput = document.createElement("input");
  durationInput.className = "form-control mb-2";
  durationInput.setAttribute("name", "duration");

  const submit = document.createElement("button");
  submit.className = "btn btn-primary";
  submit.innerText = "Submit";
  formDiv.append(
    formTitle,
    titleLabel,
    titleInput,
    descriptionLabel,
    descriptionInput,
    dateLabel,
    dateInput,
    priorityLabel,
    priorityInput,
    durationLabel,
    durationInput,
    submit
  );
  form.appendChild(formDiv);
  form.addEventListener("submit", (e) => postTask(e, user));
  const calendar = document.querySelector(".auto-jsCalendar");
  innerDiv.appendChild(form);
  outerDiv.appendChild(innerDiv);
  page.insertBefore(outerDiv, calendar);
}

function renderHeader() {
  const nav = document.createElement("nav");
  nav.className = "navbar navbar-light bg-light";

  const navContainer = document.createElement("div");
  navContainer.className = "container-fluid";

  const titleDiv = document.createElement("div");
  const title = document.createElement("h1");
  title.className = "title";
  title.innerHTML = `<span class = "orange">await</span><span class = "blue"> noMore</span>();`;
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
  if (document.querySelector("form")) {
    document.querySelector("form").remove();
  }

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
  const calendar = document.querySelector(".auto-jsCalendar");
  formDiv.append(formTitle, uLabel, uInput, submit);
  form.appendChild(formDiv);
  page.insertBefore(form, calendar);
}

function renderPage() {
  const page = document.createElement("div");
  page.className = "container";

  document.body.appendChild(page);
}

function renderCalendar() {
  const calendar = document.createElement("div");
  calendar.className = "auto-jsCalendar clean-theme blue mt-4";
  document.querySelector(".container").appendChild(calendar);
}
