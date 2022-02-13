/*
 * Rogue 
 * Copyright (c) 2021 Olivier Nocent
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 * 
 * -----------------------------------------------------------------------------
 * A camera is used by a renderer to choose the blocks of a map to display
 * within the viewport.
 *
 * A camera is centered on an entity and defines a rectangular area of
 * (2 * viewportHalfWidth + 1) by (2 * viewportHalfHeight + 1) blocks.
 * 
 */
class Camera {
  constructor(viewportHalfWidth, viewportHalfHeight) {
    this.viewportHalfWidth = viewportHalfWidth;
    this.viewportHalfHeight = viewportHalfHeight;
  }

  attachTo(entity) {
    this.entity = entity;
  }

  positionOnMap() {
    return { 'x': 2 * (this.entity.x - 1) + 1, 'y': 2 * (this.entity.y - 1) + 1 };
  }
}