const Gameboard = (function() {
    let board = [];
    const emptyBoard = [];

    const createBoard = (gridNum) => {
        for(let i = 0; i<gridNum; i++) {
            const row = [];
            for(let j = 0; j<gridNum; j++) {
                row.push(Box());
            }
            board.push(row);
            emptyBoard.push(row);
        }
    }

    const getBoard = () => board;

    const clearBoard = () => board = emptyBoard;

    const printBoard = () => console.log(board);

    return {createBoard, getBoard, clearBoard, printBoard}
})();

function Box() {
    let value = 0;

    const addMarker = (marker) => value = marker;

    const getValue = () => value;

    return {addMarker, getValue};
};