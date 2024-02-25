import {IMAGE_SIZE} from "../../config/configs";

export const imgStyle = {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
}

export const tileStyle = {
    ...imgStyle,
    backgroundImage: "url('assets/builtins/tile.png')",
    backgroundSize: "cover"
}


export const battlefieldStyle = {
    border: "1px solid black",
    display: "grid",
    width: "fit-content",
    height: "fit-content",
    maxWidth: IMAGE_SIZE * 8, // Adjusted to the actual size of the game board
    maxHeight: IMAGE_SIZE * 9, // Adjusted to the actual size of the game board
    background: "#16161D"
}
