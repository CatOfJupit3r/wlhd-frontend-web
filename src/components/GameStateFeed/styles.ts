import {IMAGE_SIZE} from "../../config/configs";

export const StateFeedStyle = () => (
    {
        minWidth: "fit-content",
        minHeight: "fit-content",
        width: IMAGE_SIZE * 4,
        height: IMAGE_SIZE * 9,
        maxWidth: IMAGE_SIZE * 8, // Adjusted to the actual size of the game board
        maxHeight: IMAGE_SIZE * 9, // Adjusted to the actual size of the game board
    }
)
