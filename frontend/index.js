console.log("Hello, World!");
const button = document.createElement("button");
button.textContent = "Click me!";
button.addEventListener("click", () => {
  alert("Button clicked!");
});

document.body.appendChild(button);
