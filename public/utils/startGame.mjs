const playerScreenWrapper = document.querySelector(".player-screen-wrapper");
import { popup } from "../helper/popup.mjs";

export const startGame = (username, roomId, socket) => {
    socket.emit("is-user-host", username, roomId);
    socket.on("host-not-or-yes", (isHost) => {
        if (isHost) {
            playerScreenWrapper.style.display = "none";
            socket.emit("game-started", roomId);
        } else {
            popup(null, "You are not the host, you cannot start the game.");
        }
    });
};
