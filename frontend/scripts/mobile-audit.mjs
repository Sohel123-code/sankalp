// Real-browser layout audit, isolated from live accounts and backend writes.
// Run `node scripts/mobile-audit.mjs`, then open the printed local URL.
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFile } from 'node:fs/promises'

const reportPath = process.argv[2] || '.mobile-audit.json'
const pages = ['/', '/about', '/tracks', '/programme', '/workshops', '/innovation-challenge', '/investor-connect', '/speakers', '/partners', '/showcase', '/registration', '/venue', '/faq', '/contact', '/privacy-policy', '/terms', '/cancellation-refund', '/events', '/events/audit-event', '/login', '/register', '/dashboard']
const html = `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>SANKALP mobile layout audit</title><style>body{background:#151515;color:#eee;font:16px system-ui}iframe{border:1px solid #888;display:block;background:#080807}#frames{display:flex;gap:16px;align-items:start}pre{white-space:pre-wrap}</style><h1>Mobile layout audit</h1><p id="status">Starting</p><div id="frames"></div><pre id="results"></pre><script type="module">
const pages=${JSON.stringify(pages)}, reports=[];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function identify(el){return el.tagName.toLowerCase()+'.'+String(el.className).replaceAll(' ','.').slice(0,100)}
function issues(doc,width){
 const overflow=[], taps=[];
 for(const el of doc.querySelectorAll('body *')){
  if(el.closest('svg,canvas,[aria-hidden="true"],[inert],script,style,video'))continue;
  const b=el.getBoundingClientRect(),s=doc.defaultView.getComputedStyle(el);
  if(!b.width||!b.height||s.visibility==='hidden'||s.display==='none'||Number(s.opacity)===0)continue;
  let clipped=false;for(let p=el.parentElement;p&&p!==doc.body;p=p.parentElement){if(p.id==='root'||p.matches('.route-content,main,.home-page'))continue;const c=doc.defaultView.getComputedStyle(p);if(['hidden','clip','auto','scroll'].includes(c.overflowX)){const r=p.getBoundingClientRect();if(r.left>=-24&&r.right<=width+24){clipped=true;break}}}
  if(!clipped&&(b.right>width+2||b.left < -2))overflow.push({element:identify(el),text:el.textContent.trim().slice(0,65),left:Math.round(b.left),right:Math.round(b.right)});
  if(el.matches('button,input:not([type=checkbox]):not([type=radio]),select,textarea,summary')&&!el.disabled&&b.height<42)taps.push({element:identify(el),text:el.textContent.trim().slice(0,45),height:Math.round(b.height)});
 }
 return {overflow:overflow.slice(0,25),smallControls:taps.slice(0,25),pageWidth:doc.documentElement.scrollWidth};
}
for(const width of [320,390,768,1024]){
 for(let offset=0;offset<pages.length;offset+=2){
  await Promise.all(pages.slice(offset,offset+2).map(async path=>{
   const f=document.createElement('iframe');f.width=width;f.height=800;f.src=path+'?mobileAudit=1';document.querySelector('#frames').append(f);
   await new Promise(resolve=>{f.onload=resolve;setTimeout(resolve,10000)});await wait(2200);
   const doc=f.contentDocument;await Promise.race([doc.fonts.ready,wait(1200)]);
   const result={path,width,...issues(doc,width),startsAtTop:f.contentWindow.scrollY<3,contentRendered:!!doc.querySelector('h1,h2')};
   if(width<=1024&&doc.querySelector('#mobile-menu-toggle')){
    doc.querySelector('#mobile-menu-toggle').click();await wait(100);
    const panel=doc.querySelector('#mobile-navigation');result.menu=!!panel&&panel.getBoundingClientRect().width<=width;
    doc.querySelector('#mobile-menu-toggle').click();await wait(50);
   }
   // Open native disclosures and recheck expanded content, without submitting forms.
   doc.querySelectorAll('details').forEach(el=>el.open=true);await wait(80);
   result.expandedOverflow=issues(doc,width).overflow;
   if(path==='/registration'){
    [...doc.querySelectorAll('button')].find(el=>el.textContent.includes('Proceed with Delegate Details'))?.click();await wait(100);
    result.modal=issues(doc,width);result.modalVisible=!!doc.querySelector('[role="dialog"]');
   }
   reports.push(result);f.remove();
   document.querySelector('#status').textContent=reports.length+' / '+(pages.length*4)+' layouts checked';
  }));
 }
}
await fetch('/__mobile-result',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(reports)});
document.querySelector('#results').textContent=JSON.stringify(reports.filter(r=>r.overflow.length||r.expandedOverflow.length||r.smallControls.length||r.menu===false),null,2);
document.querySelector('#status').textContent='Complete: '+reports.length+' layouts. Report saved.';
</script>`
const server = await createServer({ configFile:false, plugins:[react(), {
  name:'mobile-audit',
  configureServer(server) {
    server.middlewares.use(async (req,res,next)=>{
      if(req.url==='/__mobile-audit'){res.setHeader('Content-Type','text/html');res.end(html);return}
      if(req.url==='/__mobile-result'){
        let body='';for await(const part of req)body+=part
        await writeFile(reportPath,JSON.stringify(JSON.parse(body),null,2));res.end('saved');console.log('Audit saved: '+reportPath);return
      }
      if(req.url?.startsWith('/api/')){
        res.setHeader('Content-Type','application/json')
        if(req.url==='/api/me'&&req.headers.referer?.includes('/dashboard'))res.end(JSON.stringify({user:{id:'audit',username:'Mobile reviewer',gmail:'mobile@example.test'}}))
        else if(req.url==='/api/me'){res.statusCode=401;res.end('{"error":"Audit guest"}')}
        else res.end('[]')
        return
      }
      next()
    })
  },
}],server:{host:'127.0.0.1',port:5176,strictPort:true}, optimizeDeps:{entries:['index.html']} })
await server.listen()
console.log('Open http://127.0.0.1:5176/__mobile-audit')
