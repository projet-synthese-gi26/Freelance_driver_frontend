import Link from 'next/link';
import React, { useState } from 'react'
import CustomSwitch from '../Switch';

const Notif1 = () => {
    const [toggle,settoggle]=useState(false)

    interface SwitchData {
        id: number;
        enabled: boolean;
        title:string;
        description:string;
        newable: boolean;
      }
    
    const [switches, setSwitches] = useState<SwitchData[]>([
    { id: 1, enabled: false,title:"New for you",description:"A weekly email featuring shots from designers you follow",newable:true },
    { id: 2, enabled: false,title:"Account activity",description:"A weekly email featuring shots from designers you follow",newable:false },
    { id: 3, enabled: false,title:"Meetups near you",description:"Get an email when a Dribbble Meetup is posted close to my location",newable:true },
    { id: 4, enabled: false,title:"Opportunities",description:"Get a daily email when new design jobs are posted in your area",newable:false },
    ]);

    const toggleAllSwitches = () => {
            settoggle(true)
            setSwitches(switches.map((sw) => ({ ...sw, enabled: true })));
      };
    
      const untoggleAllSwitches=()=>{
          settoggle(false)
          setSwitches(switches.map((sw) => ({ ...sw, enabled: false })));
        }
  return (
    <div className="p-6 p-xl-10 rounded-2xl bg-white shadow-lg">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h3 className="mb-0 text font-bold flex-grow"> My Network </h3>
              {toggle?(
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
          <p className="mb-4"> SEND ME : </p>
          <div className="bg-[var(--primary-light)] py-4 px-8 rounded-lg mb-4">
            <p className="mb-0 text-[var(--neutral-700)]">
              We need permission from your browser to show notifications.
              <Link
                href="#"
                className="link inline-block font-semibold text-primary">
                Request permission
              </Link>
            </p>
          </div>
          <ul className="flex flex-col gap-6">
            <li>
              {switches.map((sw)=>(
                <CustomSwitch key={sw.id} title={sw.title} description={sw.description} enabled={sw.enabled} 
                newable={sw.newable} setEnabled={
                  (value) =>
                    setSwitches(
                      switches.map((s) =>
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

export default Notif1