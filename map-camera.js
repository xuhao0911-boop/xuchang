export const featurePoints=f=>f.geometry.type==='MultiPolygon'?f.geometry.coordinates.flat(2):f.geometry.coordinates.flat();
export function createProjection(geo,{width=820,height=540,padding=60}={}){
 const pts=geo.features.flatMap(featurePoints),xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
 const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),ls=Math.cos((y0+y1)/2*Math.PI/180),scale=Math.min((width-padding*2)/((x1-x0)*ls),(height-padding*2)/(y1-y0));
 return ([x,y])=>[width/2+(x-(x0+x1)/2)*ls*scale,height/2-(y-(y0+y1)/2)*scale];
}
export function featureBounds(f,project){const p=featurePoints(f).map(project),xs=p.map(p=>p[0]),ys=p.map(p=>p[1]);return [Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)];}
export function fitCamera(bounds,{width=820,height=540,padding=62,minZoom=.8,maxZoom=12}={}){
 const [x0,y0,x1,y1]=bounds,w=Math.max(1,x1-x0),h=Math.max(1,y1-y0),zoom=Math.max(minZoom,Math.min(maxZoom,(width-padding*2)/w,(height-padding*2)/h));
 return {zoom,panX:(width/2-(x0+x1)/2)*zoom,panY:(height/2-(y0+y1)/2)*zoom};
}
export const screenPoint=([x,y],camera,{width=820,height=540}={})=>[width/2+camera.panX+(x-width/2)*camera.zoom,height/2+camera.panY+(y-height/2)*camera.zoom];
