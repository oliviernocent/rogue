/*
 * Rogue 
 * Copyright (c) 2021 Olivier Nocent
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 * 
 * -----------------------------------------------------------------------------
 * Maze is the logical representation of a labyrinth embedding algorithms to
 * create perfect mazes.
 * 
 */


/*
 * clone of the Python choice function:
 * pick randomly a value in an array
 *
 */
function choice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/*
 * A square cell at (x,y) with four walls oriented to
 * North (N), East (E), South (S) and West (W)
 *
 */
class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.wall = { 'N': true, 'E': true, 'S': true, 'W': true };
    this.visited = false;
    this.distance = 0;
  }
}

/*
 * A rectangular maze with 'col' columns and 'row' rows
 * 
 * The top-left cell is at (1,1) and the bottom-right cell
 * is at (col,row)
 * 
 */
class Maze {
  constructor(col, row) {
    this.col = col;
    this.row = row;
    this.grid = [];

    // Populates the grid with row * col cells
    for (let y = 1; y <= row; y++)
      for (let x = 1; x <= col; x++)
        this.grid.push(new Cell(x, y));
  }

  cell(x, y) {
    return this.grid[(y - 1) * this.col + (x - 1)];
  }

  removeWall(direction, x, y) {
    this.cell(x, y).wall[direction] = false;

    // Removes neighbouring walls if any
    switch (direction) {
      case 'N':
        if (y > 1) this.cell(x, y - 1).wall['S'] = false;
        break;
      case 'E':
        if (x < this.col) this.cell(x + 1, y).wall['W'] = false;
        break;
      case 'S':
        if (y < this.row) this.cell(x, y + 1).wall['N'] = false;
        break;
      case 'W':
        if (x > 1) this.cell(x - 1, y).wall['E'] = false;
    }
  }

  binaryTree() {
    for (let i = 0; i < this.grid.length - 1; i++) {
      let cell = this.grid[i];

      if (cell.x === this.col)
        // This cell belongs to the last column
        this.removeWall('S', cell.x, cell.y);
      else
        // This cell belongs to the last row
        if (cell.y === this.row)
          this.removeWall('E', cell.x, cell.y);
        else
          this.removeWall(choice(['E', 'S']), cell.x, cell.y);
    }
  }

  sideWinder() {
    for (let y = 1; y < this.row; y++)
      for (let x = 1; x <= this.col; x++)
        if ((x !== this.col) && choice([true, false]))
          this.removeWall('E', x, y);
        else {
          let listX = [x];
          let prevX = x;
          while (!this.cell(prevX, y).wall['W']) {
            prevX -= 1;
            listX.push(prevX);
          }
          this.removeWall('S', choice(listX), y);
        }

    // Processes the last row apart
    for (let x = 1; x < this.col; x++)
      this.removeWall('E', x, this.row);
  }

  backTracker() {
    let x = Math.floor(Math.random() * this.col) + 1;
    let y = Math.floor(Math.random() * this.row) + 1;

    let cell = this.cell(x, y);
    cell.visited = true;
    let cellStack = [cell];

    while (cellStack.length !== 0) {
      let neighbour = [];
      if (cell.y > 1 && !this.cell(cell.x, cell.y - 1).visited) neighbour.push('N');
      if (cell.x < this.col && !this.cell(cell.x + 1, cell.y).visited) neighbour.push('E');
      if (cell.y < this.row && !this.cell(cell.x, cell.y + 1).visited) neighbour.push('S');
      if (cell.x > 1 && !this.cell(cell.x - 1, cell.y).visited) neighbour.push('W');

      if (neighbour.length > 0) {
        let chosenNeighbour = choice(neighbour);
        switch (chosenNeighbour) {
          case 'N':
            this.removeWall('N', cell.x, cell.y);
            this.cell(cell.x, cell.y - 1).visited = true;
            cellStack.push(this.cell(cell.x, cell.y - 1));
            break;
          case 'E':
            this.removeWall('E', cell.x, cell.y);
            this.cell(cell.x + 1, cell.y).visited = true;
            cellStack.push(this.cell(cell.x + 1, cell.y));
            break;
          case 'S':
            this.removeWall('S', cell.x, cell.y);
            this.cell(cell.x, cell.y + 1).visited = true;
            cellStack.push(this.cell(cell.x, cell.y + 1));
            break;
          case 'W':
            this.removeWall('W', cell.x, cell.y);
            this.cell(cell.x - 1, cell.y).visited = true;
            cellStack.push(this.cell(cell.x - 1, cell.y));
            break;
        }
      }
      else
        cell = cellStack.pop();
    }

    // Resets visited value of each cell 
    for (let i = 0; i < this.grid.length; i++) this.grid[i].visited = false;
  }

  neighboursOf(x, y) {
    let neighbourList = [];

    if (!this.cell(x, y).wall['N']) neighbourList.push(this.cell(x, y - 1));
    if (!this.cell(x, y).wall['E']) neighbourList.push(this.cell(x + 1, y));
    if (!this.cell(x, y).wall['S']) neighbourList.push(this.cell(x, y + 1));
    if (!this.cell(x, y).wall['W']) neighbourList.push(this.cell(x - 1, y));

    return neighbourList;
  }

  /*
   * Computes distance to each cell from (x,y)
   *
   */
  computeDistanceFrom(x, y) {
    // Resets distance values
    for (let cell of this.grid) {
      cell.distance = 0;
      cell.visited = false;
    }

    this.cell(x, y).visited = true;
    let cellsToProcess = [this.cell(x, y)];

    while (cellsToProcess.length > 0) {
      let cell = cellsToProcess.shift();

      let neighbourList = this.neighboursOf(cell.x, cell.y);
      for (let neighbour of neighbourList) {
        if (!neighbour.visited) {
          neighbour.visited = true;
          neighbour.distance = cell.distance + 1;
          cellsToProcess.push(neighbour);
        }
      }
    }
  }

  /*
   * Returns the cell at the given distance among the
   * neighbours of (x,y)
   *
   */
  cellAwayFrom(x, y, distance) {
    for (let cell of this.neighboursOf(x, y))
      if (cell.distance === distance) return cell;
  }

  /*
   * Computes the path from (srcX,srcY) to (dstX,dstY)
   * within the maze
   *
   */
  computePath(srcX, srcY, dstX = this.col, dstY = this.row) {
    this.computeDistanceFrom(dstX, dstY);

    let path = [];

    let currentCell = this.cell(srcX, srcY);
    while (currentCell.distance !== 0) {
      path.push({ x: currentCell.x, y: currentCell.y });
      currentCell = this.cellAwayFrom(currentCell.x, currentCell.y, --currentCell.distance);
    }

    return path;
  }

  /*
   * Stringifies a maze to display it in the console
   *
   */
  toString() {
    let string = '';

    for (let i = 0; i < this.col; i++)
      if (this.grid[i].wall['N'])
        string += '+---';
      else
        string += '+   ';

    string += '+\n';

    for (let y = 1; y <= this.row; y++) {
      if (this.cell(1, y).wall['W'])
        string += '|';
      else
        string += ' ';

      for (let x = 1; x <= this.col; x++)
        if (this.cell(x, y).wall['E'])
          string += '   |';
        else
          string += '    ';

      string += '\n+';

      for (let x = 1; x <= this.col; x++)
        if (this.cell(x, y).wall['S'])
          string += '---+';
        else
          string += '   +';

      string += '\n';
    }

    return string;
  }
}

