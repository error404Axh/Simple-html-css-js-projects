const addbtn = document.getElementById("btn");
const input = document.getElementById("task");
const list = document.getElementById("tasklist");
const toggleBtn = document.getElementById("themeToggle");

/* ---------- ADD TASK ---------- */
function addTask() {
  const task = input.value.trim();
  if (task === "") return;

  const li = document.createElement("li");

  li.innerHTML = `
    <div class="task-left">
      <input type="checkbox">
      <span>${task}</span>
    </div>
    <button class="deletebtn">X</button>
  `;

  li.querySelector("input").addEventListener("change", () => {
    li.classList.toggle("completed");
  });

  li.querySelector(".deletebtn").addEventListener("click", () => {
    li.remove();
  });

  list.appendChild(li);
  input.value = "";
}

addbtn.addEventListener("click", addTask);

input.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

/* ---------- DARK MODE ---------- */
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    toggleBtn.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    toggleBtn.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});
