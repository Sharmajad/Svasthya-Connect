function Register(){

return(

<div className="container mt-5" style={{maxWidth:"500px"}}>

<h2 className="text-center mb-4">
Patient Register
</h2>

<form>

<div className="mb-3">
<label className="form-label">Full Name</label>
<input type="text" className="form-control" required />
</div>

<div className="mb-3">
<label className="form-label">Email</label>
<input type="email" className="form-control" required />
</div>

<div className="mb-3">
<label className="form-label">Password</label>
<input type="password" className="form-control" required />
</div>

<button className="btn btn-primary w-100">
Register
</button>

</form>

</div>

)

}

export default Register