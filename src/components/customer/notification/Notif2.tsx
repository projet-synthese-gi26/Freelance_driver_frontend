import React, { useState } from 'react'
import CustomSwitch from '../Switch';

const Notif2 = () => {
    const [toggle2,settoggle2]=useState(false)
  
    interface SwitchData {
      id: number;
      enabled: boolean;
      title:string;
      description:string;
      newable: boolean;
    }
  
    const [switches2, setSwitches2] = useState<SwitchData[]>([
      { id: 1, enabled: false,title:"Company news",description:"Get Placewise news, announcements, and product updates",newable:true },
      { id: 2, enabled: false,title:" Replay ",description:"A weekly email featuring popular shots",newable:false },
      { id: 3, enabled: false,title:"Courtside",description:"A weekly email featuring the latest stories from our blog",newable:true },
      { id: 4, enabled: false,title:"Weekly jobs",description:"Weekly digest of design jobs",newable:false },
    ]);
  
  
    const toggleAllSwitches = () => {
        settoggle2(true)
        setSwitches2(switches2.map((sw) => ({ ...sw, enabled: true })));
    };
  
    const untoggleAllSwitches=()=>{
        settoggle2(false)
        setSwitches2(switches2.map((sw) => ({ ...sw, enabled: false })));
      
    }
  return (
    <div className="p-6 p-xl-10 rounded-2xl bg-white shadow-lg">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h3 className="mb-0 text font-bold flex-grow"> Lets Go Emails </h3>
            {toggle2?(
                <a
                onClick={()=>{untoggleAllSwitches()}}
                className="px-6 py-3 border-primary-500 border rounded-md text-primary font-semibold cursor-pointer hover:bg-primary hover:text-white">
                Untoggle All
              </a>
              ):(
                <a
                onClick={()=>{toggleAllSwitches()}}
                className="px-6 py-3 border-primary-500 border rounded-md text-primary font-semibold cursor-pointer hover:bg-primary hover:text-white">
                Toggle All
              </a>
              )}
          </div>
          <div className="hr-line my-6"></div>
          <p className="mb-4"> SUBSCRIBE ME TO : </p>
          <ul className="flex flex-col gap-6">
            <li>
                          {switches2.map((sw)=>(
                            <CustomSwitch key={sw.id} title={sw.title} description={sw.description} enabled={sw.enabled} 
                            newable={sw.newable} setEnabled={
                              (value) =>
                                setSwitches2(
                                  switches2.map((s) =>
                                    s.id === sw.id ? { ...s, enabled: value } : s
                                  )
                                )
                            }/>
                          ))}
              </li>
          </ul>
        </div>
  )
}

export default Notif2