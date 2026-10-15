const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require(process.env.TS_MODULE||'/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
const root=path.join(__dirname,'..');
function load(relative){const source=fs.readFileSync(path.join(root,relative),'utf8');const res=ts.transpileModule(source,{fileName:relative,reportDiagnostics:true,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}});assert.equal(res.diagnostics.length,0,`Syntax errors in ${relative}`);const m={exports:{}};new Function('module','exports','require',res.outputText)(m,m.exports,require);return m.exports}
for(const file of ['components/Workbench.tsx','lib/process.ts','lib/extras.ts','lib/catalog.ts','lib/server-text.ts','app/api/health/route.ts','app/api/tools/text/route.ts','app/sitemap.ts','app/admin/page.tsx','app/admin/CommandCenter.tsx','app/admin/layout.tsx','app/admin/login/page.tsx','app/api/auth/[...nextauth]/route.ts','app/api/admin/settings/route.ts','app/api/admin/operations/route.ts','lib/auth.ts','lib/admin-auth.ts','lib/prisma.ts']){const source=fs.readFileSync(path.join(root,file),'utf8');const res=ts.transpileModule(source,{fileName:file,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.Preserve,target:ts.ScriptTarget.ES2022}});assert.equal(res.diagnostics.length,0,`${file} parse errors`)}
const {textTasks}=load('lib/process.ts'),{seoTasks,colorTasks}=load('lib/extras.ts'),{tools,activeTools,categoryNames}=load('lib/catalog.ts');
assert.equal(categoryNames.length,52);assert.equal(tools.length,1040);
assert.equal(textTasks('hi there',['Uppercase Converter']),'HI THERE');
assert.equal(textTasks('hello world',['Find and Replace'],'world','Ali'),'hello Ali');
assert.equal(textTasks('مرحبا',['Base64 Encoder','Base64 Decoder']),'مرحبا');
assert.match(textTasks('foo foo',['Word Counter']),/Words: 2/);
assert.match(seoTasks('Example title',['Meta Tag Generator']),/<title>Example title<\/title>/);
assert.match(seoTasks('{"@context":"https://schema.org","@type":"WebPage"}',['Schema Validator']),/BASIC CHECK PASS/);
assert.throws(()=>seoTasks('{bad json',['Schema Validator']),/valid JSON-LD JSON/);
assert.match(colorTasks('#000000','#ffffff',['Contrast Ratio']),/21.00:1/);
assert.equal(activeTools.every(t=>t.live),true);
const implemented={
'image':new Set(['Image Compressor','Image Converter','Image Resizer','Image Rotator','Image Flipper','Grayscale Image','Blur Image','Image Quality Optimizer','PNG to JPG','JPG to WebP','WebP to PNG','Image Dimensions','Image Metadata','Image Format Checker']),
'pdf':new Set(['Merge PDF','Split PDF','Rotate PDF','PDF Page Count','PDF Metadata','Delete PDF Pages']),
'file':new Set(['ZIP Creator','File Size Inspector','File Type Inspector','File Renamer','ZIP Extractor','Checksum Generator','Batch Rename','Duplicate Finder','MIME Detector','Extension Checker','File List Export','File Date Inspector']),
'text':new Set(['Word Counter','Character Counter','Uppercase Converter','Lowercase Converter','Title Case Converter','Remove Extra Spaces','Reverse Text','Text Sorter','Remove Duplicate Lines','Text to Slug','Find and Replace','Sentence Counter','Line Counter','Reading Time','Text Diff','Base64 Encoder','Base64 Decoder','URL Encoder','URL Decoder','Text Cleaner']),
'qr':new Set(['QR Code Generator','QR Code Download','URL QR Code','WiFi QR Code','Email QR Code','Phone QR Code','SMS QR Code','Text QR Code','QR Code Preview','QR Code Colors']),
'seo':new Set(['Meta Tag Generator','SERP Preview','Title Length Checker','Description Length Checker','Robots Tag Builder','Canonical Tag Builder','Open Graph Builder','Twitter Card Builder','Schema Validator','Keyword Density','Robots.txt Generator','Slug Generator','Heading Analyzer','SEO Checklist','Structured Data Builder']),
'color':new Set(['HEX to RGB','RGB to HEX','Contrast Ratio','Color Palette Generator','Color Inverter','HSL Converter','Gradient Generator','Color Shades','Accessible Color Check','Random Color','Brand Palette','Color Picker','Color Export'])
};
for(const tool of activeTools) assert.ok(implemented[tool.kind]?.has(tool.name),`Ready-marked tool lacks declared implementation mapping: ${tool.name}`);
const adminLayout=fs.readFileSync(path.join(root,'app/admin/page.tsx'),'utf8');
const authSource=fs.readFileSync(path.join(root,'lib/auth.ts'),'utf8');
const settingsApi=fs.readFileSync(path.join(root,'app/api/admin/settings/route.ts'),'utf8');
assert.match(adminLayout,/getServerSession/); assert.match(adminLayout,/redirect\('\/admin\/login'\)/);
assert.match(authSource,/bcrypt\.compare/); assert.match(authSource,/maxAge: 60 \* 60 \* 8/);
assert.match(settingsApi,/requireAdmin/); assert.match(settingsApi,/prisma\.siteSetting\.findMany/); assert.match(settingsApi,/prisma\.siteSetting\.upsert/); assert.match(settingsApi,/prisma\.activityLog\.create/);
  const operationsApi=fs.readFileSync(path.join(root,'app/api/admin/operations/route.ts'),'utf8'); assert.match(operationsApi,/requireAdmin/); assert.match(operationsApi,/usageEvent\.findMany/); assert.match(operationsApi,/activityLog\.findMany/);
console.log(`PASS: TS/TSX parse, catalog (${categoryNames.length} categories, ${tools.length} entries, ${activeTools.length} ready), text Unicode, search-replace, SEO and WCAG contrast smoke tests`);
const serverText=load('lib/server-text.ts');
assert.equal(serverText.runServerTextOperation('toolixa','uppercase').result,'TOOLIXA');
assert.equal(serverText.runServerTextOperation('A😀B','reverse').result,'B😀A');
assert.equal(serverText.runServerTextOperation('aGVsbG8=','base64-decode').result,'hello');
assert.throws(()=>serverText.runServerTextOperation('%%%','base64-decode'),/valid Base64/);
assert.throws(()=>serverText.runServerTextOperation('%E0%A4%A','url-decode'),/URL-encoded/);
assert.equal(serverText.isServerTextOperation('slug'),true);
assert.equal(serverText.isServerTextOperation('delete-files'),false);
console.log('PASS: server text API operation library, Unicode, strict Base64 and malformed URL validation');

// Route-level tests with a minimal NextResponse shim. This exercises actual handler logic without installing Next.js.
function loadRoute(relative){
  const source=fs.readFileSync(path.join(root,relative),'utf8');
  const res=ts.transpileModule(source,{fileName:relative,reportDiagnostics:true,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}});
  assert.equal(res.diagnostics.length,0,`Syntax errors in ${relative}`);
  const mockNext={NextResponse:{json:(data,init={})=>Response.json(data,init)}};
  const m={exports:{}};
  new Function('module','exports','require',res.outputText)(m,m.exports,(name)=>{if(name==='next/server')return mockNext;if(name==='../../../../lib/server-text')return load('lib/server-text.ts');if(name==='../../../../lib/prisma'||name==='../lib/prisma')return {prisma:{siteSetting:{findUnique:async()=>null}}};if(name==='../../../../lib/catalog'||name==='../lib/catalog')return load('lib/catalog.ts');return require(name)});
  return m.exports;
}
(async()=>{
  const health=loadRoute('app/api/health/route.ts');
  const healthResponse=await health.GET();
  assert.equal(healthResponse.status,200);
  assert.equal(healthResponse.headers.get('cache-control'),'no-store');
  assert.equal((await healthResponse.json()).version,'3.1.0');

  const siteConfigSource=fs.readFileSync(path.join(root,'app/api/site/config/route.ts'),'utf8');
  assert.match(siteConfigSource,/findUnique/); assert.match(siteConfigSource,/Cache-Control/); assert.doesNotMatch(siteConfigSource,/customCss/); // private fields are explicitly not included in the public response
  const siteConfig=loadRoute('app/api/site/config/route.ts');
  // With no DATABASE_URL, the endpoint must return safe defaults and no private admin data.
  const previousDb=process.env.DATABASE_URL; delete process.env.DATABASE_URL;
  const publicConfigResponse=await siteConfig.GET(); const publicConfigBody=await publicConfigResponse.json();
  assert.equal(publicConfigResponse.status,200); assert.equal(publicConfigBody.config.siteName,'TOOLIXA');
  assert.equal(publicConfigBody.config.accent,'#9b87ff'); assert.equal('customCss' in publicConfigBody.config,false);
  if(previousDb!==undefined)process.env.DATABASE_URL=previousDb;
  const catalogRoute=loadRoute('app/api/tools/catalog/route.ts');
  const catalogResponse=await catalogRoute.GET();
  const catalogBody=await catalogResponse.json();
  assert.equal(catalogResponse.status,200);
  assert.equal(catalogBody.version,'3.1.0');
  assert.deepEqual(catalogBody.summary,{categories:52,catalogConcepts:1040,readyMarked:88,planned:952});
  assert.equal(catalogBody.readyTools.length,88);
  const sitemapModule=loadRoute('app/sitemap.ts');
  const sitemap=await sitemapModule.default();
  assert.equal(sitemap.length,89,'sitemap should include home plus every ready-marked tool route');
  assert.ok(sitemap.some((entry)=>entry.url==='https://toolixaza.com/tools/image-tools/image-compressor'));
  const expectedRoutes=activeTools.map((tool)=>`https://toolixaza.com/tools/${tool.category.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}/${tool.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`);
  assert.deepEqual(new Set(sitemap.slice(1).map((entry)=>entry.url)),new Set(expectedRoutes),'every ready-marked tool route should appear in the sitemap');
  const api=loadRoute('app/api/tools/text/route.ts');
  async function post(payload,headers={'content-type':'application/json'}){
    return api.POST(new Request('http://localhost/api/tools/text',{method:'POST',headers,body:typeof payload==='string'?payload:JSON.stringify(payload)}));
  }
  let response=await post({operation:'uppercase',text:'hello toolixa'});
  assert.equal(response.status,200); assert.equal((await response.json()).result,'HELLO TOOLIXA');
  response=await post({operation:'reverse',text:'A😀B'}); assert.equal((await response.json()).result,'B😀A');
  response=await post({operation:'not-an-operation',text:'x'}); assert.equal(response.status,400);
  response=await post({operation:'uppercase',text:'x'},{'content-type':'text/plain'}); assert.equal(response.status,415);
  response=await post('{bad json'); assert.equal(response.status,400);
  response=await post({operation:'uppercase',text:7}); assert.equal(response.status,400);
  response=await post({operation:'url-decode',text:'%E0%A4%A'}); assert.equal(response.status,422);
  response=await post({operation:'base64-decode',text:'%%%'}); assert.equal(response.status,422);
  response=await post({operation:'uppercase',text:'x'.repeat(200001)}); assert.equal(response.status,413);
  console.log('PASS: API route integration cases (health, catalog, sitemap, valid request, content type, malformed JSON, schema, operation allowlist, processing errors, and text-size limit)');
})().catch(error=>{console.error(error);process.exitCode=1});
