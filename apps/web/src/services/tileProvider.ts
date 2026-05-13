import L from 'leaflet';

const TIANDITU_SUBDOMAINS = ['0', '1', '2', '3', '4', '5', '6', '7'];

function getTiandituToken(): string | null {
  const token = import.meta.env.VITE_TIANDITU_TOKEN?.trim();

  return token === undefined || token.length === 0 ? null : token;
}

export function getTiandituWarning(): string | null {
  return getTiandituToken() === null
    ? '未配置 VITE_TIANDITU_TOKEN，当前只显示命中的县边界与网格方框。'
    : null;
}

export function createTiandituLayers(): L.TileLayer[] {
  const token = getTiandituToken();

  if (token === null) {
    return [];
  }

  return [
    L.tileLayer(`https://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${token}`, {
      subdomains: TIANDITU_SUBDOMAINS,
      attribution: 'Tianditu'
    }),
    L.tileLayer(`https://t{s}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${token}`, {
      subdomains: TIANDITU_SUBDOMAINS,
      attribution: 'Tianditu'
    })
  ];
}
