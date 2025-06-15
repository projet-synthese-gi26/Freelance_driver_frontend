import { motion } from 'framer-motion';
import { ChangeEvent } from 'react';

export const InputField: React.FC<{edit:boolean, name: string|undefined|number, label: string, icon: React.ComponentType<any>, type?: string, placeholder?: string, value?: string, onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }> = ({ edit,name, label, icon: Icon, type = 'text', placeholder, value, onChange }) => (
    <motion.div 
      className="col-span-12 sm:col-span-6"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <label htmlFor={name as string} className=" font-bold block">{label}:</label>
      <div className="relative">
        {edit ? (
          <input
          type={type}
          name={name as string}
          id={name as string}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-white border  focus:outline-none rounded-md p-1"
        />
        ):(
          <span className='rounded-md p-1 font-medium opacity-[70%]'>{name}</span>
        )}
        
        
      </div>
    </motion.div>
  );