import * as PIXI from "pixi.js";
import map from "../public/tilemap.json";

// Very simple state storage because who needs classes in javascript?
let mapInfo = {
  numXTiles: map.width,
  numYTiles: map.height,
  tileSize: {
    x: map.tilewidth,
    y: map.tileheight
  },
  pixelSize: {
    x: map.width * map.tilewidth,
    y: map.height * map.tileheight
  }
};

let tilesets: any[] = [];

const getTileInfo = (tileId: number) => {
  let i = 0;

  // Find the correct tileset
  // E.g. tileIndex 167 means atlas (tileset) with firstgid 1 and tile position 166
  while (tilesets[i] && tilesets[i].firstgid <= tileId) {
    i += 1;
  }

  let setForTile = tilesets[i - 1];

  // Get the local index of the tile
  let localIndex = tileId - setForTile.firstgid;

  // calculate the X and Y coords
  let localTileX = Math.floor(localIndex % setForTile.numXTiles);
  let localTileY = Math.floor(localIndex / setForTile.numXTiles);

  return {
    name: setForTile.name,
    tile: {
      x: localTileX * mapInfo.tileSize.x,
      y: localTileY * mapInfo.tileSize.y
    }
  };
};

const load = (loader: PIXI.Loader) => {
  map.tilesets.forEach(tileset => {
    // fix image path because Tiled.app adds \| as path separators
    loader.add(tileset.name, tileset.image.replace("\\/", "/"));

    tilesets.push({
      firstgid: tileset.firstgid,
      name: tileset.name,
      imageheight: tileset.imageheight,
      imagewidth: tileset.imagewidth,
      numXTiles: Math.floor(tileset.imagewidth / mapInfo.tileSize.x),
      numYTiles: Math.floor(tileset.imageheight / mapInfo.tileSize.y)
    });
  });

  loader.on("complete", () => {
    console.log("tilesets loaded!");
  });
};

export const drawMap = (app: PIXI.Application, resources) => {
  map.layers.forEach((layer, layerIndex) => {
    let spriteLayer = new PIXI.Container();

    // Only render tileLayers, Object layers etc are not renderable
    if (layer.type === "tilelayer") {
      layer.data.forEach((tileId, tileIndex) => {
        if (tileId !== 0) {
          const tileInfo = getTileInfo(tileId);

          let worldX =
            Math.floor(tileIndex % mapInfo.numXTiles) * mapInfo.tileSize.x;
          let worldY =
            Math.floor(tileIndex / mapInfo.numXTiles) * mapInfo.tileSize.y;

          let texture: PIXI.Texture = resources[tileInfo.name].texture.clone();

          //Create a rectangle object that defines the position and
          //size of the sub-image you want to extract from the texture
          let rectangle = new PIXI.Rectangle(
            tileInfo.tile.x,
            tileInfo.tile.y,
            mapInfo.tileSize.x,
            mapInfo.tileSize.y
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
