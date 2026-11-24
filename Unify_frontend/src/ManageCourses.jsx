import{useEffect,useState}from"react";
import API,{getApiError}from"./api";
import{Reveal}from"./motion3d";
import{Trash2,Pencil,BookOpen,Clock,Plus,RefreshCw,GraduationCap,AlertCircle,IndianRupee,Image as ImageIcon,ChevronDown,ChevronUp,Layers,X}from"lucide-react";

function ManageCourses(){
const[courses,setCourses]=useState([]),[loading,setLoading]=useState(true),[refreshing,setRefreshing]=useState(false),[error,setError]=useState("");
const[showCourseForm,setShowCourseForm]=useState(false),[addingCourse,setAddingCourse]=useState(false),[editingCourse,setEditingCourse]=useState(null);
const[courseForm,setCourseForm]=useState({name:"",description:"",duration:"",price:"",image:null});
const[moduleForms,setModuleForms]=useState({}),[expandedCourse,setExpandedCourse]=useState(null);
const token=localStorage.getItem("token");

const loadCourses=async()=>{
try{setError("");const r=await API.get("/courses/");setCourses(r.data)}
catch(e){setError(getApiError(e,"Unable to load courses."))}
finally{setLoading(false);setRefreshing(false)}
};

useEffect(()=>{loadCourses()},[]);

const courseChange=e=>{
const{name,value,files}=e.target;
setCourseForm(p=>({...p,[name]:files?files[0]:value}));
};

const saveCourse=async e=>{
e.preventDefault();
if(!courseForm.name.trim())return alert("Course name is required.");
if(!courseForm.description.trim())return alert("Course description is required.");
if(!courseForm.duration.trim())return alert("Course duration is required.");
if(!courseForm.price)return alert("Course price is required.");

try{
setAddingCourse(true);
const fd=new FormData();
["name","description","duration","price"].forEach(x=>fd.append(x,courseForm[x]));
if(courseForm.image)fd.append("image",courseForm.image);

if(editingCourse)
await API.patch(`/courses/${editingCourse.id}/`,fd,{headers:{Authorization:`Bearer ${token}`}});
else
await API.post("/courses/",fd,{headers:{Authorization:`Bearer ${token}`}});

alert(editingCourse?"Course updated successfully!":"Course added successfully!");
closeCourseForm();loadCourses();
}catch(e){setError(getApiError(e,editingCourse?"Unable to update course.":"Unable to add course."))}
finally{setAddingCourse(false)}
};

const handleEdit=course=>{
setEditingCourse(course);
setCourseForm({
name:course.name||"",
description:course.description||"",
duration:course.duration||"",
price:course.price||"",
image:null
});
setShowCourseForm(true);
};

const closeCourseForm=()=>{
setShowCourseForm(false);setEditingCourse(null);
setCourseForm({name:"",description:"",duration:"",price:"",image:null});
};

const deleteCourse=async id=>{
if(!confirm("Are you sure you want to delete this course?"))return;
try{
await API.delete(`/courses/${id}/`,{headers:{Authorization:`Bearer ${token}`}});
alert("Course deleted successfully!");loadCourses();
}catch(e){setError(getApiError(e,"Unable to delete course."))}
};

const moduleChange=(id,field,value)=>
setModuleForms(p=>({...p,[id]:{...(p[id]||{}),[field]:value}}));

const saveModule=async courseId=>{
const f=moduleForms[courseId];
if(!f?.title?.trim())return alert("Module title is required.");
if(!f?.description?.trim())return alert("Module description is required.");

try{
await API.post("/course-modules/",{
course:courseId,
title:f.title,
description:f.description
},{headers:{Authorization:`Bearer ${token}`}});

alert("Module added successfully!");
setModuleForms(p=>({...p,[courseId]:{title:"",description:""}}));
loadCourses();
}catch(e){setError(getApiError(e,"Unable to add module."))}
};

const deleteModule=async id=>{
if(!confirm("Are you sure you want to delete this module?"))return;
try{
await API.delete(`/course-modules/${id}/`,{headers:{Authorization:`Bearer ${token}`}});
alert("Module deleted successfully!");loadCourses();
}catch(e){setError(getApiError(e,"Unable to delete module."))}
};

if(loading)return<div className="container py-5 text-center"><div className="spinner-border text-primary"/><p className="mt-3 text-muted" role="status">Loading courses...</p></div>;

return(
<>
<div className="page-hero">
  <div className="container d-flex flex-wrap justify-content-between align-items-end gap-3">
    <div className="d-flex align-items-center gap-3">
      <span className="icon-badge icon-badge--lg" aria-hidden="true" style={{background:"rgba(255,255,255,0.14)",color:"#fff"}}><GraduationCap size={30}/></span>
      <div>
        <h1 className="mb-1">Manage Courses</h1>
        <p>Add, edit, delete and manage course curriculum.</p>
      </div>
    </div>

    <div className="d-flex gap-2">
      <button type="button" className="btn btn-outline-light" onClick={()=>{setRefreshing(true);loadCourses()}} disabled={refreshing}>
        <RefreshCw size={17}/> Refresh
      </button>

      <button type="button" className="btn btn-light" onClick={()=>showCourseForm?closeCourseForm():setShowCourseForm(true)}>
        {showCourseForm?<X size={18}/>:<Plus size={18}/>}
        <span>{showCourseForm?"Close":"Add Course"}</span>
      </button>
    </div>
  </div>
</div>

<div className="container page-body">

{error&&<div className="alert alert-danger d-flex align-items-center gap-2" role="alert"><AlertCircle size={20}/>{error}<button type="button" className="btn-close ms-auto" aria-label="Dismiss" onClick={()=>setError("")}/></div>}

{showCourseForm&&<Reveal>
<div className="card mb-4"><div className="card-body p-4">
<h4>{editingCourse?"Edit Course":"Add New Course"}</h4>
<p className="text-muted">{editingCourse?"Update course information.":"Create a new course for students."}</p>

<form onSubmit={saveCourse}>
<div className="row g-3">

<div className="col-md-6">
<label className="form-label" htmlFor="course-name">Course Name</label>
<input id="course-name" name="name" className="form-control" value={courseForm.name} onChange={courseChange} placeholder="Enter course name"/>
</div>

<div className="col-md-3">
<label className="form-label" htmlFor="course-duration">Duration</label>
<input id="course-duration" name="duration" className="form-control" value={courseForm.duration} onChange={courseChange} placeholder="e.g. 6 Months"/>
</div>

<div className="col-md-3">
<label className="form-label" htmlFor="course-price">Price</label>
<div className="input-group"><span className="input-group-text"><IndianRupee size={16}/></span><input id="course-price" type="number" name="price" className="form-control" value={courseForm.price} onChange={courseChange}/></div>
</div>

<div className="col-12">
<label className="form-label" htmlFor="course-description">Description</label>
<textarea id="course-description" name="description" className="form-control" rows="4" value={courseForm.description} onChange={courseChange} placeholder="Enter course description"/>
</div>

<div className="col-12">
<label className="form-label" htmlFor="course-image">Course Image</label>
<div className="input-group"><span className="input-group-text"><ImageIcon size={18}/></span><input id="course-image" type="file" name="image" className="form-control" accept="image/*" onChange={courseChange}/></div>
{editingCourse&&<small className="text-muted">Leave empty to keep existing image.</small>}
</div>

</div>

<button disabled={addingCourse} className="btn btn-primary btn-lg w-100 mt-4">
{addingCourse?(editingCourse?"Updating Course...":"Adding Course..."):(editingCourse?"Update Course":"Add Course")}
</button>
</form>

</div></div>
</Reveal>}

{courses.length===0?
<div className="empty-state"><GraduationCap size={50} className="text-muted" aria-hidden="true"/><h5 className="mt-3">No Courses Found</h5></div>
:
<div className="row g-4">

{courses.map(course=>{
const open=expandedCourse===course.id,form=moduleForms[course.id]||{};

return(
<div className="col-12" key={course.id}>
<Reveal>
<div className="card"><div className="card-body p-4">
<div className="row g-4">

<div className="col-md-3">
{course.image?<img src={course.image} alt={course.name} className="manage-thumb"/>:
<div className="manage-thumb manage-thumb--empty"><BookOpen size={55} className="text-muted" aria-hidden="true"/></div>}
</div>

<div className="col-md-9">
<h4>{course.name}</h4>
<p className="text-muted">{course.description}</p>

<div className="d-flex flex-wrap gap-2 mb-4">
<span className="meta-chip"><Clock size={15}/> {course.duration}</span>
<span className="meta-chip"><IndianRupee size={15}/> {course.price}</span>
<span className="meta-chip"><Layers size={15}/> ID: {course.id}</span>
</div>

<div className="d-flex flex-wrap gap-2">
<button type="button" onClick={()=>setExpandedCourse(open?null:course.id)} className="btn btn-outline-primary" aria-expanded={open}>
{open?<ChevronUp size={18}/>:<ChevronDown size={18}/>} Curriculum
</button>

<button type="button" onClick={()=>handleEdit(course)} className="btn btn-outline-warning">
<Pencil size={18}/> Edit
</button>

<button type="button" onClick={()=>deleteCourse(course.id)} className="btn btn-outline-danger">
<Trash2 size={18}/> Delete
</button>
</div>
</div>

</div>

{open&&<div className="border-top mt-4 pt-4">

<div className="d-flex align-items-center gap-2 mb-3"><BookOpen size={22} className="text-primary"/><h5 className="mb-0">Course Curriculum</h5></div>

{course.modules?.length?
<div className="mb-4">
{course.modules.map((module,index)=>(
<div key={module.id} className="module-row">
<div className="d-flex justify-content-between align-items-start gap-3">

<div>
<h6 className="fw-bold">{index+1}. {module.title}</h6>
<p className="text-muted mb-0">{module.description}</p>
</div>

<button type="button" className="btn btn-sm btn-outline-danger" aria-label="Delete module" onClick={()=>deleteModule(module.id)}>
<Trash2 size={15}/>
</button>

</div>
</div>
))}
</div>
:
<p className="text-muted">No modules added yet.</p>}

<div className="fact fact--block">
<h6 className="fw-bold mb-3">Add New Module</h6>

<div className="row g-2">

<div className="col-md-4">
<input className="form-control" aria-label="Module title" placeholder="Module title" value={form.title||""} onChange={e=>moduleChange(course.id,"title",e.target.value)}/>
</div>

<div className="col-md-6">
<input className="form-control" aria-label="Module description" placeholder="Module description" value={form.description||""} onChange={e=>moduleChange(course.id,"description",e.target.value)}/>
</div>

<div className="col-md-2">
<button type="button" className="btn btn-primary w-100" onClick={()=>saveModule(course.id)}>Add</button>
</div>

</div>
</div>

</div>}

</div></div>
</Reveal>
</div>
);
})}

</div>}

</div>
</>
);
}

export default ManageCourses;
