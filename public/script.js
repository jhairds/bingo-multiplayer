// Import utils functions
import { generateBingoGrid } from "./utils/bingoCardGenerator.mjs";
import { gameStartingWindow } from "./utils/gameStartingWindow.mjs";
import { winCheck } from "./utils/winCheck.mjs";
import { rollBall } from "./utils/rollBall.mjs";
import { promptSubmit } from "./utils/promptSubmit.mjs";
import { startGame } from "./utils/startGame.mjs";

// Popup or custom alert screen
import { popup } from "./helper/popup.mjs";
import { valueRecieve } from "./socket-events/valueRecieve.mjs";

/**
 * @type {import("socket.io-client").Socket}
 */
const socket = io(); // Create a new socket.io instance to communicate with the server

const cross = "X";

// Starting screen and ending screen
const playerScreenWrapper = document.querySelector(".player-screen-wrapper");
const playerScreen = document.querySelector("player-screen");
const startGameBtn = document.querySelector(".player-screen-btn");

// Prompt functionality for username and room selection
let promptOuter = document.querySelector(".prompt-outer"); // The outer container for the prompt

// Show the prompt on page load
window.onload = () => {
    promptOuter.style.display = "inline-flex";
};

// Generate bingo card
generateBingoGrid();

let username, roomId; // Variables to store username and room ID

// Handle the submission of the prompt
document.querySelector(".submit-btn").addEventListener("click", () => {
    [username, roomId] = promptSubmit(promptOuter, startGameBtn, socket);
});

socket.on("sending-user-data", (usersRoom) => {
    gameStartingWindow(usersRoom);
});

startGameBtn.addEventListener("click", () => {
    startGame(socket);
});

socket.on("game-started-everyone", () => {
    playerScreenWrapper.style.display = "none";
});

const cells = document.querySelectorAll(".cells"); // Select all grid cells

// Handle the "roll-ball-btn" button click
document.querySelector(".roll-ball-btn").addEventListener("click", () => {
    rollBall(cells, username, roomId, socket);
});

// Handle "value-recive" event from the server
socket.on("value-recive", (number, text) => {
    valueRecieve(number, text, cells, cross);
});

// Notify the server that this user has won
socket.on("win-notification", (winner) => {
    popup(winner, "has won the game");
});

let interval = setInterval(() => {
    winCheck(cells, cross, interval, username, roomId, socket);
});

// When host logout
socket.on("host-logout", (msg) => {
    alert(msg); // Wait for user interaction
    window.location.reload(); // Reload after alert is dismissed
});
