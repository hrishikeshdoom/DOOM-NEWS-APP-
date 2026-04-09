// ═══════════════════════════════════════════════════════
// DOOM NEWS v2.0 — Leaflet Map + OpenSky Flight Tracking
// ═══════════════════════════════════════════════════════

const RSS_SOURCES = [
  { name:"BBC WORLD",    url:"https://feeds.bbci.co.uk/news/world/rss.xml",          region:"UK",    category:"politics"},
  { name:"REUTERS",      url:"https://feeds.reuters.com/reuters/worldNews",           region:"INTL",  category:"politics"},
  { name:"AL JAZEERA",   url:"https://www.aljazeera.com/xml/rss/all.xml",            region:"QAT",   category:"conflict"},
  { name:"DW NEWS",      url:"https://rss.dw.com/rdf/rss-en-world",                 region:"GER",   category:"politics"},
  { name:"FRANCE 24",    url:"https://www.france24.com/en/rss",                      region:"FRA",   category:"politics"},
  { name:"AP NEWS",      url:"https://rsshub.app/apnews/topics/apf-intlnews",        region:"USA",   category:"politics"},
  { name:"NPR WORLD",    url:"https://feeds.npr.org/1004/rss.xml",                   region:"USA",   category:"politics"},
  { name:"VOA NEWS",     url:"https://www.voanews.com/api/zkqmqmtgmm",               region:"USA",   category:"politics"},
  { name:"GUARDIAN INT", url:"https://www.theguardian.com/world/rss",                region:"UK",    category:"politics"},
  { name:"ARS TECHNICA", url:"https://feeds.arstechnica.com/arstechnica/index",      region:"USA",   category:"tech"},
  { name:"MIT TECH REV", url:"https://www.technologyreview.com/topnews.rss",         region:"USA",   category:"tech"},
  { name:"FT WORLD",     url:"https://www.ft.com/?format=rss",                       region:"UK",    category:"economy"},
  { name:"BLOOMBERG",    url:"https://feeds.bloomberg.com/markets/news.rss",         region:"USA",   category:"economy"},
];

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

const REGION_COORDS = {
  EUR:{lat:50,lon:15},MIDEAST:{lat:30,lon:45},ASIA:{lat:35,lon:105},
  AFR:{lat:5,lon:25},USA:{lat:37,lon:-95},LATAM:{lat:-15,lon:-60},
  INTL:{lat:0,lon:0},UK:{lat:54,lon:-2},GER:{lat:51,lon:10},
  QAT:{lat:25.3,lon:51.5},FRA:{lat:46,lon:2},ARCTIC:{lat:80,lon:0},
};

const FALLBACK_NEWS = [
  {source:"REUTERS",title:"NATO allies increase military spending amid Eastern European tensions",category:"conflict",region:"EUR",lat:50,lon:14,time:"2m AGO"},
  {source:"AL JAZEERA",title:"Middle East ceasefire negotiations enter critical phase",category:"conflict",region:"MIDEAST",lat:31.5,lon:34.8,time:"5m AGO"},
  {source:"BBC WORLD",title:"North Korea launches ballistic missile test over Sea of Japan",category:"conflict",region:"ASIA",lat:38,lon:128,time:"8m AGO"},
  {source:"BLOOMBERG",title:"Global markets tumble as geopolitical uncertainty mounts",category:"economy",region:"USA",lat:40.7,lon:-74,time:"11m AGO"},
  {source:"DW NEWS",title:"EU emergency session called on border security crisis",category:"politics",region:"EUR",lat:52.5,lon:13.4,time:"14m AGO"},
  {source:"AP NEWS",title:"South China Sea: naval standoff between multiple vessels reported",category:"conflict",region:"ASIA",lat:14,lon:115,time:"16m AGO"},
  {source:"FRANCE 24",title:"West Africa: Military coup attempt foiled by loyalist forces",category:"conflict",region:"AFR",lat:12.4,lon:-1.5,time:"20m AGO"},
  {source:"GUARDIAN INT",title:"Iran nuclear program — new IAEA report raises international alarm",category:"tech",region:"MIDEAST",lat:35.7,lon:51.4,time:"24m AGO"},
  {source:"MIT TECH REV",title:"AI-driven cyberattack targets critical infrastructure in G7 nations",category:"tech",region:"USA",lat:38.9,lon:-77,time:"27m AGO"},
  {source:"VOA NEWS",title:"Ukraine frontline: artillery exchanges continue in Zaporizhzhia region",category:"conflict",region:"EUR",lat:47.8,lon:35.2,time:"30m AGO"},
  {source:"ARS TECHNICA",title:"Hypersonic missile technology proliferating among rival state actors",category:"tech",region:"ASIA",lat:39.9,lon:116.4,time:"33m AGO"},
  {source:"BBC WORLD",title:"India-Pakistan border: elevated alert status following skirmish",category:"conflict",region:"ASIA",lat:30,lon:74,time:"38m AGO"},
  {source:"REUTERS",title:"Venezuela political crisis deepens as opposition leader detained",category:"politics",region:"LATAM",lat:10.5,lon:-66.9,time:"42m AGO"},
  {source:"FT WORLD",title:"Energy crisis: European gas reserves at 5-year low heading into winter",category:"economy",region:"EUR",lat:48.9,lon:2.3,time:"45m AGO"},
  {source:"AL JAZEERA",title:"Sudan: Humanitarian corridors blocked as fighting escalates in Darfur",category:"conflict",region:"AFR",lat:15.5,lon:32.5,time:"50m AGO"},
  {source:"AP NEWS",title:"Taiwan Strait: Increased PLA air force activity reported by Taipei",category:"conflict",region:"ASIA",lat:23.7,lon:121,time:"55m AGO"},
  {source:"BLOOMBERG",title:"BRICS nations announce new reserve currency framework at summit",category:"economy",region:"INTL",lat:-25.7,lon:28.2,time:"1h AGO"},
  {source:"VOA NEWS",title:"Ethiopia: Peace talks stall as Tigray armed groups rearm",category:"conflict",region:"AFR",lat:9,lon:38.7,time:"1h AGO"},
  {source:"GUARDIAN INT",title:"Arctic melt triggers NATO review of northern strategic routes",category:"tech",region:"ARCTIC",lat:80,lon:0,time:"1h AGO"},
  {source:"DW NEWS",title:"Germany approves largest peacetime military budget in post-WWII history",category:"politics",region:"EUR",lat:52.5,lon:13.4,time:"1.5h AGO"},
  {source:"FRANCE 24",title:"Sahel: French forces complete withdrawal from Mali operations",category:"conflict",region:"AFR",lat:17,lon:-4,time:"2h AGO"},
  {source:"REUTERS",title:"China increases naval patrols near disputed Spratly Islands",category:"conflict",region:"ASIA",lat:9,lon:114,time:"2h AGO"},
];

const THREAT_KEYWORDS = {
  critical:['nuclear','missile','attack','war','bomb','terror','coup','killed','explosion','strike','invasion','casualties','hostage','combat'],
  high:['conflict','troops','military','armed','forces','battle','fight','violence','crisis','emergency','threat','weapons'],
  medium:['tension','protest','dispute','sanction','border','political','unrest','arrested','detained'],
  low:['talks','negotiation','election','reform','economic','climate','aid'],
};

const THREAT_COLORS = {critical:'#ff2020',high:'#ff6600',medium:'#ffb300',low:'#00ff41'};
const BARCOLORS = ['#ff2020','#ff4400','#ff8800','#ffb300','#88ff00','#00ff41'];

function classifyThreat(t){
  const tx=t.toLowerCase();
  for(const[l,ws] of Object.entries(THREAT_KEYWORDS)) if(ws.some(w=>tx.includes(w))) return l;
  return 'low';
}
function classifyCategory(t){
  const tx=t.toLowerCase();
  if(['war','battle','troops','missile','attack','bomb','forces','military','armed','conflict','strike','invasion','naval'].some(w=>tx.includes(w))) return 'conflict';
  if(['nuclear','cyber','ai','weapon','tech','hack','drone','satellite','hypersonic'].some(w=>tx.includes(w))) return 'tech';
  if(['economy','market','trade','gdp','inflation','bank','financial','currency','oil','energy'].some(w=>tx.includes(w))) return 'economy';
  return 'politics';
}
function getTimeAgo(d){
  const m=Math.floor((Date.now()-d.getTime())/60000);
  if(m<1) return 'JUST NOW'; if(m<60) return m+'m AGO'; return Math.floor(m/60)+'h AGO';
}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function setLoad(msg,pct){document.getElementById('loading-status').textContent=msg;document.getElementById('loading-bar').style.width=pct+'%';}

// ── STATE ─────────────────────────────────────────────────
let allNews=[],filteredNews=[],activeFilter='all',globalThreatLevel=0;
let leafletMap=null,incidentLayer=null,flightLayer=null,heatLayer=null;
let showFlights=true,showIncidents=true,showHeat=false;
let flightCount=0,flightInterval=null,lastFetchZoom=2;

// ── MAP INIT ──────────────────────────────────────────────
function initMap(){
  leafletMap=L.map('leaflet-map',{
    center:[20,10],zoom:2,minZoom:2,maxZoom:14,
    zoomControl:true,worldCopyJump:true,preferCanvas:true,
  });
  // CartoDB Dark Matter — free, no API key, high quality
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
    attribution:'',subdomains:'abcd',maxZoom:19,
  }).addTo(leafletMap);

  incidentLayer=L.layerGroup().addTo(leafletMap);
  flightLayer=L.layerGroup().addTo(leafletMap);
  heatLayer=L.layerGroup();

  leafletMap.on('mousemove',e=>{
    document.getElementById('coords-display').textContent=
      'LAT: '+e.latlng.lat.toFixed(4)+'  LON: '+e.latlng.lng.toFixed(4);
  });
}

// ── INCIDENT MARKERS ──────────────────────────────────────
function createIncidentIcon(level){
  const c=THREAT_COLORS[level],s={critical:14,high:11,medium:9,low:7}[level];
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+(s*4)+'" height="'+(s*4)+'" viewBox="0 0 '+(s*4)+' '+(s*4)+'">'
    +'<circle cx="'+(s*2)+'" cy="'+(s*2)+'" r="'+(s*1.8)+'" fill="none" stroke="'+c+'" stroke-width="1" opacity="0.4">'
    +'<animate attributeName="r" values="'+(s*.6)+';'+(s*1.9)+'" dur="'+(1.5+Math.random()*1)+'s" repeatCount="indefinite"/>'
    +'<animate attributeName="opacity" values="0.8;0" dur="'+(1.5+Math.random()*1)+'s" repeatCount="indefinite"/>'
    +'</circle>'
    +'<circle cx="'+(s*2)+'" cy="'+(s*2)+'" r="'+(s*.7)+'" fill="'+c+'" opacity="0.95"/>'
    +'<line x1="'+(s*2-s*1.5)+'" y1="'+(s*2)+'" x2="'+(s*2+s*1.5)+'" y2="'+(s*2)+'" stroke="'+c+'" stroke-width="0.5" opacity="0.6"/>'
    +'<line x1="'+(s*2)+'" y1="'+(s*2-s*1.5)+'" x2="'+(s*2)+'" y2="'+(s*2+s*1.5)+'" stroke="'+c+'" stroke-width="0.5" opacity="0.6"/>'
    +'</svg>';
  return L.divIcon({className:'',html:svg,iconSize:[s*4,s*4],iconAnchor:[s*2,s*2]});
}

function renderIncidents(){
  incidentLayer.clearLayers();
  if(!showIncidents) return;
  allNews.forEach(item=>{
    const icon=createIncidentIcon(item.threatLevel);
    const m=L.marker([item.lat,item.lon],{icon,zIndexOffset:200});
    const c=THREAT_COLORS[item.threatLevel];
    m.bindPopup(
      '<div style="font-family:Orbitron,sans-serif;font-size:9px;letter-spacing:2px;color:'+c+';margin-bottom:5px">'+item.threatLevel.toUpperCase()+' ◈ '+item.source+'</div>'
      +'<div style="font-family:Rajdhani,sans-serif;font-size:13px;color:#c8ffd4;line-height:1.4;margin-bottom:4px">'+item.title+'</div>'
      +'<div style="color:#00aa2a;font-size:9px">◷ '+item.time+' &nbsp;⬡ '+item.region+'</div>',
      {maxWidth:260}
    );
    m.on('click',()=>renderBriefing(item));
    incidentLayer.addLayer(m);
  });
  document.getElementById('active-incidents').textContent=allNews.length+' INCIDENTS';
}

// ── FLIGHT TRACKING (OpenSky Network — free, no key) ─────
function createFlightIcon(hdg){
  const a=hdg||0;
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="-11 -11 22 22" style="transform:rotate('+a+'deg)">'
    +'<path d="M0,-8 L2.5,-1 L9,2.5 L2,1 L1.5,8 L0,6 L-1.5,8 L-2,1 L-9,2.5 L-2.5,-1 Z" '
    +'fill="#00e5ff" fill-opacity="0.82" stroke="#00e5ff" stroke-width="0.4"/>'
    +'</svg>';
  return L.divIcon({className:'flight-icon',html:svg,iconSize:[22,22],iconAnchor:[11,11]});
}

async function fetchFlights(){
  const bounds=leafletMap?leafletMap.getBounds():null;
  let url='https://opensky-network.org/api/states/all';
  if(bounds && leafletMap.getZoom()>=5){
    const sw=bounds.getSouthWest(),ne=bounds.getNorthEast();
    url='https://opensky-network.org/api/states/all?lamin='+Math.max(-90,sw.lat-1)
      +'&lomin='+Math.max(-180,sw.lng-1)+'&lamax='+Math.min(90,ne.lat+1)+'&lomax='+Math.min(180,ne.lng+1);
  }
  try{
    const res=await fetch(url,{signal:AbortSignal.timeout(10000)});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data=await res.json();
    if(!data||!data.states) return;
    const states=data.states.filter(s=>s[5]!==null&&s[6]!==null&&!s[8]);
    const sample=states.length>800?states.filter((_,i)=>i%Math.ceil(states.length/800)===0):states;
    updateFlightLayer(sample);
    flightCount=sample.length;
    document.getElementById('flight-count-display').textContent='✈ '+flightCount.toLocaleString()+' AIRCRAFT';
    document.getElementById('flight-status').textContent='✈ '+flightCount.toLocaleString()+' AIRBORNE';
    document.getElementById('flight-status').style.color='#00e5ff';
  }catch(e){
    document.getElementById('flight-status').textContent='✈ RESTRICTED/LIMITED';
    document.getElementById('flight-count-display').textContent='✈ RATE LIMITED — RETRYING';
  }
}

function updateFlightLayer(states){
  flightLayer.clearLayers();
  if(!showFlights) return;
  states.forEach(s=>{
    const lon=s[5],lat=s[6];
    const callsign=(s[1]||'').trim()||s[0]||'UNK';
    const hdg=s[10]||0;
    const alt=s[7]?Math.round(s[7])+'m':'GND';
    const spd=s[9]?Math.round(s[9]*1.944)+'kt':'---';
    const country=s[2]||'UNK';
    const icon=createFlightIcon(hdg);
    const m=L.marker([lat,lon],{icon,zIndexOffset:50});
    m.bindPopup(
      '<div style="font-family:Orbitron,sans-serif;font-size:9px;letter-spacing:2px;color:#00e5ff;margin-bottom:4px">✈ '+callsign+'</div>'
      +'<div style="font-size:10px;line-height:1.8;color:#c8ffd4">ORIGIN: '+country+'<br>ALT: '+alt+' &nbsp; SPD: '+spd+'<br>HDG: '+Math.round(hdg)+'°</div>',
      {maxWidth:180}
    );
    flightLayer.addLayer(m);
  });
}

// ── HEAT ZONES ────────────────────────────────────────────
function renderHeatZones(){
  heatLayer.clearLayers();
  if(!showHeat) return;
  const hotspots=[
    {lat:30,lon:45,r:700000,name:'MIDEAST'},{lat:35,lon:105,r:800000,name:'ASIA'},
    {lat:50,lon:15,r:600000,name:'EUR'},{lat:5,lon:25,r:700000,name:'AFR'},
    {lat:37,lon:-95,r:500000,name:'USA'},{lat:-15,lon:-60,r:500000,name:'LATAM'},
  ];
  const w={critical:4,high:3,medium:2,low:1};
  const rs={};
  allNews.forEach(n=>{if(!rs[n.region])rs[n.region]={t:0,c:0};rs[n.region].t+=w[n.threatLevel];rs[n.region].c++;});
  hotspots.forEach((h,i)=>{
    const rd=rs[h.name],pct=rd?Math.min(1,rd.t/(rd.c*4)):0.3;
    const op=0.04+pct*0.16,c=BARCOLORS[Math.min(i,5)];
    L.circle([h.lat,h.lon],{radius:h.r*(0.5+pct),color:c,fillColor:c,fillOpacity:op,weight:1,opacity:op*1.5,dashArray:'4 6'}).addTo(heatLayer);
  });
}

// ── NEWS FETCH ────────────────────────────────────────────
async function fetchRSS(source){
  for(const proxy of CORS_PROXIES){
    try{
      const res=await fetch(proxy+encodeURIComponent(source.url),{signal:AbortSignal.timeout(5000)});
      if(!res.ok) continue;
      const doc=new DOMParser().parseFromString(await res.text(),'text/xml');
      return [...doc.querySelectorAll('item')].slice(0,5).map(item=>{
        const title=item.querySelector('title')?.textContent?.trim()||'';
        const desc=(item.querySelector('description')?.textContent||'').replace(/<[^>]+>/g,'').trim().substring(0,200);
        const pubDate=item.querySelector('pubDate')?.textContent||'';
        if(!title) return null;
        const category=classifyCategory(title+' '+desc);
        const base=REGION_COORDS[source.region]||{lat:0,lon:0};
        return{source:source.name,title,description:desc,category,threatLevel:classifyThreat(title+' '+desc),region:source.region,lat:base.lat+(Math.random()-.5)*8,lon:base.lon+(Math.random()-.5)*8,time:pubDate?getTimeAgo(new Date(pubDate)):Math.floor(Math.random()*60)+'m AGO'};
      }).filter(Boolean);
    }catch(e){continue;}
  }
  return[];
}

async function loadNews(){
  setLoad('CONNECTING TO GLOBAL RSS NETWORK...',10);
  const live=[];let fetched=0;
  await Promise.allSettled(RSS_SOURCES.map(async src=>{
    const items=await fetchRSS(src);live.push(...items);
    setLoad('ACQUIRING: '+src.name+'...',10+(++fetched/RSS_SOURCES.length)*50);
  }));
  setLoad('PROCESSING SIGNALS...',65);
  const order={critical:0,high:1,medium:2,low:3};
  const fallback=FALLBACK_NEWS.map(n=>({...n,threatLevel:classifyThreat(n.title),description:n.title}));
  let news=live.length>8?[...live,...fallback.slice(0,Math.max(0,22-live.length))].slice(0,45):[...fallback,...live.slice(0,10)];
  news.sort((a,b)=>order[a.threatLevel]-order[b.threatLevel]);
  allNews=news;filteredNews=news;
  computeThreatLevel();
  setLoad('RENDERING TACTICAL MAP...',82);
  await sleep(200);
  renderIncidents();
  if(showHeat)renderHeatZones();
  renderFeed();
  renderBriefing(news[0]);
  updateTicker();
  document.getElementById('source-count').textContent=RSS_SOURCES.length+' SOURCES';
  document.getElementById('active-incidents').textContent=news.length+' INCIDENTS';
}

// ── THREAT LEVEL ──────────────────────────────────────────
function computeThreatLevel(){
  const w={critical:4,high:3,medium:2,low:1};
  const total=allNews.reduce((s,n)=>s+w[n.threatLevel],0);
  globalThreatLevel=Math.min(100,Math.round((total/(allNews.length*4))*100));
  document.getElementById('threat-fill').style.width=globalThreatLevel+'%';
  let defcon=5,color='#00ff41',status='NORMAL';
  if(globalThreatLevel>80){defcon=1;color='#ff0000';status='MAXIMUM';}
  else if(globalThreatLevel>65){defcon=2;color='#ff4400';status='HIGH ALERT';}
  else if(globalThreatLevel>50){defcon=3;color='#ffaa00';status='ELEVATED';}
  else if(globalThreatLevel>35){defcon=4;color='#88ff00';status='GUARDED';}
  const el=document.getElementById('defcon-level');
  el.textContent=defcon;el.style.color=color;el.style.textShadow='0 0 14px '+color;
  document.getElementById('defcon-status').textContent=status;
  document.getElementById('defcon-status').style.color=color;
}

// ── FEED RENDER ───────────────────────────────────────────
function renderFeed(){
  const list=document.getElementById('feed-list');list.innerHTML='';
  filteredNews.forEach(item=>{
    const div=document.createElement('div');div.className='feed-item';
    div.innerHTML='<div class="feed-source"><span>'+item.source+'</span><span class="threat-badge threat-'+item.threatLevel+'">'+item.threatLevel.toUpperCase()+'</span></div>'
      +'<div class="feed-headline">'+item.title+'</div>'
      +'<div class="feed-meta"><span>⬡ '+item.region+'</span><span>◷ '+item.time+'</span><span>⬡ '+item.category.toUpperCase()+'</span></div>';
    div.addEventListener('click',()=>{
      document.querySelectorAll('.feed-item').forEach(e=>e.classList.remove('active'));
      div.classList.add('active');
      renderBriefing(item);
      leafletMap.flyTo([item.lat,item.lon],Math.max(leafletMap.getZoom(),5),{duration:1.2});
    });
    list.appendChild(div);
  });
  document.getElementById('feed-count').textContent=filteredNews.length+' SIGNALS';
}

// ── BRIEFING ──────────────────────────────────────────────
const ANALYST_NOTES={
  conflict:["Situation requires continuous monitoring. Armed activity levels exceed baseline. Level-3 watch posture recommended.","Hostile engagement indicators elevated. Escalatory dynamics may intensify within 48-72 hours. Standby assets advised."],
  tech:["Technical capability poses potential strategic implications. TECHINT division evaluation recommended.","Potential dual-use capability identified. Proliferation risk: MODERATE-HIGH. NSC review flagged."],
  economy:["Economic destabilization indicators present. Financial warfare risk: MODERATE. Monitor for coordinated market action.","Macroeconomic signal correlates with geopolitical tensions. Resource exploitation risk elevated."],
  politics:["Political instability may create security vacuum. Monitor for opportunistic non-state actor activity.","Leadership dynamics shifting. Policy pivot possible. Reassess alliance posture."],
};

function renderBriefing(item){
  if(!item)return;
  const now=new Date();
  document.getElementById('briefing-stamp').textContent=now.toISOString().replace('T',' ').substring(0,16)+' UTC';
  const c=THREAT_COLORS[item.threatLevel];
  const td={critical:'IMMINENT — IMMEDIATE ACTION',high:'HIGH — ELEVATED READINESS',medium:'MODERATE — MONITOR CLOSELY',low:'LOW — ROUTINE MONITORING'};
  const w={critical:4,high:3,medium:2,low:1};
  const rs={};
  allNews.forEach(n=>{if(!rs[n.region])rs[n.region]={t:0,ct:0};rs[n.region].t+=w[n.threatLevel];rs[n.region].ct++;});
  const top=Object.entries(rs).map(([r,d])=>({r,s:Math.round((d.t/(d.ct*4))*100)})).sort((a,b)=>b.s-a.s).slice(0,6);
  const note=(ANALYST_NOTES[item.category]||ANALYST_NOTES.politics)[Math.floor(Math.random()*2)];
  document.getElementById('briefing-content').innerHTML=
    '<div class="briefing-header-line">◈ INTEL ASSESSMENT — '+item.source+'</div>'
    +'<div class="briefing-section"><div class="briefing-section-title">CLASSIFICATION</div>'
    +'<div class="stat-row"><span class="stat-label">THREAT</span><span class="stat-value" style="color:'+c+'">'+item.threatLevel.toUpperCase()+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">STATUS</span><span class="stat-value" style="color:'+c+';font-size:8px">'+td[item.threatLevel]+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">REGION</span><span class="stat-value">'+item.region+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">CATEGORY</span><span class="stat-value">'+item.category.toUpperCase()+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">COORDS</span><span class="stat-value">LAT '+item.lat.toFixed(2)+' LON '+item.lon.toFixed(2)+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">TIMESTAMP</span><span class="stat-value">'+item.time+'</span></div></div>'
    +'<div class="briefing-section"><div class="briefing-section-title">INCIDENT SUMMARY</div>'
    +'<div class="briefing-body">'+item.title+'</div>'
    +(item.description&&item.description!==item.title?'<div class="briefing-body" style="margin-top:7px;opacity:.72;font-size:12px">'+item.description.substring(0,220)+'...</div>':'')
    +'</div>'
    +'<div class="briefing-section"><div class="briefing-section-title">GLOBAL THREAT: '+globalThreatLevel+'%</div>'
    +top.map((r,i)=>'<div class="region-bar"><span class="region-name">'+r.r+'</span><div class="bar-track"><div class="bar-fill" style="width:'+r.s+'%;background:'+BARCOLORS[i]+'"></div></div><span class="bar-pct">'+r.s+'%</span></div>').join('')
    +'</div>'
    +'<div class="briefing-section"><div class="briefing-section-title">ACTIVE SIGNALS</div>'
    +'<div class="stat-row"><span class="stat-label">CRITICAL</span><span class="stat-value" style="color:#ff2020">'+allNews.filter(n=>n.threatLevel==='critical').length+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">HIGH</span><span class="stat-value" style="color:#ff6600">'+allNews.filter(n=>n.threatLevel==='high').length+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">MEDIUM</span><span class="stat-value" style="color:#ffb300">'+allNews.filter(n=>n.threatLevel==='medium').length+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">LOW</span><span class="stat-value">'+allNews.filter(n=>n.threatLevel==='low').length+'</span></div>'
    +'<div class="stat-row"><span class="stat-label">AIRCRAFT</span><span class="stat-value" style="color:#00e5ff">'+flightCount.toLocaleString()+'</span></div>'
    +'</div>'
    +'<div class="briefing-section"><div class="briefing-section-title">ANALYST NOTE</div>'
    +'<div class="briefing-body" style="font-size:11px;opacity:.72">'+note+'</div></div>';
}

function updateTicker(){
  const h=allNews.map(n=>'◈ ['+n.source+'] '+n.title).join('   ');
  const t=document.getElementById('ticker');t.textContent=h+'   '+h;
}

// ── CONTROLS ──────────────────────────────────────────────
document.getElementById('btn-incidents').addEventListener('click',function(){
  showIncidents=!showIncidents;this.classList.toggle('active',showIncidents);
  if(showIncidents)renderIncidents();else incidentLayer.clearLayers();
});
document.getElementById('btn-flights').addEventListener('click',function(){
  showFlights=!showFlights;this.classList.toggle('active',showFlights);
  if(showFlights)fetchFlights();else flightLayer.clearLayers();
});
document.getElementById('btn-heatmap').addEventListener('click',function(){
  showHeat=!showHeat;this.classList.toggle('active',showHeat);
  if(showHeat){heatLayer.addTo(leafletMap);renderHeatZones();}else heatLayer.remove();
});
document.getElementById('btn-reset').addEventListener('click',()=>leafletMap.flyTo([20,10],2,{duration:1.5}));

document.querySelectorAll('.filter-btn[data-filter]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn[data-filter]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');activeFilter=btn.dataset.filter;
    filteredNews=activeFilter==='all'?allNews:activeFilter==='critical'?allNews.filter(n=>n.threatLevel==='critical'):allNews.filter(n=>n.category===activeFilter);
    renderFeed();
  });
});

document.getElementById('refresh-btn').addEventListener('click',async()=>{
  const btn=document.getElementById('refresh-btn');btn.classList.add('spinning');btn.disabled=true;
  await loadNews();fetchFlights();btn.classList.remove('spinning');btn.disabled=false;
});

// ── CLOCK ─────────────────────────────────────────────────
setInterval(()=>{
  const n=new Date();
  document.getElementById('clock').textContent=String(n.getUTCHours()).padStart(2,'0')+':'+String(n.getUTCMinutes()).padStart(2,'0')+':'+String(n.getUTCSeconds()).padStart(2,'0');
},1000);

// ── BOOT ──────────────────────────────────────────────────
async function boot(){
  setLoad('INITIALIZING LEAFLET MAP ENGINE...',5);await sleep(200);
  initMap();
  setLoad('LOADING CARTOGRAPHIC TILES...',15);await sleep(500);
  await loadNews();
  setLoad('CONNECTING OPENSKY FLIGHT NETWORK...',90);
  fetchFlights();
  flightInterval=setInterval(fetchFlights,30000);
  setLoad('ALL SYSTEMS ONLINE ◈ READY',100);await sleep(600);
  document.getElementById('loading').style.display='none';
  document.getElementById('app').style.display='grid';
  setTimeout(()=>leafletMap.invalidateSize(),120);
  leafletMap.on('moveend',()=>{
    const z=leafletMap.getZoom();
    if(Math.abs(z-lastFetchZoom)>=2||z>=6){lastFetchZoom=z;if(showFlights)fetchFlights();}
  });
}

setInterval(()=>loadNews(),5*60*1000);
boot();
