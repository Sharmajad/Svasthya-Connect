import { useState } from "react"

function Appointment(){

const [date,setDate] = useState("")
const [time,setTime] = useState("")

const slots = [
"10:00 AM",
"11:00 AM",
"12:00 PM",
"02:00 PM",
"03:00 PM",
"04:00 PM"
]

const handleSubmit = (e)=>{
e.preventDefault()

alert(`Appointment Booked on ${date} at ${time}`)
}

return(

<div className="container mt-5">

<h2 className="text-center mb-4">
Book Appointment
</h2>

<form onSubmit={handleSubmit}>

<div className="mb-3">

<label className="form-label">Patient Name</label>

<input
type="text"
className="form-control"
required
/>

</div>


<div className="mb-3">

<label className="form-label">Select Date</label>

<input
type="date"
className="form-control"
value={date}
onChange={(e)=>setDate(e.target.value)}
required
/>

</div>


<div className="mb-3">

<label className="form-label">Select Time Slot</label>

<div>

{slots.map((slot,index)=>(

<button
type="button"
key={index}
className={`btn m-1 ${
time === slot ? "btn-primary" : "btn-outline-primary"
}`}
onClick={()=>setTime(slot)}
>

{slot}

</button>

))}

</div>

</div>


<button className="btn btn-success">
Confirm Appointment
</button>

</form>

</div>

)

}

export default Appointment