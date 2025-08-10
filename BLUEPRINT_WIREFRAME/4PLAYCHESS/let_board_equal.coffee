let board = [
  [null, null, null, null, { type: 'rook', color: 'gold' }, null, null, { type: 'king', color: 'gold' }, { type: 'queen', color: 'gold' }, null, null, { type: 'rook', color: 'gold' }, null, null, null, null],
  [null, null, null, null, { type: 'pawn', color: 'gold' }, null, null, { type: 'bishop', color: 'gold' }, { type: 'bishop', color: 'gold' }, null, null, { type: 'pawn', color: 'gold' }, null, null, null, null],
  [null, null, null, null, null, { type: 'pawn', color: 'gold' }, { type: 'knight', color: 'gold' }, null, null, { type: 'knight', color: 'gold' }, { type: 'pawn', color: 'gold' }, null, null, null, null, null],
  [null, null, null, null, null, null, { type: 'pawn', color: 'gold' }, null, null, { type: 'pawn', color: 'gold' }, null, null, null, null, null, null],
  [{ type: 'rook', color: 'black' }, { type: 'pawn', color: 'black' }, null, null, null, null, null, { type: 'pawn', color: 'gold' }, { type: 'pawn', color: 'gold' }, null, null, null, null, null, { type: 'pawn', color: 'green' }, { type: 'rook', color: 'green' }],
  [null, null, { type: 'pawn', color: 'black' }, null, null, null, null, null, null, null, null, null, null, { type: 'pawn', color: 'green' }, null, null],
  [null, null, { type: 'knight', color: 'black' }, { type: 'pawn', color: 'black' }, null, null, null, null, null, null, null, null, { type: 'pawn', color: 'green' }, { type: 'knight', color: 'green' }, null, null],
  [{ type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, null, null, { type: 'pawn', color: 'black' }, null, null, null, null, null, null, { type: 'pawn', color: 'green' }, null, null,{ type: 'bishop', color: 'green' }, { type: 'king', color: 'green' }],
  [{ type: 'queen', color: 'black' }, { type: 'bishop', color: 'black' }, null, null, { type: 'pawn', color: 'black' }, null, null, null, null, null, null, { type: 'pawn', color: 'green' }, null, null, { type: 'bishop', color: 'green' }, { type: 'queen', color: 'green' }],
  [null, null, { type: 'knight', color: 'black' }, { type: 'pawn', color: 'black' }, null, null, null, null, null, null, null, null, { type: 'pawn', color: 'green' }, { type: 'knight', color: 'green' }, null, null],
  [null, null, { type: 'pawn', color: 'black' }, null, null, null, null, null, null, null, null, null, null, { type: 'pawn', color: 'green' }, null, null],
  [{ type: 'rook', color: 'black' }, { type: 'pawn', color: 'black' }, null, null, null, null, null, { type: 'pawn', color: 'red' }, { type: 'pawn', color: 'red' }, null, null, null, null, null, { type: 'pawn', color: 'green' }, { type: 'rook', color: 'green' }],
  [null, null, null, null, null, null, { type: 'pawn', color: 'red' }, null, null, { type: 'pawn', color: 'red' }, null, null, null, null, null, null],
  [null, null, null, null, null, { type: 'pawn', color: 'red' }, { type: 'knight', color: 'red' },  null, null, { type: 'knight', color: 'red' }, { type: 'pawn', color: 'red' }, null, null, null, null, null],
  [null, null, null, null, { type: 'pawn', color: 'red' }, null, null, { type: 'bishop', color: 'red' }, { type: 'bishop', color: 'red' }, null, null, { type: 'pawn', color: 'red' }, null, null, null, null],
  [null, null, null, null, { type: 'rook', color: 'red' }, null, null, { type: 'king', color: 'red' }, { type: 'queen', color: 'red' }, null, null, { type: 'rook', color: 'red' }, null, null, null, null]
];