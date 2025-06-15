import React, { useState } from 'react'
import CustomSwitch from '../Switch';

const Notif3 = () => {
    const [toggle3,settoggle3]=useState(false)

    interface SwitchData {
      id: number;
      enabled: boolean;
      title:string;
      description:string;
      newable: boolean;
    }
  
    const [switches3, setSwitches3] = useState<SwitchData[]>([
      { id: 1, enabled: false,title:"Encrypt data",description:"Encrypt all data associated with account",newable:false },
      { id: 2, enabled: false,title:"Location services",description:"Allow third-party apps to use current location",newable:false },
      { id: 3, enabled: false,title:"Allow private notes",description:"Members can send you private notes",newable:false },
    ]);
  
  
    const toggleAllSwitches = () => {
        settoggle3(true)
        setSwitches3(switches3.map((sw) => ({ ...sw, enabled: true })));
    }
  
    const untoggleAllSwitches=()=>{
        settoggle3(false)
        setSwitches3(switches3.map((sw) => ({ ...sw, enabled: false })));
    }
  return (
    <div className="p-6 p-xl-10 rounded-2xl bg-white shadow-lg">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h3 className="mb-0 text font-bold flex-grow"> Usage </h3>
            {toggle3?(
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
          <p className="mb-4"> ALLOW OTHERS TO : </p>
          <ul className="flex flex-col gap-6">
            <li>
              {switches3.map((sw)=>(
                <CustomSwitch key={sw.id} title={sw.title} description={sw.description} enabled={sw.enabled} 
                newable={sw.newable} setEnabled={
                  (value) =>
                    setSwitches3(
                      switches3.map((s) =>
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

export default Notif3