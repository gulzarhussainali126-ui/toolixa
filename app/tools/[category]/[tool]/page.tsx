import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Workbench from '../../../../components/Workbench';
import {activeTools,slug} from '../../../../lib/catalog';
type ToolRouteParams={category:string;tool:string};
type Params={params:Promise<ToolRouteParams>};
const find=(p:ToolRouteParams)=>activeTools.find(t=>slug(t.category)===p.category&&slug(t.name)===p.tool);
export function generateStaticParams(){return activeTools.map(t=>({category:slug(t.category),tool:slug(t.name)}))}
export async function generateMetadata({params}:Params):Promise<Metadata>{const route=await params;const t=find(route);if(!t)return {title:'Tool not found',robots:{index:false}};return {title:`${t.name} — Free Online Tool`,description:`Use TOOLIXA ${t.name} with a premium interface. Process supported files and content in your browser. Simple, easy-to-use and privacy-minded.`,alternates:{canonical:`/tools/${route.category}/${route.tool}`},openGraph:{title:`${t.name} | TOOLIXA`,description:t.description,url:`/tools/${route.category}/${route.tool}`}}}
export default async function ToolPage({params}:Params){const route=await params;const t=find(route);if(!t)notFound();return <><Workbench initialId={t.id}/><section className="sr-only"><h2>About {t.name}</h2><p>{t.description} TOOLIXA provides a browser-first interface for everyday tasks.</p><h3>How to use {t.name}</h3><p>Select or upload your input, choose available actions, process your content and download the results.</p></section></>}
