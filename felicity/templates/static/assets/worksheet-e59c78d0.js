import{S as o,aZ as r,a_ as c,M as i}from"./index-6a324368.js";function f(){const{withClientMutation:s}=i();return{unAssignSamples:async t=>{try{o.fire({title:"Are you sure?",text:"You want to Un-Assign these analyses",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, Un-Assign now!",cancelButtonText:"No, cancel UnAssign!"}).then(async e=>{e.isConfirmed&&(await s(r,t,"updateWorksheet").then(n=>{}),o.fire("Its Happening!","Selected analyses have been UnAssigned.","success").then(n=>location.reload()))})}catch{}},actionWorksheets:async(t,e)=>{try{o.fire({title:"Are you sure?",text:`You want to ${e} the worksheet${t.length>1?"s":""}`,icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:`Yes, ${e} now!`,cancelButtonText:`No, cancel ${e}!`}).then(async n=>{n.isConfirmed&&await s(c,{uids:t,action:e},"actionWorksheets").then(a=>{console.log(a)})})}catch{}}}}export{f as u};
