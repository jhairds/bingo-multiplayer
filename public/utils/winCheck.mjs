import { popup } from "../helper/popup.mjs";

const winningConditions = [
    //Horizontal winning conditions
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    //Diagonal winning conditions
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
];

export const winCheck = (cells, cross, interval, username, roomId, socket) => {
    for (let i = 0; i < winningConditions.length; i++) {
        let a = winningConditions[i];
        let win = true;
        for (let j = 0; j < 5; j++) {
            if (cells[a[j]].textContent !== cross) {
                win = false;
                break;
            }
        }
        if (win) {
            clearInterval(interval);
            popup(username, "have won the game");
            socket.emit("win", username, roomId);
            break;
        }
    }
};
