import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';

// Shared junctions keep adjacent illustrative polygons aligned. Coordinates are
// hand-traced approximations, not surveyed or official region boundaries.
const A=[-31.859,115.755], B=[-31.858,115.802], C=[-31.859,115.887], D=[-31.866,115.949];
const E=[-31.954,115.849], F=[-31.969,115.857], G=[-31.960,115.914], H=[-31.982,115.950];
const I=[-32.039,115.857], J=[-32.037,115.950], K=[-32.040,116.065];
const westRiver=[[-32.054,115.738],[-32.028,115.754],[-32.015,115.786],[-32.009,115.817],[-31.986,115.833],[-31.994,115.850],F];
const centralRiver=[F,[-31.957,115.872],[-31.959,115.891],G];
const eastRiver=[G,[-31.941,115.929],[-31.949,115.946],H];
const mitchell=[B,[-31.892,115.809],[-31.919,115.829],[-31.941,115.842],E];
const kwinana=[F,[-31.994,115.855],[-32.014,115.858],I];
const tonkin=[D,[-31.894,115.946],[-31.925,115.949],H,[-32.015,115.951],J];
const southTonkin=tonkin.slice(3);
const regions=[
 {name:'Perth North',color:'#c8aa69',description:'North of Reid Highway and west of Tonkin Highway.',points:[[-31.60,115.64],[-31.60,115.985],D,C,B,A]},
 {name:'Perth Central West',color:'#5a9d98',description:'North of Swan River, south of Reid Highway / North Beach Road and west of Mitchell Freeway. Previously labelled Central East in the source filename.',points:[A,B,...mitchell.slice(1),F,...westRiver.slice(0,-1).reverse(),[-31.95,115.745],[-31.90,115.750]]},
 {name:'Perth Central North',color:'#a3af77',description:'North of Swan River, south of Reid Highway, west of Tonkin Highway and east of Mitchell Freeway.',points:[B,D,...tonkin.slice(1,4),...eastRiver.slice(0,-1).reverse(),...centralRiver.slice(0,-1).reverse(),E,...mitchell.slice(1,-1).reverse()]},
 {name:'Perth East',color:'#ba8ab0',description:'North of Roe Highway and east of Tonkin Highway.',points:[[-31.60,115.985],[-31.60,116.25],[-32.025,116.25],K,[-32.044,116.01],J,...tonkin.slice(0,-1).reverse()]},
 {name:'Perth Central South',color:'#d08e6c',description:'South of Swan River, north of Roe Highway, east of Kwinana Freeway and west of Tonkin Highway.',points:[...centralRiver,...eastRiver.slice(1),...southTonkin.slice(1),[-32.044,115.91],I,...kwinana.slice(0,-1).reverse()]},
 {name:'Perth South West',color:'#7e9fc1',description:'South of Swan River and west of Kwinana Freeway.',points:[...westRiver,...kwinana.slice(1),[-32.40,115.818],[-32.40,115.65],[-32.20,115.69]]},
 {name:'Perth South East',color:'#c3a076',description:'South of Roe Highway and east of Kwinana Freeway.',points:[I,[-32.044,115.91],J,[-32.044,116.01],K,[-32.025,116.25],[-32.40,116.25],[-32.40,115.818]]}
];
const map=L.map('map',{zoomControl:false,scrollWheelZoom:true}).setView([-31.985,115.91],10);
L.control.zoom({position:'bottomright'}).addTo(map);
const tiles=L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',maxZoom:19}).addTo(map);
let tileWarning;
tiles.on('tileerror',()=>{if(!tileWarning){tileWarning=L.control({position:'topright'});tileWarning.onAdd=()=>{const el=L.DomUtil.create('div','tile-warning');el.textContent='Street tiles unavailable. Region overlays remain interactive.';return el;};tileWarning.addTo(map);}});
let selected=null;
const layers=[];const buttons=[];
function paint(active){layers.forEach((layer,i)=>{layer.setStyle({fillOpacity:active===null?.25:active===i?.55:.12,weight:active===i?3:1.5,color:active===i?'#24483f':regions[i].color});buttons[i].classList.toggle('active',active===i);buttons[i].setAttribute('aria-pressed',String(selected===i));});if(active!==null)layers[active].bringToFront();}
function detail(i){document.querySelector('#detail-label').textContent=i===null?'HOW TO EXPLORE':'REGION BOUNDARY';document.querySelector('#detail-title').textContent=i===null?'Start with a region':regions[i].name;document.querySelector('#detail-description').textContent=i===null?'Hover over the map or a region below. Click or tap to keep it selected.':regions[i].description;document.querySelector('#clear').hidden=selected===null;}
function highlight(i){paint(i);detail(i);}
function select(i){selected=selected===i?null:i;highlight(selected);}
regions.forEach((region,i)=>{
 const button=document.createElement('button');button.className='region';button.innerHTML=`<span class="swatch" style="--color:${region.color}"></span><span>${region.name.replace('Perth ','')}</span><span class="arrow">↗</span>`;button.setAttribute('aria-label',region.name);button.setAttribute('aria-pressed','false');document.querySelector('#regions').append(button);buttons.push(button);
 const layer=L.polygon(region.points,{color:region.color,fillColor:region.color,fillOpacity:.25,weight:1.5}).addTo(map).bindTooltip(region.name,{sticky:true,className:'region-tooltip'});layers.push(layer);
 layer.on('mouseover',()=>highlight(i)).on('mouseout',()=>highlight(selected)).on('click',()=>select(i));
 button.addEventListener('mouseenter',()=>highlight(i));button.addEventListener('mouseleave',()=>highlight(selected));button.addEventListener('focus',()=>highlight(i));button.addEventListener('blur',()=>highlight(selected));button.addEventListener('click',()=>select(i));
});
function road(points,name){L.polyline(points,{color:'#53665f',weight:2,dashArray:'5 6',opacity:.7,interactive:false}).addTo(map);L.marker(points[Math.floor(points.length/2)],{icon:L.divIcon({className:'road-label',html:name,iconSize:[120,20]}),interactive:false}).addTo(map);}
road([A,B,C,D],'REID HIGHWAY');road(mitchell,'MITCHELL FWY');road(kwinana,'KWINANA FWY');road(tonkin,'TONKIN HIGHWAY');road([I,[-32.044,115.91],J,[-32.044,116.01],K],'ROE HIGHWAY');
L.polyline([...westRiver,...centralRiver.slice(1),...eastRiver.slice(1)],{color:'#74afc4',weight:3,opacity:.8,interactive:false}).addTo(map);
L.marker([-31.953,115.858],{icon:L.divIcon({className:'city-label',html:'<span></span> PERTH',iconSize:[90,24]}),interactive:false}).addTo(map);
const bounds=L.latLngBounds([[-32.24,115.68],[-31.74,116.12]]);
map.fitBounds(bounds,{padding:[18,18]});document.querySelector('#reset').onclick=()=>{selected=null;highlight(null);map.fitBounds(bounds,{padding:[18,18]});};document.querySelector('#clear').onclick=()=>{selected=null;highlight(null);};document.addEventListener('keydown',event=>{if(event.key==='Escape'){selected=null;highlight(null);}});
