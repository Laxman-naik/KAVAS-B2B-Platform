"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Package,
  MapPin,
  Calendar,
  Send,
  Ban,
  RefreshCcw,
  FileText,
  Clock,
  CheckCircle,
  ShoppingBag
} from "lucide-react";


const VendorRFQ = () => {


const [rfqs,setRfqs]=useState([]);

const [selected,setSelected]=useState(null);

const [search,setSearch]=useState("");

const [status,setStatus]=useState("All");

const [loading,setLoading]=useState(true);



const vendorId="YOUR_VENDOR_ORG_ID";



useEffect(()=>{

loadRFQs();

},[]);



const loadRFQs=async()=>{


try{


const res=await fetch(
"/api/vendor/rfqs",
{
headers:{
"vendor-id":vendorId
}
}
);


const data=await res.json();


setRfqs(data);


if(data.length)
{
setSelected(data[0]);
}


}

catch(err){

console.log(err);

}

finally{

setLoading(false);

}


};





const submitQuote=async()=>{


if(!selected)
return;


const quote={

rfq_id:selected.rfqs.id,

vendor_org_id:vendorId,

unit_price:0,

total_price:0,

delivery_days:10,

status:"submitted"

};



await fetch(
"/api/vendor/quotes",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(quote)

}

);



alert("Quote submitted");


loadRFQs();


};





const declineRFQ=async()=>{


await fetch(
`/api/vendor/rfqs/${selected.id}`,
{
method:"PATCH",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
status:"declined"
})
}
);



loadRFQs();


};





const filteredRFQs=rfqs.filter(item=>{


const title =
item.rfqs?.title
?.toLowerCase() || "";


const buyer =
item.rfqs?.organizations?.name
?.toLowerCase() || "";



const searchMatch =
(title.includes(search.toLowerCase())
||
buyer.includes(search.toLowerCase()));



const statusMatch =
status==="All"
||
item.status===status;



return searchMatch && statusMatch;


});






return (

<div className="min-h-screen bg-slate-100 p-8">


<div className="flex justify-between">


<h1 className="text-3xl font-bold">
RFQ Requests
</h1>



<div className="flex gap-3">

<FileText/>

<Clock/>

<CheckCircle/>

<ShoppingBag/>

</div>


</div>





<div className="bg-white p-5 rounded-xl mt-6 flex gap-3">



<div className="relative flex-1">


<Search
className="absolute left-3 top-3"
/>



<input

className="w-full border p-3 pl-10 rounded-lg"

placeholder="Search RFQ"

value={search}

onChange={
e=>setSearch(e.target.value)
}

/>


</div>




<select

className="border rounded-lg px-4"

onChange={
e=>setStatus(e.target.value)
}

>

<option>
All
</option>

<option>
invited
</option>

<option>
quoted
</option>

<option>
declined
</option>


</select>



<button

onClick={loadRFQs}

className="border px-4 rounded-lg flex gap-2 items-center"

>

<RefreshCcw size={18}/>

Refresh

</button>


</div>






<div className="grid grid-cols-3 gap-5 mt-6">





<div className="col-span-2 bg-white rounded-xl overflow-hidden">



<table className="w-full">


<thead className="bg-slate-50">


<tr>

<th className="p-4 text-left">
RFQ
</th>

<th>
Buyer
</th>

<th>
Quantity
</th>

<th>
Status
</th>

</tr>


</thead>



<tbody>



{
loading ?

<tr>

<td className="p-5">
Loading...
</td>

</tr>


:


filteredRFQs.map(item=>(


<tr

key={item.id}

onClick={()=>setSelected(item)}

className="border-t cursor-pointer hover:bg-slate-50"

>


<td className="p-4">

{item.rfqs.title}

</td>



<td>

{
item.rfqs.organizations?.name
}

</td>



<td>

{
item.rfqs.quantity
}

</td>



<td>

<span className="bg-blue-100 px-3 py-1 rounded-full">

{item.status}

</span>

</td>


</tr>


))


}



</tbody>


</table>


</div>








<div className="bg-white rounded-xl p-6">



{
selected &&

<>


<h2 className="text-xl font-bold">
RFQ Details
</h2>



<h1 className="text-2xl font-bold mt-5">

{selected.rfqs.title}

</h1>




<div className="mt-5 space-y-4">



<p className="flex gap-2">

<Package/>

{selected.rfqs.products?.name}

</p>




<p className="flex gap-2">

<MapPin/>

{selected.rfqs.organizations?.name}

</p>




<p className="flex gap-2">

<Calendar/>

{selected.rfqs.created_at}

</p>



<p>

Quantity:
{selected.rfqs.quantity}

</p>



<p>

Budget:
₹{selected.rfqs.budget}

</p>



</div>




<p className="mt-5 text-gray-600">

{selected.rfqs.description}

</p>





<button

onClick={submitQuote}

className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg flex justify-center gap-2"

>

<Send/>

Submit Quote

</button>




<button

onClick={declineRFQ}

className="mt-3 w-full border border-red-400 text-red-500 p-3 rounded-lg flex justify-center gap-2"

>

<Ban/>

Decline

</button>


</>

}


</div>



</div>


</div>

);

};


export default VendorRFQ;