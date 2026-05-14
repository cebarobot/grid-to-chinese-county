import L from 'leaflet';

const tileProviderConfig = __GRID_TO_CHINESE_COUNTY_TILE_PROVIDER_CONFIG__;

export interface TileProviderState {
  layers: L.TileLayer[];
}

export function getTileProviderState(): TileProviderState {
  return {
    layers: tileProviderConfig.layers.map((layer) =>
      L.tileLayer(layer.url, {
        maxZoom: layer.maxZoom,
        ...(layer.subdomains === undefined ? {} : { subdomains: layer.subdomains }),
        ...(layer.attribution === undefined ? {} : { attribution: layer.attribution })
      })
    )
  };
}

export function createTileLayers(): L.TileLayer[] {
  return getTileProviderState().layers;
}
