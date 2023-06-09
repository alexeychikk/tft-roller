import { times } from 'lodash-es';
import { Unit } from './Unit';

export type Coords = { x: number; y: number };

export class UnitsGrid {
  readonly width: number;
  readonly height: number;

  /**
   * [
   *  [0,0,0,0,0,0,0],
   *  [0,0,0,0,0,0,0],
   *  [0,0,0,0,0,0,0],
   *  [0,0,0,0,0,0,0],
   * ]
   */
  private units: (Unit | undefined)[][];

  constructor(options: {
    width: number;
    height: number;
    units?: (Unit | undefined)[][];
  }) {
    this.width = options.width;
    this.height = options.height;
    this.units =
      options.units ??
      times(this.height, () => times(this.width, () => undefined));
  }

  get isFull(): boolean {
    return !this.getFirstEmptySlot();
  }

  getFirstEmptySlot(): Coords | undefined {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.units[y][x] === undefined) return { x, y };
      }
    }
  }

  getUnit(coords: Coords): Unit | undefined {
    return this.units[coords.y][coords.x];
  }

  setUnit(coords: Coords, unit: Unit | undefined): UnitsGrid {
    const grid = new UnitsGrid({
      height: this.height,
      width: this.width,
      units: this.units.slice(),
    });
    grid.units[coords.y] = grid.units[coords.y].slice();
    grid.units[coords.y][coords.x] = unit;
    return grid;
  }

  moveUnit(from: Coords, to: Coords): UnitsGrid {
    const fromUnit = this.getUnit(from);
    if (!fromUnit) return this;

    const toUnit = this.getUnit(to);
    const newGrid = this.setUnit(to, fromUnit);

    if (toUnit) {
      return newGrid.setUnit(from, toUnit);
    }
    return newGrid.setUnit(from, undefined);
  }

  upgradeUnit(coords: Coords): UnitsGrid {
    const unit = this.getUnit(coords);
    if (!unit) {
      throw new Error(`Unit at coords ${coords.x},${coords.y} does not exist!`);
    }
    return this.setUnit(coords, unit.upgrade());
  }

  removeUnits(coords: Coords[]): UnitsGrid {
    let grid: UnitsGrid = this;
    coords.forEach((c) => {
      grid = grid.setUnit(c, undefined);
    });
    return grid;
  }

  getCoordsOfUnitsOfStars(
    name: string,
    numUnits: number,
    stars: number,
  ): Coords[] {
    let coords: Coords[] = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (
          this.units[y][x]?.name !== name ||
          this.units[y][x]?.stars !== stars
        ) {
          continue;
        }
        coords.push({ x, y });
        if (coords.length === numUnits) {
          return coords;
        }
      }
    }

    return coords;
  }
}
