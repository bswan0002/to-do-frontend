// FETCH

// HANDLERS

function handlePostUser(e) {
  console.log("posted");
}

function handleGetUser(e) {
  console.log("we're getting now");
}

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
      handlePostUser(event);
    } else {
      handleGetUser(event);
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
