/*
 * Rogue 
 * Copyright (c) 2021 Olivier Nocent
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 * 
 * -----------------------------------------------------------------------------
 * A renderer is in charge of displaying a map on a given surface.
 * 
 */ 
 

/*
 * 0   =>  empty cell
 * 1   =>  ─   \ 
 * 2   =>  │   |
 * 3   =>  ┐   |
 * 4   =>  ─   |
 * 5   =>  ─   |
 * 6   =>  ┌   |
 * 7   =>  ┬   |
 * 8   =>  │    \
 * 9   =>  ┘    /  corners
 * 10  =>  │   |
 * 11  =>  ┤   |
 * 12  =>  └   |
 * 13  =>  ┴   |
 * 14  =>  ├   |
 * 15  =>  ┼   /
 * 16  =>  vertical wall
 * 17  =>  horizontal wall
 * 18  =>  portal
 * 19  =>  heart (stamina)
 * 20  =>  gem
 * 21  =>  magic ring
 * 22  =>  sword
 * 23  =>  magic sword
 * 24  =>  player
 * 25  =>  monster
 * 26  =>  bones
 * 27  =>  pebble
 */
class Renderer {
  constructor() { }
}

class TextRenderer extends Renderer {
  constructor() {
    super();

    this.tile = [
      ' ',
      '+',
      '+',
      '+',
      '+',
      '+',
      '+',
      '+',
      '+',
      '+',
      '+',
      '+',
      '+',
      '+',
      '+',
      '+',
      '|',
      '---',
      ' <span id="portal">&blk14;</span> ',
      ' <span class="heart">&hearts;</span> ',
      ' <span class="gem">&diams;</span> ',
      ' <span class="ring">o</span> ',
      ' <span class="sword">†</span> ',
      ' <span class="magic-sword">†</span> ',
      ' <span id="player">@</span> ',
      ' <span class="monster">§</span> ',
      ' <span class="bones">X</span> ',
      ' <span class="pebble">.</span> '
    ];
  }

  render(map, camera, surface) {
    let position = camera.positionOnMap();

    let Xmin = Math.max(0, position.x - camera.viewportHalfWidth);
    let Xmax = Math.min(map.col - 1, position.x + camera.viewportHalfWidth);
    let Ymin = Math.max(0, position.y - camera.viewportHalfHeight);
    let Ymax = Math.min(map.row - 1, position.y + camera.viewportHalfHeight);

    let string = '';

    for (let Y = Ymin; Y <= Ymax; Y++) {
      for (let X = Xmin; X <= Xmax; X++) {
        // Compute opacity according to the distance from the camera
        let dx = position.x - X;
        let dy = position.y - Y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let opacity = Math.max(0, 1 - distance / (camera.viewportHalfWidth - 1));

        let value = map.value(X, Y);

        string += `<span style="opacity: ${opacity}">${this.tile[value]}`;
        if ((value === 0) && (X % 2 === 1)) string += '  ';
        string += '</span>';
      }

      string += '\n';
    }

    surface.innerHTML = string;
  }
}
