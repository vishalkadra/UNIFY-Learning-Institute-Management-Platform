import { useEffect, useState } from "react";
import API, { getApiError } from "./api";
import { Send, Trash2 } from "lucide-react";

export default function ManageNotifications() {
  const token=localStorage.getItem("token"), headers={Authorization:`Bearer ${token}`};
  const [users,setUsers]=useState([]),[items,setItems]=useState([]),[form,setForm]=useState({user:"",title:"",message:""}),[error,setError]=useState("");

  const load=async()=>{try{
    const [u,n]=await Promise.all([API.get("/users/",{headers}),API.get("/learning/notifications/",{headers})]);
    setUsers(u.data.results||u.data||[]);setItems(n.data.results||n.data||[]);
  }catch(e){setError(getApiError(e,"Could not load notifications."));}};
  useEffect(()=>{load()},[]);
  const send=async e=>{e.preventDefault();try{
    await API.post("/learning/notifications/",{...form,user:form.user||null},{headers});
    setForm({user:"",title:"",message:""});load();
  }catch(e){setError(getApiError(e,"Could not send notification."));}};
  const del=async id=>{if(confirm("Delete this notification?")){await API.delete(`/learning/notifications/${id}/`,{headers});load();}};
  return <>
    <div className="page-hero"><div className="container"><span className="page-hero__eyebrow">Staff / Admin</span><h1>Manage Notifications</h1></div></div>
    <div className="container page-body">
    {error&&<div className="alert alert-danger" role="alert">{error}</div>}
    <div className="form-card mb-4">
      <form onSubmit={send} className="row g-3">
        <div className="col-md-4"><label className="form-label">Send to</label><select className="form-select" value={form.user} onChange={e=>setForm({...form,user:e.target.value})}><option value="">All students</option>{users.map(u=><option key={u.id} value={u.id}>{u.first_name} {u.last_name} — {u.email}</option>)}</select></div>
        <div className="col-md-8"><label className="form-label">Title</label><input className="form-control" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
        <div className="col-12"><label className="form-label">Message</label><textarea className="form-control" rows="4" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required/></div>
        <div className="col-12"><button className="btn btn-primary"><Send size={16}/> Send Notification</button></div>
      </form>
    </div>
    <div className="row g-3">{items.map(x=><div className="col-md-6" key={x.id}><div className="ui-card"><div className="d-flex justify-content-between gap-2"><h5>{x.title}</h5><button className="btn btn-sm btn-outline-danger align-self-start" aria-label="Delete notification" onClick={()=>del(x.id)}><Trash2 size={14}/></button></div><p className="mb-1">{x.message}</p><small className="text-muted">{x.user ? x.user : "Student notification"} · {new Date(x.created_at).toLocaleString("en-IN")}</small></div></div>)}</div>
    </div>
  </>;
}
