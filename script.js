const Gameboard = (function() {
    let board = [];

    const createBoard = (gridNum) => {
        for(let i = 0; i<gridNum; i++) {
            board[i] = [];
            for(let j = 0; j<gridNum; j++) {
                board[i].push(Box());
            }
        }
    }

    const getBoard = () => board;

    const clearBoard = () => {
        const size = board.length;
        board = [];
        createBoard(size);
    }

    const printBoard = () => console.log(board);

    return {getBoard, clearBoard, printBoard,createBoard}
})();

function Box() {
    let value = 0;

    const addMarker = (marker) => value = marker;

    const getValue = () => value;

    return {addMarker, getValue};
};

const GameController = (function(
    playerOneName = 'Player X',
    playerTwoName = 'Player O') 
    {
        const board = Gameboard;
        board.createBoard(3);
        const getBoard = () => board.getBoard();

        const players = [
            {
                name: playerOneName,
                marker: 'X'
            },
            {
                name: playerTwoName,
                marker: 'O'
            }
        ];

        const setPlayerName = (name, index) => players[index].name = name;
        let activePlayer = players[0];
        const setActivePlayer = (index) => activePlayer = players[index];
        const getActivePlayer = () => activePlayer;

        const switchActivePlayer = () => (activePlayer === players[0]) ? activePlayer = players[1] : activePlayer = players[0];

        let playerOneScore = 0;
        let playerTwoScore = 0;
    
        const setScore = (x, o = 0) => {
            playerOneScore += x;
            playerTwoScore += o;
        }
        const getScore = () => ({
            x: playerOneScore,
            o:playerTwoScore
        });
    
        const resetScore = () => {
            playerOneScore = 0;
            playerTwoScore = 0;
        }

        const play = (row, col) => {
            const box = board.getBoard()[row][col];
            if(box.getValue() === 0) {
                board.getBoard()[row][col].addMarker(activePlayer.marker)
            }else {
                return;
            }
            
            if(isWinner(row, col, board.getBoard().length)) {
                console.log(`${activePlayer.name} Wins`);
                (activePlayer.marker === 'X') ? setScore(1) : setScore(0,1);
            }
            if(!isAvailableBoxes() && !isWinner(row, col, 3)) console.log(`Draw!`);
            switchActivePlayer();
        };

        const isWinner = (row, col, combo) => {
            const checkTrail = (boxes) => {
                let trail = 0;
                for(let i = 0; i < boxes.length; i++) {
                    if(boxes[i].getValue() === getActivePlayer().marker) {
                        trail++;
                    }else{
                        trail = 0;
                    }
                }
                return trail;
            };

            const rowBoxes = board.getBoard()[row];
            if(checkTrail(rowBoxes) === combo) return 1;

            const colBoxes = board.getBoard().map(row => row.filter(box => row.indexOf(box) === col)).map(box => box.value = box[0]);
            if(checkTrail(colBoxes) === combo) return 1;

            const limit = board.getBoard().length;
            const getDownSlopeBoxes = (row, col) => {
                let rowStep = row;
                let colStep = col;
                const downSlopeBoxes = [];
                while(rowStep > 0 && colStep > 0) {
                    rowStep--;
                    colStep--;
                }
    
                while(rowStep < limit && colStep < limit) {
                    downSlopeBoxes.push(board.getBoard()[rowStep][colStep]);
                    rowStep++;
                    colStep++;
                }
    
                return downSlopeBoxes;
            }
            if(checkTrail(getDownSlopeBoxes(row, col)) === combo) return 1;

            const getUpSlopeBoxes = (row, col) => {
                let rowStep = row;
                let colStep = col;
                const upSlopeBoxes = [];
                while(rowStep > 0 && colStep < (limit - 1)) {
                    rowStep--;
                    colStep++;
                }
    
                while(rowStep < limit && colStep >= 0) {
                    upSlopeBoxes.push(board.getBoard()[rowStep][colStep]);
                    rowStep++;
                    colStep--;
                }

                return upSlopeBoxes;
            }
            if(checkTrail(getUpSlopeBoxes(row, col)) === combo) return 1;
            return 0;
        };

        const isAvailableBoxes = () => {
            const spaces = board.getBoard().map(row => row.filter(box => box.getValue() === 0)).filter(arr => arr.length > 0);
            if(spaces.length > 0) return true;
        }

        const restart = () => {
            board.clearBoard();
        };

        return {getBoard,setPlayerName, play, setActivePlayer, getScore, resetScore, restart};
})();