let selectedElement = null;
let undoStack = [];
let redoStack = [];

const canvas = document.getElementById("canvas");

function addText() {
    const input = document.getElementById("text-input");
    
    if (input.value.trim() === "") return;

    const textElement = document.createElement("div");
    textElement.classList.add("text-element");
    textElement.textContent = input.value;
    textElement.style.left = "50px";
    textElement.style.top = "50px";
    
    textElement.setAttribute("draggable", "true");
    textElement.addEventListener("mousedown", () => setSelectedElement(textElement));
    textElement.addEventListener("dragstart", (e) => dragStart(e));
    textElement.addEventListener("dragend", (e) => dragEnd(e));

    canvas.appendChild(textElement);
    input.value = "";
    
    saveState();
}

function setSelectedElement(element) {
    selectedElement = element;
}

function changeFont() {
    if (selectedElement) {
        const font = document.getElementById("font-selector").value;
        selectedElement.style.fontFamily = font;
        saveState();
    }
}

function changeFontSize() {
    if (selectedElement) {
        const size = document.getElementById("font-size").value;
        selectedElement.style.fontSize = `${size}px`;
        saveState();
    }
}

function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.target.style.cursor = "default";
}

function dragEnd(e) {
    const rect = canvas.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    const elementWidth = selectedElement.offsetWidth;
    const elementHeight = selectedElement.offsetHeight;

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x + elementWidth > canvas.offsetWidth) x = canvas.offsetWidth - elementWidth;
    if (y + elementHeight > canvas.offsetHeight) y = canvas.offsetHeight - elementHeight;

    if (selectedElement) {
        selectedElement.style.left = `${x}px`;
        selectedElement.style.top = `${y}px`;
        saveState();
    }
}


function saveState() {
    undoStack.push(canvas.innerHTML);
    redoStack = [];
}

function undo() {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        document.getElementById("canvas").innerHTML = undoStack[undoStack.length - 1];
        updateSelectedElementEvents();
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(redoStack.pop());
        document.getElementById("canvas").innerHTML = undoStack[undoStack.length - 1];
        updateSelectedElementEvents();
    }
}

function updateSelectedElementEvents() {
    const elements = document.querySelectorAll(".text-element");
    elements.forEach((element) => {
        element.addEventListener("mousedown", () => setSelectedElement(element));
        element.addEventListener("dragstart", (e) => dragStart(e));
        element.addEventListener("dragend", (e) => dragEnd(e));
    });
}
