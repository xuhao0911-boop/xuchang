const paths=[
 '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/>',
 '<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 1v4m6-4v4M9 19v4m6-4v4M1 9h4m-4 6h4m14-6h4m-4 6h4M9 9h6v6H9z"/>',
 '<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M9 9h.01M15 9h.01"/>',
 '<circle cx="5" cy="5" r="3"/><circle cx="19" cy="19" r="3"/><path d="M8 5h8a4 4 0 0 1 0 8H8a4 4 0 0 0 0 8h8"/>',
 '<path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1C-1 10 7 17 12 21c5-4 13-11 8-16Z"/><path d="M7 12h3l2-4 2 8 2-4h3"/>',
 '<path d="M20 3C9 2 2 7 4 14c2 7 14 8 16-11Z"/><path d="M4 21 16 9M9 16v-5m0 5h5"/>',
 '<path d="M3 21h18M5 21V9h14v12M9 21v-7a3 3 0 0 1 6 0v7M3 9l9-6 9 6M8 5V2m8 3V2"/>',
 '<path d="M12 22V11M12 15C3 16 2 9 3 5c7-1 10 4 9 10ZM12 11c0-7 5-10 9-9 1 6-2 10-9 9Z"/>',
 '<path d="M4 4h16M4 12h16M4 20h16"/><circle cx="8" cy="4" r="2" fill="var(--paper)"/><circle cx="16" cy="12" r="2" fill="var(--paper)"/><circle cx="10" cy="20" r="2" fill="var(--paper)"/>'
];
export const topicIcon=i=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[i%paths.length]}</svg>`;
export function cityOutline(geo,esc){
 if(!geo)return '';
 const pts=geo.features.flatMap(f=>f.geometry.type==='MultiPolygon'?f.geometry.coordinates.flat(2):f.geometry.coordinates.flat());
 const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),ls=Math.cos((y0+y1)/2*Math.PI/180),k=Math.min(330/((x1-x0)*ls),300/(y1-y0));
 const project=([x,y])=>[210+(x-(x0+x1)/2)*ls*k,205-(y-(y0+y1)/2)*k];
 const colors=['#DFE6ED','#C9D5E1','#D7E0E8','#BBCBDC','#D1DCE6','#C3D1DF'];
 const shapes=geo.features.map((f,i)=>{const polys=f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[f.geometry.coordinates];const d=polys.map(p=>p.map(r=>r.map((v,j)=>`${j?'L':'M'}${project(v).map(n=>n.toFixed(2)).join(',')}`).join(' ')+'Z').join(' ')).join(' ');return `<path d="${d}" fill="${colors[i]}"/>`}).join('');
 const labels=geo.features.map(f=>{const p=project(f.properties.centroid||f.properties.center),n=f.properties.name,offset=n==='魏都区'?[36,0]:n==='建安区'?[0,26]:[0,4];return `<text x="${p[0]+offset[0]}" y="${p[1]+offset[1]}" text-anchor="middle">${esc(n)}</text>`}).join('');
 return `<svg class="hero-outline" viewBox="0 0 420 410" aria-label="许昌六个县市区行政轮廓示意" role="img"><defs><pattern id="hero-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#E2E6EB" stroke-width=".6"/></pattern></defs><circle cx="210" cy="205" r="178" fill="url(#hero-grid)"/><circle cx="210" cy="205" r="178" fill="none" stroke="#D3DBE4" stroke-width=".7"/><circle cx="210" cy="205" r="132" fill="none" stroke="#DCE3EA" stroke-width=".5" stroke-dasharray="2 6"/><g class="hero-geo">${shapes}</g><g class="hero-geo-labels">${labels}</g><path d="M210 14v12m0 358v12M19 205h12m358 0h12" stroke="#8197AE"/><text class="north" x="210" y="8" text-anchor="middle">N</text></svg>`;
}
