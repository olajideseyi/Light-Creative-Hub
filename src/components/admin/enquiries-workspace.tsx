"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type Enquiry = {
  id:string; created_at:string; name:string; email:string; phone:string|null;
  service:string; quantity:string|null; deadline:string|null; budget:string|null;
  company:string|null; details:string; status:"new"|"in_progress"|"quoted"|"completed"|"closed";
};
const statuses:Enquiry["status"][]=["new","in_progress","quoted","completed","closed"];
const statusLabel:Record<Enquiry["status"],string>={new:"New",in_progress:"In progress",quoted:"Quoted",completed:"Completed",closed:"Closed"};
const dateLabel=(value:string)=>new Intl.DateTimeFormat("en-NG",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value));
const phoneDigits=(value:string|null)=>value?.replace(/\D/g,"")??"";

export function EnquiriesWorkspace(){
 const [items,setItems]=useState<Enquiry[]>([]);
 const [selectedId,setSelectedId]=useState<string|null>(null);
 const [filter,setFilter]=useState<"all"|Enquiry["status"]>("all");
 const [query,setQuery]=useState("");
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [notice,setNotice]=useState("");
 const [authorised,setAuthorised]=useState(false);
 const load=useCallback(async()=>{
  const client=getSupabaseBrowserClient();
  const {data:session,error:sessionError}=await client.auth.getSession();
  const user=session.session?.user;
  if(sessionError||!user)throw new Error("Your administrator session has expired. Return to the Admin sign-in page.");
  const {data:admin,error:adminError}=await client.from("admin_users").select("user_id").eq("user_id",user.id).maybeSingle();
  if(adminError||!admin)throw new Error("This account is not approved to view client enquiries.");
  const {data,error:queryError}=await client.from("enquiries").select("id,created_at,name,email,phone,service,quantity,deadline,budget,company,details,status").order("created_at",{ascending:false});
  if(queryError)throw queryError;
  setItems((data??[]) as Enquiry[]);
  setAuthorised(true);
 },[]);
 useEffect(()=>{let active=true;load().catch(e=>{if(active)setError(e instanceof Error?e.message:"Could not load enquiries.");}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[load]);
 const filtered=useMemo(()=>items.filter(item=>(filter==="all"||item.status===filter)&&(!query||[item.name,item.email,item.company??"",item.service].join(" ").toLowerCase().includes(query.toLowerCase()))),[items,filter,query]);
 const selected=items.find(item=>item.id===selectedId)??filtered[0]??null;
 async function updateStatus(status:Enquiry["status"]){
  if(!selected)return;setBusy(true);setError("");setNotice("");
  try{const {error:e}=await getSupabaseBrowserClient().from("enquiries").update({status}).eq("id",selected.id);if(e)throw e;setItems(current=>current.map(item=>item.id===selected.id?{...item,status}:item));setNotice("Enquiry status updated.");}
  catch(e){setError(e instanceof Error?e.message:"Could not update enquiry.");}finally{setBusy(false);}
 }
 const counts={all:items.length,new:items.filter(x=>x.status==="new").length,in_progress:items.filter(x=>x.status==="in_progress").length,quoted:items.filter(x=>x.status==="quoted").length,completed:items.filter(x=>x.status==="completed").length,closed:items.filter(x=>x.status==="closed").length};
 return <main className="admin-page enquiries-page"><div className="admin-shell">
  <header className="enquiries-topbar"><a href="/admin" className="enquiries-brand"><span className="admin-brand-mark">L</span><span><strong>LIGHT CREATIVE HUB</strong><small>CLIENT ENQUIRIES</small></span></a><a href="/admin" className="enquiries-back">Back to dashboard</a></header>
  <div className="enquiries-heading"><div><span className="cms-eyebrow">CLIENT RELATIONSHIPS</span><h1>Enquiries</h1><p>Review project briefs, follow up with clients and keep each request moving.</p></div><span className="enquiries-total">{items.length} TOTAL</span></div>
  {error&&<p role="alert" className="form-error">{error}</p>}{notice&&<p role="status" className="form-message">{notice}</p>}
  {loading?<div className="enquiries-loading">Loading enquiries…</div>:!authorised?<section className="enquiries-empty"><h2>Admin access required</h2><p>{error||"Sign in with your approved administrator account."}</p><a className="button button-blue" href="/admin">Go to Admin sign in</a></section>:<>
   <div className="enquiries-metrics"><article><span>NEW</span><strong>{counts.new}</strong></article><article><span>IN PROGRESS</span><strong>{counts.in_progress}</strong></article><article><span>QUOTED</span><strong>{counts.quoted}</strong></article><article><span>COMPLETED</span><strong>{counts.completed}</strong></article></div>
   <div className="enquiries-workspace"><section className="enquiries-list-panel"><div className="enquiries-list-head"><h2>All enquiries</h2><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, email or service" aria-label="Search enquiries"/></div><div className="enquiries-filters"><button className={filter==="all"?"active":""} onClick={()=>setFilter("all")}>All ({counts.all})</button><button className={filter==="new"?"active":""} onClick={()=>setFilter("new")}>New ({counts.new})</button><button className={filter==="in_progress"?"active":""} onClick={()=>setFilter("in_progress")}>In progress</button><button className={filter==="quoted"?"active":""} onClick={()=>setFilter("quoted")}>Quoted</button><button className={filter==="completed"?"active":""} onClick={()=>setFilter("completed")}>Completed</button></div>
    <div className="enquiries-list">{filtered.map(item=><button type="button" key={item.id} className={"enquiry-row"+((selected?.id===item.id)?" selected":"")} onClick={()=>setSelectedId(item.id)}><span className="enquiry-row-top"><strong>{item.name}</strong><small>{dateLabel(item.created_at)}</small></span><span>{item.service}</span><span className={"enquiry-status status-"+item.status}>{statusLabel[item.status]}</span><small>{item.email}</small></button>)}{filtered.length===0&&<div className="enquiries-empty-list">No enquiries match this view.</div>}</div>
   </section>
   <section className="enquiry-detail-panel">{selected?<><div className="enquiry-detail-head"><div><span className="cms-eyebrow">PROJECT REQUEST</span><h2>{selected.name}</h2><p>{selected.service}</p></div><select aria-label="Update enquiry status" value={selected.status} disabled={busy} onChange={e=>void updateStatus(e.target.value as Enquiry["status"])}>{statuses.map(status=><option key={status} value={status}>{statusLabel[status]}</option>)}</select></div>
    <div className="enquiry-contact-actions"><a href={"mailto:"+selected.email+"?subject="+encodeURIComponent("Re: Your enquiry to Light Creative Hub")}>Email client ↗</a>{selected.phone&&<a href={"https://wa.me/"+phoneDigits(selected.phone)+"?text="+encodeURIComponent("Hello "+selected.name+", thank you for contacting Light Creative Hub about "+selected.service+".")} target="_blank" rel="noreferrer">WhatsApp client ↗</a>}{selected.phone&&<a href={"tel:"+selected.phone.replace(/[^+\d]/g,"")}>Call client</a>}</div>
    <dl className="enquiry-facts"><div><dt>Email</dt><dd>{selected.email}</dd></div><div><dt>Phone</dt><dd>{selected.phone||"Not provided"}</dd></div><div><dt>Company</dt><dd>{selected.company||"Not provided"}</dd></div><div><dt>Received</dt><dd>{dateLabel(selected.created_at)}</dd></div><div><dt>Quantity</dt><dd>{selected.quantity||"Not provided"}</dd></div><div><dt>Budget</dt><dd>{selected.budget||"Not provided"}</dd></div><div><dt>Preferred deadline</dt><dd>{selected.deadline||"Not provided"}</dd></div></dl>
    <div className="enquiry-brief"><span className="cms-eyebrow">CLIENT BRIEF</span><p>{selected.details}</p></div>
   </>:<div className="enquiries-empty"><h2>No enquiries yet</h2><p>New project briefs submitted through the website will appear here.</p></div>}</section></div>
  </>}
 </div></main>;
}
