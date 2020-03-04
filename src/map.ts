import * as PIXI from "pixi.js";
import map from "../public/tilemap.json";
import { Vec2 } from "planck-js";

export class TileSize{
  /**
   * Width of a tile in number of pixels
   */
  pixelsWidth: number;
  /**
   * Height of a tile in number of pixels
   */
  pixelsHeight: number;

  constructor(pixelsWidth: number, pixelsHeight: number){
    this.pixelsWidth = pixelsWidth;
    this.pixelsHeight = pixelsHeight;
  }
}

export class Tile{
  id: any;
  /**Tile index on x-axis */
  x: number;
  /**Tile index on y-axis */
  y: number;
  
  constructor(id: any, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}

export class TileMap{
  /**
   * Map width in number of tiles
   */
  width: number;
  /**
   * Map height in number of tiles
   */
  height: number;
  /**
   * Size of one tile in pixels
   */
  tileSize: TileSize;
  /**
   * Map size in number of pixels
   */
  totalPixelSize: Vec2

  // TODO: Add class for tileset
  tilesets: any[] = [];

  constructor(map: any){
    this.width = map.width;
    this.height = map.height;
    this.tileSize = new TileSize(map.tilewidth, map.tileheight);
    this.totalPixelSize = new Vec2(this.width * this.tileSize.pixelsWidth, this.height * this.tileSize.pixelsHeight);

    this.setupTilesets(map);
  }

  private setupTilesets(map: any) {
    map.tilesets.forEach((tileset: {
      firstgid: any;
      name: any;
      imageheight: number;
      imagewidth: number;
    }) => {
      this.tilesets.push({
        firstgid: tileset.firstgid,
        name: tileset.name,
        imageheight: tileset.imageheight,
        imagewidth: tileset.imagewidth,
        numXTiles: Math.floor(tileset.imagewidth / this.tileSize.pixelsWidth),
        numYTiles: Math.floor(tileset.imageheight / this.tileSize.pixelsHeight),
        // fix image path because Tiled.app adds \| as path separators
        image: tileset.image.replace("\\/", "/")
      });
    });
  }

  getTileInfo(tileId: number){
    let i = 0;
  
    // Find the correct tileset
    // E.g. tileIndex 167 means atlas (tileset) with firstgid 1 and tile position 166
    while (this.tilesets[i] && this.tilesets[i].firstgid <= tileId) {
      i += 1;
    }
  
    let setForTile = this.tilesets[i - 1];
  
    // Get the local index of the tile
    let localIndex = tileId - setForTile.firstgid;
  
    // calculate the X and Y coords
    let localTileX = Math.floor(localIndex % setForTile.numXTiles);
    let localTileY = Math.floor(localIndex / setForTile.numXTiles);
  
    return new Tile(setForTile.name, localTileX * tileMap.tileSize.pixelsWidth, localTileY * tileMap.tileSize.pixelsHeight);
  };
} 

let tileMap = new TileMap(map);

const load = (loader: PIXI.Loader) => {
  tileMap.tilesets.forEach(tileset => {
    
    loader.add(tileset.name, tileset.image);
  });

  loader.on("complete", () => {
    console.log("tilesets loaded!");
  });
};

export const drawMap = (app: PIXI.Application, resources) => {
  // TODO: add layers to TileMap class, iterate through them
  map.layers.forEach((layer, layerIndex) => {
    let spriteLayer = new PIXI.Container();

    // Only render tileLayers, Object layers etc are not renderable
    if (layer.type === "tilelayer") {
      layer.data.forEach((tileId, tileIndex) => {
        if (tileId !== 0) {
          const tile = tileMap.getTileInfo(tileId);

          let worldX =
            Math.floor(tileIndex % tileMap.width) * tileMap.tileSize.pixelsWidth;
          let worldY =
            Math.floor(tileIndex / tileMap.width) * tileMap.tileSize.pixelsHeight;

          let texture: PIXI.Texture = resources[tile.id].texture.clone();

          //Create a rectangle object that defines the position and
          //size of the sub-image you want to extract from the texture
          let rectangle = new PIXI.Rectangle(
            tile.x,
            tile.y,
            tileMap.tileSize.pixelsWidth,
            tileMap.tileSize.pixelsHeight
          );

          //Tell the texture to use that rectangular section
          texture.frame = rectangle;

          //Create the sprite from the texture
          let sprite = new PIXI.Sprite(texture);

          // Place the texture in the world
          sprite.x = worldX;
          sprite.y = worldY;

          // Add sprite to the layer container
          spriteLayer.addChild(sprite);
        }
      });

      // Add the correct zIndex to the layer, based on index in layer array
      spriteLayer.zIndex = layerIndex;

      // render the entire layer on the stage
      app.stage.addChild(spriteLayer);
    }
  });
};

export default load;
