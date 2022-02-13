/*
 * Rogue 
 * Copyright (c) 2021 Olivier Nocent
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 * 
 * -----------------------------------------------------------------------------
 * A map is the numerical representation of a maze  
 *
 * a 4-wall maze cell is represented by 9 blocks
 * in the associated map.
 * 
 *  +---+        15 17 15
 *  |   |   =>   16 00 16
 *  +---+        15 17 15
 * 
 * A renderer then uses the numerical values in the map
 * to display the corresponding element (character in
 * ASCII mode, sprite, ...) 
 *
 */
class Map {
  constructor(maze) {
    this.mazeCol = maze.col;
    this.mazeRow = maze.col;
    this.col = maze.col * 2 + 1;
    this.row = maze.row * 2 + 1;
    this.grid = new Array(this.col * this.row);
    this.grid.fill(0);

    for (let x = 1; x <= maze.col; x++)
      this.addWall(maze, 'N', x, 1);

    for (let y = 1; y <= maze.row; y++) {
      this.addWall(maze, 'W', 1, y);

      for (let x = 1; x <= maze.col; x++) {
        if (maze.cell(x, y).wall['E']) this.addWall(maze, 'E', x, y);
        if (maze.cell(x, y).wall['S']) this.addWall(maze, 'S', x, y);
      }
    }
  }

  value(X, Y) {
    return this.grid[Y * this.col + X];
  }

  getCellContent(x, y) {
    let X = 2 * (x - 1) + 1;
    let Y = 2 * (y - 1) + 1;

    return this.grid[Y * this.col + X];
  }

  setCellContent(x, y, value) {
    let X = 2 * (x - 1) + 1;
    let Y = 2 * (y - 1) + 1;

    this.grid[Y * this.col + X] = value;
  }

  randomLocation() {
    let x = Math.floor(Math.random() * this.mazeCol) + 1;
    let y = Math.floor(Math.random() * this.mazeRow) + 1;
    while (this.getCellContent(x, y) !== 0) {
      x = Math.floor(Math.random() * this.mazeCol) + 1;
      y = Math.floor(Math.random() * this.mazeRow) + 1;
    }

    return { 'x': x, 'y': y };
  }

  addWall(maze, direction, x, y) {
    switch (direction) {
      case 'N':
        this.addCorner(maze, x, y, 'UL');
        this.addHorizontalPart(x, y, 'U');
        this.addCorner(maze, x, y, 'UR');
        break;
      case 'E':
        this.addCorner(maze, x, y, 'UR');
        this.addVerticalPart(x, y, 'R');
        this.addCorner(maze, x, y, 'LR');
        break;
      case 'S':
        this.addCorner(maze, x, y, 'LL');
        this.addHorizontalPart(x, y, 'L');
        this.addCorner(maze, x, y, 'LR');
        break;
      case 'W':
        this.addCorner(maze, x, y, 'UL');
        this.addVerticalPart(x, y, 'L');
        this.addCorner(maze, x, y, 'LL');
    }
  }

  /*
   * The shape of a corner depends on the neighbouring
   * walls in the 4 directions. The corner index is 
   * computed from the bits in the binary representation
   * with the following convention : [ N E S W ]
   *
   * For example, a corner with a wall at North and East
   * will have an index equal to [ 1 1 0 0 ] = 12.
   * 
   * [ 0 0 0 1 ] = 1   =>  ─ 
   * [ 0 0 1 0 ] = 2   =>  │ 
   * [ 0 0 1 1 ] = 3   =>  ┐ 
   * [ 0 1 0 0 ] = 4   =>  ─ 
   * [ 0 1 0 1 ] = 5   =>  ─ 
   * [ 0 1 1 0 ] = 6   =>  ┌ 
   * [ 0 1 1 1 ] = 7   =>  ┬ 
   * [ 1 0 0 0 ] = 8   =>  │ 
   * [ 1 0 0 1 ] = 9   =>  ┘ 
   * [ 1 0 1 0 ] = 10  =>  │ 
   * [ 1 0 1 1 ] = 11  =>  ┤ 
   * [ 1 1 0 0 ] = 12  =>  └ 
   * [ 1 1 0 1 ] = 13  =>  ┴ 
   * [ 1 1 1 0 ] = 14  =>  ├ 
   * [ 1 1 1 1 ] = 15  =>  ┼ 
   *
   * The location parameter can be:
   *  - UL for Upper Left
   *  - UR for Upper Right
   *  - LL for Lower Left
   *  - LR for Lower Right
   */
  addCorner(maze, x, y, location) {
    // Computes the (X,Y) coordinates of the cell center in the map
    let X = 2 * (x - 1) + 1;
    let Y = 2 * (y - 1) + 1;

    // Computes the corner index according to its location and its
    // neighbourhood
    let cornerIndex = 0;

    switch (location) {
      case 'UL':
        X -= 1; Y -= 1;
        if (y > 1 && maze.cell(x, y - 1).wall['W']) cornerIndex += 8;
        if (maze.cell(x, y).wall['N']) cornerIndex += 4;
        if (maze.cell(x, y).wall['W']) cornerIndex += 2;
        if (x > 1 && maze.cell(x - 1, y).wall['N']) cornerIndex += 1;
        break;
      case 'UR':
        X += 1; Y -= 1;
        if (y > 1 && maze.cell(x, y - 1).wall['E']) cornerIndex += 8;
        if (x < maze.col && maze.cell(x + 1, y).wall['N']) cornerIndex += 4;
        if (maze.cell(x, y).wall['E']) cornerIndex += 2;
        if (maze.cell(x, y).wall['N']) cornerIndex += 1;
        break;
      case 'LL':
        X -= 1; Y += 1;
        if (maze.cell(x, y).wall['W']) cornerIndex += 8;
        if (maze.cell(x, y).wall['S']) cornerIndex += 4;
        if (y < maze.row && maze.cell(x, y + 1).wall['W']) cornerIndex += 2;
        if (x > 1 && maze.cell(x - 1, y).wall['S']) cornerIndex += 1;
        break;
      case 'LR':
        X += 1; Y += 1;
        if (maze.cell(x, y).wall['E']) cornerIndex += 8;
        if (x < maze.col && maze.cell(x + 1, y).wall['S']) cornerIndex += 4;
        if (y < maze.row && maze.cell(x, y + 1).wall['E']) cornerIndex += 2;
        if (maze.cell(x, y).wall['S']) cornerIndex += 1;
        break;
    }

    this.grid[Y * this.col + X] = cornerIndex;
  }

  addVerticalPart(x, y, location) {
    let X = 2 * (x - 1) + 1;
    let Y = 2 * (y - 1) + 1;

    switch (location) {
      case 'L': X -= 1; break;
      case 'R': X += 1; break;
    }

    this.grid[Y * this.col + X] = 16;
  }

  addHorizontalPart(x, y, location) {
    let X = 2 * (x - 1) + 1;
    let Y = 2 * (y - 1) + 1;

    switch (location) {
      case 'U': Y -= 1; break;
      case 'L': Y += 1; break;
    }

    this.grid[Y * this.col + X] = 17;
  }

  removeWall(maze, direction, x, y) {
    let X = 2 * (x - 1) + 1;
    let Y = 2 * (y - 1) + 1;

    switch (direction) {
      case 'N':
        this.addCorner(maze, x, y, 'UL');
        this.removeHorizontalPart(x, y, 'U');
        this.addCorner(maze, x, y, 'UR');
        break;
      case 'E':
        this.addCorner(maze, x, y, 'UR');
        this.removeVerticalPart(x, y, 'R');
        this.addCorner(maze, x, y, 'LR');
        break;
      case 'S':
        this.addCorner(maze, x, y, 'LL');
        this.removeHorizontalPart(x, y, 'L');
        this.addCorner(maze, x, y, 'LR');
        break;
      case 'W':
        this.addCorner(maze, x, y, 'UL');
        this.removeVerticalPart(x, y, 'L');
        this.addCorner(maze, x, y, 'LL');
    }
  }

  removeVerticalPart(x, y, location) {
    let X = 2 * (x - 1) + 1;
    let Y = 2 * (y - 1) + 1;

    switch (location) {
      case 'L': X -= 1; break;
      case 'R': X += 1; break;
    }

    this.grid[Y * this.col + X] = 0;
  }

  removeHorizontalPart(x, y, location) {
    let X = 2 * (x - 1) + 1;
    let Y = 2 * (y - 1) + 1;

    switch (location) {
      case 'U': Y -= 1; break;
      case 'L': Y += 1; break;
    }

    this.grid[Y * this.col + X] = 0;
  }

  toString() {
    let string = '';

    for (let Y = 0; Y < this.row; Y++) {
      for (let X = 0; X < this.col; X++) {
        if (this.grid[Y * this.col + X] < 10) string += '0';
        string += this.grid[Y * this.col + X] + ' ';
      }

      string += '\n';
    }

    return string;
  }
}
