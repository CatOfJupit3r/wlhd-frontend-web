import React, {useState} from 'react';


const buildEmptyBoard = () => {
    let board = []
    for (let i = 0; i < 6; i++) {
        let row = []
        for (let j = 0; j < 6; j++) {
            row.push(null)
        }
        board.push(row)
    }
    return board
}

const Battlefield = () => {
    /*
    * Battlefield components contains visual representation of the game board
    * (For now) It only displays the images of the game board, which are not interactive
    * The Battlefield is 6x6 grid, however, it is displayed as 9x8 grid
    * 6x6 represent the game board, while remaining 3x2 are cosmetic and help user better understand the game board
    *
    *  */

    const [sizeTile, setSizeTile] = useState(64)
    const dimensionsTile = {
        width: sizeTile,
        height: sizeTile
    } // dimensions of the game board
    const battlefield = buildEmptyBoard() // game board;
    const tileImageSrc = "assets/Walenholde-builtins-package/connector.png"

    const drawBoard = () => {
        let board = []
        for (let i = 0; i < 6; i++) {
            const rowImgs = []
            for (let j = 0; j < 6; j++) {
                rowImgs.push(
                    <img src={tileImageSrc} alt={"tile"} style={dimensionsTile}/>
                )
            }
            const row = <div style={{
                display: "flex",
                flexDirection: "row",
            }}>{rowImgs}</div>
            board.push(row)
        }
        return board
    }

    const battlefieldStyle = {
        border: "1px solid black",
        display: "grid",
        width: sizeTile * 8, // Adjusted to the actual size of the game board
        height: sizeTile * 9, // Adjusted to the actual size of the game board
        gridGap: 0, // Remove the gap between grid items
        flexGrow: 0,
    }

    return (
        <div style={battlefieldStyle}>
            {drawBoard()}
        </div>
    );
};

export default Battlefield;