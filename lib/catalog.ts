export const categoryNames = [
'Image Tools','Video Tools','Audio Tools','PDF Tools','Document Tools','File Tools','AI Tools','Text Tools','QR & Barcode','Color Tools','SEO Tools','YouTube Tools','Developer Tools','CSS Tools','HTML Tools','JavaScript Tools','JSON Tools','XML Tools','CSV Tools','Spreadsheet Tools','Markdown Tools','Writing Tools','Social Media','Marketing Tools','Design Tools','Typography','Icon Tools','Font Tools','Screenshot Tools','Website Tools','Security Tools','Privacy Tools','Encryption Tools','Hash Tools','Password Tools','URL Tools','Domain Tools','Network Tools','Data Tools','Math Tools','Unit Converters','Time & Date','Finance Tools','Productivity','Education Tools','Accessibility','Email Tools','Business Tools','E-commerce','Compression Tools','Metadata Tools','Generators'];
export type Tool = {id:string;name:string;category:string;description:string;kind:'image'|'text'|'pdf'|'file'|'qr'|'seo'|'color'|'utility';live:boolean};
const named:Record<string,string[]>={
'Image Tools':['Image Compressor','Image Converter','Image Resizer','Image Rotator','Image Flipper','Grayscale Image','Blur Image','Image Quality Optimizer','PNG to JPG','JPG to WebP','WebP to PNG','Image Dimensions','Image Metadata','Image Cropper','Image Watermark','Image Background Remover','Image Upscaler','Image Color Picker','Image Border Maker','Image Format Checker'],
'PDF Tools':['Merge PDF','Split PDF','Rotate PDF','PDF Page Count','PDF Metadata','Compress PDF','Protect PDF','Unlock PDF','PDF to Images','Images to PDF','Delete PDF Pages','Reorder PDF Pages','Watermark PDF','Extract PDF Text','PDF to Word','Word to PDF','Sign PDF','PDF Form Filler','Crop PDF','Flatten PDF'],
'Text Tools':['Word Counter','Character Counter','Uppercase Converter','Lowercase Converter','Title Case Converter','Remove Extra Spaces','Reverse Text','Text Sorter','Remove Duplicate Lines','Text to Slug','Find and Replace','Sentence Counter','Line Counter','Reading Time','Text Diff','Base64 Encoder','Base64 Decoder','URL Encoder','URL Decoder','Text Cleaner'],
'QR & Barcode':['QR Code Generator','QR Code Download','URL QR Code','WiFi QR Code','Email QR Code','Phone QR Code','SMS QR Code','Contact QR Code','Text QR Code','QR Code Preview','Barcode Generator','EAN Generator','UPC Generator','Code 128 Generator','QR Code Colors','QR Error Correction','QR Bulk Export','QR Sticker','QR Logo Overlay','QR SVG Export'],
'SEO Tools':['Meta Tag Generator','SERP Preview','Title Length Checker','Description Length Checker','Robots Tag Builder','Canonical Tag Builder','Open Graph Builder','Twitter Card Builder','Schema Validator','Keyword Density','Sitemap Generator','Robots.txt Generator','Slug Generator','Heading Analyzer','Internal Link Planner','Image Alt Checker','SEO Checklist','Redirect Mapper','Hreflang Builder','Structured Data Builder'],
'Color Tools':['HEX to RGB','RGB to HEX','Contrast Ratio','Color Palette Generator','Color Inverter','HSL Converter','Gradient Generator','Color Shades','Accessible Color Check','Color Harmonies','Color Name Finder','Color Mixer','Alpha Converter','Random Color','CSS Color Variables','Brand Palette','Color Temperature','Color Blindness Preview','Color Picker','Color Export'],
'File Tools':['ZIP Creator','File Size Inspector','File Type Inspector','File Renamer','File Organizer','ZIP Extractor','Checksum Generator','Batch Rename','Duplicate Finder','File Splitter','File Joiner','Folder ZIP','MIME Detector','Extension Checker','File Preview','File Manifest','Binary Inspector','File List Export','File Date Inspector','File Compressor']};
const sl=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const tools:Tool[]=categoryNames.flatMap((category)=>{
 const entries=named[category]||Array.from({length:20},(_,i)=>`${category.replace(' Tools','')} ${['Converter','Analyzer','Builder','Optimizer','Formatter','Generator','Inspector','Validator','Editor','Toolkit','Assistant','Calculator','Preview','Cleaner','Merger','Splitter','Exporter','Importer','Checker','Studio'][i]}`);
 return entries.map((name,i)=>({id:`${sl(category)}--${sl(name)}`,name,category,description:`${name} in a private, streamlined TOOLIXA workspace.`,kind:category==='Image Tools'?'image':category==='PDF Tools'?'pdf':category==='File Tools'?'file':category==='QR & Barcode'?'qr':category==='SEO Tools'?'seo':category==='Color Tools'?'color':category==='Text Tools'?'text':'utility',live:({
 'Image Tools':[0,1,2,3,4,5,6,7,8,9,10,11,12,19],
 'PDF Tools':[0,1,2,3,4,10],
 'Text Tools':Array.from({length:20},(_,i)=>i),
 'QR & Barcode':[0,1,2,3,4,5,6,8,9,14],
 'SEO Tools':[0,1,2,3,4,5,6,7,9,11,12,13,16,19],
 'Color Tools':[0,2,3,4,5,6,7,8,13,15,18,19],
 'File Tools':[0,1,2,3,5,6,7,8,12,13,17,18]
 } as Record<string,number[]>)[category]?.includes(i)??false}));
});
export const activeTools=tools.filter(t=>t.live);
export const slug=sl;
