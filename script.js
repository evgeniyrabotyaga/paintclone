const activeToolEl = document.getElementById("active-tool");
const brushColorBtn = document.getElementById("brush-color");
const brushIcon = document.getElementById("brush");
const brushSize = document.getElementById("brush-size");
const brushSlider = document.getElementById("brush-slider");
const bucketColorBtn = document.getElementById("bucket-color");
const eraser = document.getElementById("eraser");
const clearCanvasBtn = document.getElementById("clear-canvas");
const saveStorageBtn = document.getElementById("save-storage");
const loadStorageBtn = document.getElementById("load-storage");
const clearStorageBtn = document.getElementById("clear-storage");
const downloadBtn = document.getElementById("download");
const { body } = document;

// Global Variables
const canvas = document.createElement("canvas");
canvas.id = "canvas";
const context = canvas.getContext("2d");
let currentSize = 10;
let bucketColor = "#FFFFFF";
let currentColor = "#A51DAB";
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

const createCanvas = function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
  switchBackToBrush();
};

brushColorBtn.addEventListener("change", () => {
  isEraser = false;
  currentColor = `#${brushColorBtn.value}`;
});

bucketColorBtn.addEventListener("change", () => {
  bucketColor = `#${bucketColorBtn.value}`;
  createCanvas();
  restoreCanvas();
});

brushSlider.addEventListener("change", () => {
  currentSize = brushSlider.value;
  displayBrushSize();
});

const displayBrushSize = function () {
  brushSlider.value < 10
    ? (brushSize.textContent = `0${brushSlider.value}`)
    : (brushSize.textContent = brushSlider.value);
};

const switchBackToBrush = function () {
  isEraser = false;
  activeToolEl.textContent = "Brush";
  brushIcon.style.color = "black";
  eraser.style.color = "white";
  currentColor = `#${brushColorBtn.value}`;
  currentSize = 10;
  brushSlider.value = 10;
  displayBrushSize();
};

eraser.addEventListener("click", () => {
  isEraser = true;
  eraser.style.color = "black";
  brushIcon.style.color = "white";
  activeToolEl.textContent = "Eraser";
  currentColor = bucketColor;
  currentSize = 50;
});

const getMousePosition = function (event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
};

const restoreCanvas = function () {
  for (let i = 1; i < drawnArray.length; i++) {
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = drawnArray[i].size;
    context.lineCap = "round";
    if (drawnArray[i].erase) {
      context.strokeStyle = bucketColor;
    } else {
      context.strokeStyle = drawnArray[i].color;
    }
    context.lineTo(drawnArray[i].x, drawnArray[i].y);
    context.stroke();
  }
};

const storeDrawn = function (x, y, size, color, erase) {
  const line = { x, y, size, color, erase };
  drawnArray.push(line);
};

canvas.addEventListener("mousedown", (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = "round";
  context.strokeStyle = currentColor;
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});

canvas.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser
    );
  } else {
    storeDrawn(undefined);
  }
});

clearCanvasBtn.addEventListener("click", () => {
  createCanvas();
  drawnArray = [];
  activeToolEl.textContent = "Canvas Cleared";
  setTimeout(switchBackToBrush, 1500);
});

saveStorageBtn.addEventListener("click", () => {
  localStorage.setItem("savedCanvas", JSON.stringify(drawnArray));
  activeToolEl.textContent = "Canvas Saved";
  setTimeout(switchBackToBrush, 1500);
});

loadStorageBtn.addEventListener("click", () => {
  if (localStorage.getItem("savedCanvas")) {
    drawnArray = JSON.parse(localStorage.savedCanvas);
    restoreCanvas();
    activeToolEl.textContent = "Canvas Loaded";
    setTimeout(switchBackToBrush, 1500);
  } else {
    activeToolEl.textContent = "No Canvas Found";
    setTimeout(switchBackToBrush, 1500);
  }
});

clearStorageBtn.addEventListener("click", () => {
  localStorage.removeItem("savedCanvas");
  activeToolEl.textContent = "Local Storage Cleared";
  setTimeout(switchBackToBrush, 1500);
});

downloadBtn.addEventListener("click", () => {
  downloadBtn.href = canvas.toDataURL("imgae/jpeg", 1);
  downloadBtn.download = "Ď⚠ŅĜỄŘ_Z☢Ñ€.jpeg";
  activeToolEl.textContent = "Image File Saved";
  setTimeout(switchBackToBrush, 1500);
});

brushIcon.addEventListener("click", switchBackToBrush);
createCanvas();
