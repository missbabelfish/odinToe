const gameBoard = (function () {
	const board = Array(9).fill('-')
	const getBoard = () => board;

	const addSquareValue = (value, square) => board[square] = value;

	return { getBoard, addSquareValue }
})()

function GameController(
        playerOneName = 'Player One',
        playerTwoName = 'Player Two'
    ) {
	let board = gameBoard.getBoard()
    let count = 0

	const players = [
		{
			name: playerOneName,
			value: 1,
            marker: 'x'
		},
		{
			name: playerTwoName,
			value: -1,
            marker: 'o'
		}
	];

	let activePlayer = players[0]

    // switch player
	const switchPlayerTurn = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0]
	};

    // check which player is active
	const getActivePlayer = () => activePlayer;

    // active player marks square
    const takeTurn = (player, square) => {
        count++
        gameBoard.addSquareValue(player.value, square)

        // printBoard()
        switchPlayerTurn()
        checkWin(player)
    }
    // check for win condition or tie
    const checkWin = (activePlayer) => {
        let win = false
        const winConditions = [
			[0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
			[0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
			[0, 4, 8], [2, 4, 6], // Diagonals
		];

        for (let condition of winConditions) {
            let sum = condition.reduce((sum, index) => sum + board[index], 0)
            if (Math.abs(sum) === 3) {
                UIController.clearBoard()
                resetBoard()
                alert(`${activePlayer.name} wins!!`)
                win = true
            }
        }
        if (count === 9 && win === false) {
            alert (`It's a tie!!`)
        }
    }

    // const printBoard = () => {
	// 	let boardStr = '';
	// 	for (let i = 0; i <= 8; i++) {
	// 		let marker = board[i] === 1 ? 'x' : board[i] === -1 ? 'o' : '-'
	// 		if (i === 2 || i === 5) {
	// 			boardStr += marker + '\n'
	// 		} else {
	// 			boardStr += marker + ' '
	// 		}
	// 	}
	// 	const active = getActivePlayer();
	// };

    const resetBoard = () => {
        board = board.fill('-', 0)
        activePlayer = players[0]
    }
    
    return { switchPlayerTurn, getActivePlayer, takeTurn, players, board }
}

const game = GameController()

const UIController = (function () {
    const boardSquares = document.querySelectorAll('.squares');
    const currentPlayer = document.getElementById('current-player')
	function initializeBoard() {
		boardSquares.forEach(square => {
            square.addEventListener('click', function () {
                const active = game.getActivePlayer();
                updateBoard(this.id, active)
                updatePlayer(active)
				game.takeTurn(active, this.id);
			});
		});
	}

    function updateBoard(id, active) {
        if (active === game.players[0]) {
            document.getElementById(id).textContent = 'x'
        } else {
            document.getElementById(id).textContent = 'o'
        }
    }

    function updatePlayer(active) {
		currentPlayer.textContent = active === game.players[0] ? game.players[1].name : game.players[0].name
    }

    function clearBoard() {
        boardSquares.forEach(square => square.textContent = '')
        currentPlayer.textContent = 'Player One'
    }

	return {
		initializeBoard: initializeBoard,
        clearBoard: clearBoard,
	};
})();

// Call this when you want to set up the board
UIController.initializeBoard();