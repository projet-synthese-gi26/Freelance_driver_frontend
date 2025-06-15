import React,{ Dispatch, Fragment, SetStateAction, useState } from 'react'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import { PaintBrushIcon } from '@heroicons/react/24/outline'
import Dialog from '@mui/material/Dialog';
import {useForm} from 'react-hook-form'
import { AdressFormData, BillingType } from '@/app/type/Billing'; 
import {
    MapPinIcon,
    PlusCircleIcon,
  } from "@heroicons/react/24/outline";

  import { parseAddress } from './AdressParser';

interface BillingProps{
    Billings: BillingType[];
    BillId?:number;
    status:string;
    setBilling:Dispatch<SetStateAction<BillingType[]>>;
}

interface Suggestion {
    display_name: string;
    address: {
        postcode?: string;
        city?: string;
        country?: string;
        road?: string;
    };
}

const BillingForm = ({Billings,BillId,status,setBilling}:BillingProps) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [open, setOpen] = useState(false);
    const {register,handleSubmit,setValue}=useForm<AdressFormData>()
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [country,setCountry]=useState('')
    const [city,setCity]=useState('')
    const [street,setStreet]=useState('')
    const [postalCode,setPostalCode]=useState('')
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        let newErrors: {[key: string]: string} = {};
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate= (id:number|undefined) => { 
        if (validateForm()) {
            const Update=Billings.map(item=>{
                if(item.id==BillId){
                    return {...item, country:country,city:city,street:street,postalCode:postalCode}
                }
                return item
            })
            setBilling(Update)
            // for (let index = 0; index < Billings.length; index++) {
            //     if (Billings[index].id === BillId){
            //         console.log(true);
            //         Billings[index].country=country
            //         Billings[index].city=city
            //         Billings[index].street=street
            //         Billings[index].postalCode=PostalCode
            //     }
            // }
            handleClose();
        }
    };

    const addItems=(items:BillingType[],newItem:BillingType):BillingType[] => {
        return [...items,newItem];
    }
    const handleAdd= () => {
        const NewBillAddress:BillingType={id: Billings.length + 1, country: country, city: city, street: street, postalCode: postalCode,select: false}
        if (validateForm()) {
            setBilling(addItems(Billings,NewBillAddress))
        }
        
        handleClose();
    }

    const handleEdit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setStreet(input);
        if (input.length > 3) {
            setIsLoading(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=5`);
                const data = await response.json();
                const newSuggestions = data.map((item: any) => {
                    const parsedAddress = parseAddress(item.display_name);
                    return {
                        display_name: item.display_name,
                        address: parsedAddress
                    };
                });
                setSuggestions(newSuggestions);
            } catch (error) {
                console.error("Erreur lors de la récupération des suggestions:", error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        } else {
            setSuggestions([]);
        }
    }

    const handleSelect = (suggestion: Suggestion) => {

        setStreet(suggestion.address.road || '');
        setCity(suggestion.address.city || '');
        setPostalCode(suggestion.address.postcode || '');
        setCountry(suggestion.address.country || '');
        setValue('street', suggestion.address.road || '');
        setValue('city', suggestion.address.city || '');
        setValue('postalCode', suggestion.address.postcode || '');
        setValue('country', suggestion.address.country || '');
        setSuggestions([]);
    }
    const handleCountry = (e: React.ChangeEvent<HTMLInputElement>) => setCountry(e.target.value);
    const handleCity = (e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value);
    const handleStreet = (e: React.ChangeEvent<HTMLInputElement>) => setStreet(e.target.value);
    const handlePostalCode = (e: React.ChangeEvent<HTMLInputElement>) => setPostalCode(e.target.value);

    const handleClickOpen = () => {
        setCountry(Billings[(BillId as number)-1].country)
        setCity(Billings[(BillId as number)-1].city)
        setStreet(Billings[(BillId as number)-1].street)
        setPostalCode(Billings[(BillId as number)-1].postalCode)
        setOpen(true)
    };
    
    const handleClose = () => {
        setOpen(false)
    }
  return (
    <div>
        {status==="update" && (
            <Fragment>
            <a className="cursor-pointer btn-outline-gray inline-flex rounded-md items-center text gap-1 font-semibold shrink-0" onClick={handleClickOpen}>
                <PaintBrushIcon className="w-4 h-4" />
                Edit Address 
            </a>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={fullScreen}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        handleUpdate(BillId);
                    },
                    className: 'w-full max-w-[600px] sm:w-4/5 md:w-3/4'
                }}
            >
                <DialogTitle>
                    <h1 className={`font-bold ${fullScreen ? 'title' : 'title'}`}>
                    Update Billing Address
                    </h1>
                </DialogTitle>
                <DialogContent>
                <form onSubmit={handleSubmit(() => status === "update" ? handleUpdate(BillId) : handleAdd())} className='flex text flex-col gap-3'>
                    <label className="font-medium">Address</label>
                    <div className="relative">
                        <input
                            {...register('street')}
                            onChange={handleEdit}
                            value={street}
                            placeholder='Address'
                            className='focus:outline-none border border-primary-500 rounded-full p-2 w-full'
                        />
                        {isLoading && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                            </div>
                        )}
                    </div>
                    {suggestions.length > 0 && (
                        <ul className="bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                            {suggestions.map((suggestion, index) => (
                                <li 
                                    key={index} 
                                    onClick={() => handleSelect(suggestion)}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {suggestion.display_name}
                                </li>
                            ))}
                        </ul>
                    )}
                    <label className="font-medium">City</label>
                    <input
                        {...register('city')}
                        placeholder='City'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className='focus:outline-none border border-primary-500 rounded-full p-2'
                    />
                    <label className="font-medium">Postal Code</label>
                    <input
                        {...register('postalCode')}
                        placeholder='Postal Code'
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className='focus:outline-none border border-primary-500 rounded-full p-2'
                    />
                    <label className="font-medium">Country</label>
                    <input
                        {...register('country')}
                        placeholder='Country'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className='focus:outline-none border border-primary-500 rounded-full p-2'
                    />
                </form>
                </DialogContent>
                <DialogActions className="flex justify-center pb-4">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="mx-1 px-4 text py-2 rounded-lg hover:bg-blue-700"
                    >
                    Update
                    </Button>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        color="error"
                        className="mx-1 px-4 text py-2 rounded-lg hover:bg-red-700"
                    >
                    Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
        )}
        {status==="add" && (
            <Fragment>
            <a className="cursor-pointer grid w-full hover:bg-[var(--bg-1)] place-content-center text-center border border-dashed rounded-2xl p-4 p-xl-6" onClick={handleClickOpen}>
                <div className="flex justify-center">
                <MapPinIcon className="w-14 h-14" />
                </div>
                <div
                className="link flex items-center justify-center gap-2 mt-1 clr-neutral-400 hover:text-primary">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span className="font-semibold inline-block">
                        {" "}
                        Add a new address{" "}
                    </span>
                </div>
            </a>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={fullScreen}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        handleAdd();
                    },
                    className: 'w-full max-w-[600px] sm:w-4/5 md:w-3/4'
                }}
            >
                <DialogTitle>
                    <h1 className={`font-bold ${fullScreen ? 'title' : 'title'}`}>
                    Add Billing Address
                    </h1>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(handleAdd)} className='flex text flex-col gap-3'>
                        <label className="font-medium">Address</label>
                        <div className="relative">
                        <input
                            {...register('street')}
                            onChange={handleEdit}
                            value={street}
                            placeholder='Address'
                            className='focus:outline-none border border-primary-500 rounded-full p-2 w-full'
                        />
                        {isLoading && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                            </div>
                        )}
                    </div>
                    {suggestions.length > 0 && (
                        <ul className="bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                            {suggestions.map((suggestion, index) => (
                                <li 
                                    key={index} 
                                    onClick={() => handleSelect(suggestion)}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {suggestion.display_name}
                                </li>
                            ))}
                        </ul>
                    )}
                        {suggestions.length > 0 &&(
                            <ul>
                                {suggestions.map((suggestion,index) =>(
                                    <li key={index} onClick={()=>handleSelect(suggestion)}>
                                        {suggestion.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <label className="font-medium">City</label>
                        <input {...register('city')}
                        placeholder='City'
                        value={city}
                        onChange={handleCity}
                        className='focus:outline-none border border-primary-500 rounded-full p-2'
                        />
                        <label className="font-medium">Postal Code</label>
                        <input {...register('postalCode')}
                        placeholder='Postal Code'
                        value={postalCode}
                        onChange={handlePostalCode}
                        className='focus:outline-none border border-primary-500 rounded-full p-2'
                        />
                        <label className="font-medium">Country</label>
                        <input {...register('country')}
                        placeholder='Country'
                        value={country}
                        onChange={handleCountry}
                        className='focus:outline-none border border-primary-500 rounded-full p-2'
                        />
                    </form>
                </DialogContent>
                <DialogActions className="flex justify-center pb-4">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="mx-1 px-4 text py-2 rounded-lg hover:bg-blue-700"
                    >
                    Add
                    </Button>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        color="error"
                        className="mx-1 px-4 text py-2 rounded-lg hover:bg-red-700"
                    >
                    Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
        )}
    </div>
)}

export default BillingForm