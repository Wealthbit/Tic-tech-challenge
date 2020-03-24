document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('.block')
  const game = setupGame('x', blocks)
  document.querySelector('#current-player').innerHTML = 'x'

  for (const [blockIndex, block] of blocks.entries()) {
    block.onclick = blockClickFunction(blockIndex, game)
  }
})

const blockClickFunction = (blockIndex, game) => async () => {
  if (!game().gameOver) {
    game().markBlock(blockIndex)
    await game().aiMove()
  }
  updateUi(game)
}

const setupGame = (startingPlayer, blocks) => {
  let gameObject = {
    currentPlayer: startingPlayer,
    gameOver: false,
    board: [null, null, null, null, null, null, null, null, null],
    blocks,
    markBlock,
    checkWin,
    togglePlayer,
    playerWon,
    aiMove
  }
  return () => gameObject
}

function markBlock (index) {
  if (!this.gameOver && !this.board[index]) {
    this.blocks[index].classList.add(this.currentPlayer)

    this.board[index] = this.currentPlayer
    this.togglePlayer()
  }
  this.checkWin()
}

function checkWin () {
  const WIN_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  WIN_CONDITIONS.forEach((winCondition) => {
    winCondition.every((blockIndex) => this.board[blockIndex] === 'x') && this.playerWon('x')
    winCondition.every((blockIndex) => this.board[blockIndex] === 'o') && this.playerWon('o')
  })
}

function togglePlayer () {
  console.log('toggling player', this.currentPlayer)
  if (this.currentPlayer === 'x') {
    this.currentPlayer = 'o'
  } else {
    this.currentPlayer = 'x'
  }
}

function playerWon (player) {
  this.togglePlayer()
  this.gameOver = true
  this.winningPlayer = player
}

async function aiMove () {
  if (!this.gameOver) {
    const res = await fetch(
    'http://127.0.0.1:5000/', { method: 'POST', body: JSON.stringify(this.board) })
    const move = await res.text()
    this.markBlock(parseInt(move))
  }
}

const updateUi = (game) => {
  if (!game().gameOver) {
    document.querySelector('#current-player').innerHTML = game().currentPlayer
  } else {
    document.querySelector('#current-player-state').innerHTML = `Player ${game().currentPlayer} won!`
  }
}
