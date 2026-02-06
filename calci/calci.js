const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

display.focus();

/* Allowed characters regex */
const allowedRegex = /^[0-9+\-*/%.]+$/;

/* Helpers */
function getText() {
  return display.innerText.replace(/\n/g, "");
}

function setText(text) {
  display.innerText = text;
  placeCursorAtEnd();
  resizeFont();
}

function placeCursorAtEnd() {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(display);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

/* Auto font resize */
function resizeFont() {
  const len = getText().length;
  display.classList.remove("small", "smaller");

  if (len > 20) display.classList.add("small");
  if (len > 40) display.classList.add("smaller");
}

/* Insert text at cursor safely */
function insertAtCursor(text) {
  if (!allowedRegex.test(text)) return;
  document.execCommand("insertText", false, text);
  resizeFont();
}

/* Button clicks */
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.key;
    const action = btn.dataset.action;

    if (action === "clear") {
      setText("");
      return;
    }

    if (action === "equals") {
      calculate();
      return;
    }

    if (action === "backspace") {
      document.execCommand("delete");
      resizeFont();
      return;
    }

    insertAtCursor(key);
  });
});

/* Block alphabets & invalid keys */
document.addEventListener("keydown", e => {
  const allowedKeys = [
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Enter",
    "Escape"
  ];

  if (allowedKeys.includes(e.key)) {
    if (e.key === "Enter") {
      e.preventDefault();
      calculate();
    }
    if (e.key === "Escape") {
      setText("");
    }
    return;
  }

  if (!allowedRegex.test(e.key)) {
    e.preventDefault(); // 🚫 blocks abcd
  }
});

/* Block pasted alphabets */
display.addEventListener("paste", e => {
  e.preventDefault();
  const paste = (e.clipboardData || window.clipboardData)
    .getData("text")
    .replace(/[^0-9+\-*/%.]/g, "");

  insertAtCursor(paste);
});

/* Revalidate content if user hacks */
display.addEventListener("input", () => {
  const cleaned = getText().replace(/[^0-9+\-*/%.]/g, "");
  if (cleaned !== getText()) {
    setText(cleaned);
  }
  resizeFont();
});

/* Calculation */
function calculate() {
  try {
    const expr = getText();
    if (!expr) return;
    const result = Function(`"use strict"; return (${expr})`)();
    setText(result.toString());
  } catch {
    setText("Error");
  }
}
