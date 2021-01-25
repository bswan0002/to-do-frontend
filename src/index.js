// FETCH

// HANDLERS

function handlePostUser(e) {
  debugger;
}

function handleGetUser(e) {
  console.log("we're getting now");
  debugger;
}

// LISTENERS

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderPage();
});

// DOM

function renderHeader() {
  const nav = document.createElement("nav");
  nav.className = "navbar";

  const navContainer = document.createElement("div");
  navContainer.className = "container-fluid";

  const signUpButton = document.createElement("button");
  signUpButton.innerText = "Sign Up";
  signUpButton.addEventListener("click", renderSignUp);

  const signInButton = document.createElement("button");
  signInButton.innerText = "Sign In";
  signInButton.addEventListener("click", renderSignUp);

  navContainer.append(signUpButton, signInButton);
  nav.appendChild(navContainer);
  document.body.append(nav);
}

function renderSignUp(e) {
  const page = document.querySelector(".container");
  const form = document.createElement("form");
  const formDiv = document.createElement("div");

  const uLabel = document.createElement("label");
  uLabel.className = "form-label";
  uLabel.innerText = "Username";

  const uInput = document.createElement("input");
  uInput.className = "form-control";
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

  formDiv.append(uLabel, uInput, submit);
  form.appendChild(formDiv);
  page.appendChild(form);
}

function renderPage() {
  const page = document.createElement("div");
  page.className = "container";

  document.body.appendChild(page);
}
