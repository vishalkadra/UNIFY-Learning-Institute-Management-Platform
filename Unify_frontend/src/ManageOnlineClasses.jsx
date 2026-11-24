import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import API, { getApiError } from "./api";

const empty = { course:"", title:"", description:"", start_at:"", duration_minutes:60, meeting_url:"", recording_url:"", is_active:true };

export default function ManageOnlineClasses() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const [courses,setCourses]=useState([]), [classes,setClasses]=useState([]), [form,setForm]=useState(empty);
  const [editId,setEditId]=useState(null), [error,setError]=useState("");

  const load=async()=> {
    try {
      const [c,k]=await Promise.all([API.get("/courses/"),API.get("/learning/classes/",{headers})]);
      setCourses(c.data.results||c.data||[]); setClasses(k.data.results||k.data||[]);
    } catch(e){setError(getApiError(e,"Could not load classes."));}
  };
  useEffect(()=>{load()},[]);

  const change=e=>setForm({...form,[e.target.name]:e.target.type==="checkbox"?e.target.checked:e.target.value});
  const save=async e=>{
    e.preventDefault(); setError("");
    try {
      const data={...form,duration_minutes:Number(form.duration_minutes),start_at:new Date(form.start_at).toISOString()};
      if(editId) await API.patch(`/learning/classes/${editId}/`,data,{headers});
      else await API.post("/learning/classes/",data,{headers});
      setForm(empty);setEditId(null);load();
    } catch(e){setError(getApiError(e,"Could not save class."));}
  };
  const remove=async id=>{if(confirm("Delete this class?")){await API.delete(`/learning/classes/${id}/`,{headers});load();}};
  const edit=x=>setEditId(x.id)||setForm({...x,start_at:new Date(x.start_at).toISOString().slice(0,16)});

  return <>
    <div className="page-hero"><div className="container d-flex flex-wrap justify-content-between align-items-end gap-3">
      <div><span className="page-hero__eyebrow">Staff / Admin</span><h1 className="mb-0">Manage Online Classes</h1></div>
      <button className="btn btn-light" onClick={()=>{setForm(empty);setEditId(null)}}><Plus size={17}/> Add Class</button>
    </div></div>
    <div className="container page-body">
    {error&&<div className="alert alert-danger" role="alert">{error}</div>}
    <div className="form-card mb-4">
      <h5 className="mb-3">{editId?"Edit class":"Add online class"}</h5>
      <form onSubmit={save} className="row g-3">
        <div className="col-md-6"><label className="form-label">Course</label><select className="form-select" name="course" value={form.course} onChange={change} required><option value="">Select course</option>{courses.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></div>
        <div className="col-md-6"><label className="form-label">Class title</label><input className="form-control" name="title" value={form.title} onChange={change} required/></div>
        <div className="col-md-6"><label className="form-label">Start date & time</label><input className="form-control" type="datetime-local" name="start_at" value={form.start_at} onChange={change} required/></div>
        <div className="col-md-6"><label className="form-label">Duration (minutes)</label><input className="form-control" type="number" name="duration_minutes" value={form.duration_minutes} onChange={change} min="1"/></div>
        <div className="col-12"><label className="form-label">Description</label><textarea className="form-control" name="description" value={form.description} onChange={change}/></div>
        <div className="col-md-6"><label className="form-label">Live meeting URL</label><input className="form-control" name="meeting_url" value={form.meeting_url} onChange={change} placeholder="Zoom / Google Meet link"/></div>
        <div className="col-md-6"><label className="form-label">Recording URL</label><input className="form-control" name="recording_url" value={form.recording_url} onChange={change}/></div>
        <div className="col-12 form-check ms-2"><input className="form-check-input" type="checkbox" name="is_active" checked={form.is_active} onChange={change}/><label className="form-check-label">Visible to enrolled students</label></div>
        <div className="col-12"><button className="btn btn-primary">{editId?"Update Class":"Create Class"}</button></div>
      </form>
    </div>
    <div className="row g-3">{classes.map(x=><div className="col-lg-6" key={x.id}><div className="ui-card"><div className="d-flex justify-content-between"><div><h5>{x.title}</h5><div className="text-muted small">{x.course_name}</div></div><span className="pill pill-neutral">{x.state}</span></div><p className="small mt-2 mb-3">{new Date(x.start_at).toLocaleString("en-IN")}</p><button className="btn btn-sm btn-outline-primary me-2" onClick={()=>edit(x)}><Pencil size={14}/> Edit</button><button className="btn btn-sm btn-outline-danger" onClick={()=>remove(x.id)}><Trash2 size={14}/> Delete</button></div></div>)}</div>
    </div>
  </>;
}
