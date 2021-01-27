// Global Variables
let colors = {
  High: "rgba(160, 32, 240, 0.65)",
  Medium: "rgba(0, 60, 255, 0.65)",
  Low: "rgba(0, 140, 0, 0.65)",
};
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
        document.querySelector("form").remove();
        renderTaskForm(user.id);
        renderTaskList(user);
        updateHeader();
        renderNoteForm(user.id);
        renderNoteList(user);
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
      if (user) {
        document.querySelector("form").remove();
        renderTaskForm(user.id);
        renderTaskList(user);
        updateHeader();
        renderNoteForm(user.id);
        renderNoteList(user);
      } else {
        alert("Invalid Username");
      }
    })
    .catch((error) => console.log(error));
}

function postTask(e, user_id) {
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
      user_id: user_id,
    }),
  })
    .then((resp) => resp.json())
    .then((task) => {
      task.id !== null ? renderTask(task) : alert("Invalid Task Submission");
      e.target.reset();
    })
    .catch((error) => console.log(error));
}
function updateTask(e, user_id, task_id) {
  e.preventDefault();
  document.getElementById("task_form").innerHTML = "";
  renderTaskForm(user_id);
  fetch(`http://localhost:3000/tasks/${task_id}`, {
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
      duration: parseInt(e.target.duration.value),
      user_id: user_id,
    }),
  })
    .then((resp) => resp.json())
    .then((task) => {
      console.log(task);
      renderTask(task);
    })
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

function postNote(e, user_id) {
  e.preventDefault();
  fetch("http://localhost:3000/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: e.target.title.value,
      body: e.target.body.value,
      user_id: user_id,
    }),
  })
    .then((resp) => resp.json())
    .then((note) => renderNote(note))
    .then(() => {
      noteForm = document.getElementById("note_form");
      noteForm.querySelector("form").reset();
    })
    .catch((error) => console.log(error));
}

function updateNote(e, note) {
  e.preventDefault();
  fetch(`http://localhost:3000/notes/${note.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      title: e.target.title.value,
      body: e.target.body.value,
      user_id: note.user_id,
    }),
  })
    .then((resp) => resp.json())
    .then((note) => {
      renderNoteForm(note.user_id);
      updateNoteDOM(note);
    })
    .catch((error) => console.log(error));
}

function deleteNote(e, note) {
  fetch(`http://localhost:3000/notes/${note.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then(e.target.parentElement.parentElement.parentElement.remove());
}

// HANDLERS
function handleDate(date) {
  let time = date.split("-");
  let year = time[0];
  let month = time[1];
  let day = time[2].slice(0, 2);
  return `${month}-${day}-${year}`;
}
function handleEditTask(event, task) {
  document.getElementById("task_form").innerHTML = "";
  renderTaskForm(event.target.dataset.id, task);
}

function handleReloadPage() {
  location.reload();
}
function handleEditNote(note) {
  renderNoteForm(note.user_id, note);
}
// LISTENERS

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderPage();
  renderCalendar();
  setTimeout(renderDurationBar, 500);
  setTimeout(addMonthEvent, 500);
});

// DOM
function updateNoteDOM(note) {
  let noteDiv = document.querySelector(`[data-note_id="${note.id}"]`);
  let titleEle = noteDiv.firstChild;
  titleEle.textContent = note.title;
  let bodyEle = noteDiv.lastChild.querySelector("p");
  bodyEle.textContent = note.body;
  noteDiv.querySelector("button.btn-success").remove();
  let newEditButton = document.createElement("button");
  newEditButton.className = "btn btn-success";
  newEditButton.textContent = "Edit";
  newEditButton.addEventListener("click", () => handleEditNote(note));
  let deleteButton = noteDiv.querySelector("button.btn-danger");
  deleteButton.parentElement.insertBefore(newEditButton, deleteButton);
}

function renderNoteForm(user_id, note = null) {
  const page = document.querySelector(".container");
  let outerDiv;
  let innerDiv;
  if (document.querySelector("#note-container") === null) {
    outerDiv = document.createElement("div");
    outerDiv.setAttribute("class", "row justify-content-around");
    outerDiv.id = "note-container";
    innerDiv = document.createElement("div");
    innerDiv.className = "col-md";
    innerDiv.id = "note_form";
  } else {
    outerDiv = document.querySelector("#note-container");
    innerDiv = document.getElementById("note_form");
    innerDiv.firstChild.remove();
  }
  const form = document.createElement("form");
  form.className = "mt-4";
  const formDiv = document.createElement("div");

  const formTitle = document.createElement("h2");
  formTitle.textContent = note === null ? "Create New Note" : "Edit Note";

  const titleLabel = document.createElement("label");
  titleLabel.className = "form-label";
  titleLabel.innerText = "Title";

  const titleInput = document.createElement("input");
  titleInput.className = "form-control mb-2";
  titleInput.setAttribute("name", "title");

  const bodyLabel = document.createElement("label");
  bodyLabel.className = "form-label";
  bodyLabel.innerText = "Body";

  const bodyInput = document.createElement("textarea");
  bodyInput.className = "form-control mb-2";
  bodyInput.setAttribute("name", "body");

  const submit = document.createElement("button");
  submit.className = "btn btn-primary";
  submit.innerText = "Submit";
  form.addEventListener("submit", (e) => {
    note === null ? postNote(e, user_id) : updateNote(e, note);
  });
  form.append(
    formDiv,
    formTitle,
    titleLabel,
    titleInput,
    bodyLabel,
    bodyInput,
    submit
  );
  innerDiv.appendChild(form);
  let list = document.getElementById("note-div");
  if (note !== null) {
    titleInput.value = note.title;
    bodyInput.value = note.body;
  }
  if (list !== null) {
    outerDiv.insertBefore(innerDiv, list);
  } else {
    outerDiv.appendChild(innerDiv);
    page.appendChild(outerDiv);
  }
}

function renderNoteList(user) {
  const div = document.querySelector("#note-container");
  const innerDiv = document.createElement("div");
  innerDiv.className = "col-md mt-4";
  innerDiv.id = "note-div";
  const header = document.createElement("h2");
  header.textContent = "Note List";
  const noteList = document.createElement("div");
  noteList.id = "note-list";
  noteList.className = "list-group overflow-auto";
  innerDiv.append(header, noteList);
  div.appendChild(innerDiv);
  user.notes.forEach((note) => {
    renderNote(note);
  });
}

function renderNote(note) {
  let outerDiv = document.createElement("div");
  outerDiv.className = "accordion";
  outerDiv.dataset.note_id = note.id;
  let button = document.createElement("button");
  button.textContent = note.title;
  button.className = "accordion__button";
  button.addEventListener("click", () => {
    const accordionContent = button.nextElementSibling;
    button.classList.toggle("accordion__button--active");
    if (button.classList.contains("accordion__button--active")) {
      accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
    } else {
      accordionContent.style.maxHeight = 0;
    }
  });
  let innerDiv = document.createElement("div");
  innerDiv.className = "accordion__content";
  let p = document.createElement("p");
  p.textContent = note.body;
  let deleteBTN = document.createElement("button");
  deleteBTN.textContent = "Delete";
  deleteBTN.className = "btn btn-danger";
  deleteBTN.addEventListener("click", (e) => deleteNote(e, note));
  let editBTN = document.createElement("button");
  editBTN.textContent = "Edit";
  editBTN.className = "btn btn-success";
  editBTN.addEventListener("click", () => handleEditNote(note));
  let buttonDiv = document.createElement("div");
  buttonDiv.className = "button__seperate";
  buttonDiv.append(editBTN, deleteBTN);
  innerDiv.append(p, buttonDiv);
  outerDiv.append(button, innerDiv);
  noteList = document.getElementById("note-list");
  noteList.appendChild(outerDiv);
}

function updateHeader() {
  document.querySelector("ul.nav").children[0].remove();
  let signOut = document.querySelector("ul.nav").firstChild;
  signOut.innerHTML = "";
  let button = document.createElement("button");
  button.className = "btn";
  button.textContent = "Sign Out";
  button.addEventListener("click", handleReloadPage);
  signOut.appendChild(button);
}

function renderTaskList(user) {
  const div = document.querySelector("#task-container");
  const innerDiv = document.createElement("div");
  innerDiv.className = "col-md mt-4";
  innerDiv.id = "task-div";
  const header = document.createElement("h2");
  header.textContent = "Task List";
  const ul = document.createElement("ul");
  ul.id = "task-list";
  ul.className = "list-group overflow-auto";
  innerDiv.append(header, ul);
  div.appendChild(innerDiv);
  user.tasks.forEach((task) => {
    renderTask(task);
  });
}

function renderTask(task) {
  const ul = document.getElementById("task-list");
  let li;
  if (document.querySelector(`[data-id="${task.id}"]`) === null) {
    li = document.createElement("li");
    li.dataset.id = task.id;
    li.className = "list-group-item";
    ul.appendChild(li);
  } else {
    li = document.querySelector(`[data-id="${task.id}"]`);
    li.innerHTML = "";
  }
  li.textContent = `${task.title} | ${handleDate(task.due_date)}`;
  li.style.backgroundColor = `${colors[task.priority_level]}`;
  const deleteBTN = document.createElement("button");
  const editBTN = document.createElement("button");
  deleteBTN.textContent = "Delete";
  deleteBTN.className = "btn btn-danger";
  deleteBTN.addEventListener("click", deleteTask);
  editBTN.textContent = "Edit";
  editBTN.dataset.id = task.user_id;
  editBTN.className = "btn btn-success";
  editBTN.addEventListener("click", (e) => handleEditTask(e, task));
  li.append(editBTN, deleteBTN);
}
function renderTaskForm(user_id, task = null) {
  const page = document.querySelector(".container");
  let outerDiv;
  let innerDiv;
  if (document.querySelector("#task-container") === null) {
    outerDiv = document.createElement("div");
    outerDiv.setAttribute("class", "row justify-content-around");
    outerDiv.id = "task-container";
    innerDiv = document.createElement("div");
    innerDiv.className = "col-md";
    innerDiv.id = "task_form";
  } else {
    outerDiv = document.querySelector("#task-container");
    innerDiv = document.getElementById("task_form");
  }
  const form = document.createElement("form");
  form.className = "mt-4";
  const formDiv = document.createElement("div");

  const formTitle = document.createElement("h2");
  formTitle.textContent = task === null ? "Create New Task" : "Edit Task";

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
  dateInput.placeholder = "MM-DD-YYYY";
  dateInput.setAttribute("name", "due_date");

  const priorityLabel = document.createElement("label");
  priorityLabel.className = "form-label";
  priorityLabel.innerText = "Priority Level";

  const priorityInput = document.createElement("select");
  priorityInput.className = "form-control mb-2";
  const optionNone = document.createElement("option");
  const optionHigh = document.createElement("option");
  optionHigh.textContent = "High";
  const optionLow = document.createElement("option");
  optionLow.textContent = "Low";
  const optionMed = document.createElement("option");
  optionMed.textContent = "Medium";
  priorityInput.append(optionNone, optionHigh, optionMed, optionLow);
  priorityInput.setAttribute("name", "priority_level");

  const durationLabel = document.createElement("label");
  durationLabel.className = "form-label";
  durationLabel.innerText = "Estimated Duration (minutes)";

  const durationInput = document.createElement("input");
  durationInput.className = "form-control mb-2";
  durationInput.setAttribute("name", "duration");
  if (task !== null) {
    titleInput.value = task.title;
    descriptionInput.value = task.description;
    dateInput.value = handleDate(task.due_date);
    priorityInput.value = task.priority_level;
    durationInput.value = task.duration;
  }
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
  form.addEventListener("submit", (e) => {
    task === null ? postTask(e, user_id) : updateTask(e, user_id, task.id);
  });
  const calendar = document.querySelector(".auto-jsCalendar");
  innerDiv.appendChild(form);
  let task_list = document.querySelector("#task-list");
  task_list === null ? outerDiv.appendChild(innerDiv) : null;
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
  calendar.dataset.monthFormat = "month YYYY";
  document.querySelector(".container").appendChild(calendar);
}

function renderDurationBar() {
  // make svg
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  let highPercentage = 10;
  let medPercentage = 15;
  let lowPercentage = 35;
  // make rectangles
  const highBar = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  const medBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  const lowBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");

  highBar.setAttribute("width", "100%");
  highBar.setAttribute("height", `${highPercentage}%`);
  highBar.setAttribute("y", `${92 * (1 - highPercentage / 100)}`);
  highBar.setAttribute("fill", `${colors["High"]}`);

  medBar.setAttribute("width", "100%");
  medBar.setAttribute("height", `${medPercentage}%`);
  medBar.setAttribute(
    "y",
    `${92 * (1 - (highPercentage + medPercentage) / 100)}`
  );
  medBar.setAttribute("fill", `${colors["Medium"]}`);

  lowBar.setAttribute("width", "100%");
  lowBar.setAttribute("height", `${lowPercentage}%`);
  lowBar.setAttribute(
    "y",
    `${92 * (1 - (highPercentage + medPercentage + lowPercentage) / 100)}`
  );
  lowBar.setAttribute("fill", `${colors["Low"]}`);

  svg.append(highBar, medBar, lowBar);
  document.body.appendChild(svg);
  // put bar in cal
  const dayOne = Array.from(document.querySelectorAll("tbody td")).find(
    (el) => el.textContent === "26"
  );
  dayOne.appendChild(svg);
}

function addMonthEvent() {
  const navLeft = document.querySelector(".jsCalendar-nav-left");
  const navRight = document.querySelector(".jsCalendar-nav-right");

  navLeft.addEventListener("click", renderDurationBar);
  navRight.addEventListener("click", renderDurationBar);
}
