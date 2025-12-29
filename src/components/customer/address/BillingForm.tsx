import React, { Fragment, useState, useEffect } from 'react'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import { PaintBrushIcon, MapPinIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import Dialog from '@mui/material/Dialog';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

// SERVICES
import { addressService } from '@/service/addressService';
import { sessionService } from '@/service/sessionService';
import { Address } from '@/type/address';
import { parseAddress } from './AdressParser';

// Type pour le formulaire (basé sur Address)
type AddressFormData = {
    title: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
};

interface BillingFormProps {
    status: 'add' | 'update';
    addressToEdit?: Address;
    onSuccess: () => void;
}

interface Suggestion {
    display_name: string;
    address: any;
}

const BillingForm = ({ status, addressToEdit, onSuccess }: BillingFormProps) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, setValue, reset, watch } = useForm<AddressFormData>();
    
    // États pour l'autocomplétion et le chargement
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Watch pour l'autocomplétion
    const streetValue = watch('street');

    // Pré-remplir le formulaire en mode édition
    useEffect(() => {
        if (open && status === 'update' && addressToEdit) {
            setValue('title', addressToEdit.title);
            setValue('street', addressToEdit.street);
            setValue('city', addressToEdit.city);
            setValue('zipCode', addressToEdit.zipCode);
            setValue('country', addressToEdit.country);
        } else if (open && status === 'add') {
            reset(); // Réinitialiser pour un nouvel ajout
        }
    }, [open, status, addressToEdit, setValue, reset]);

    // Gestion de l'autocomplétion (Nominatim)
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (streetValue && streetValue.length > 3) {
                setIsLoadingSuggestions(true);
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(streetValue)}&limit=5&addressdetails=1`);
                    const data = await response.json();
                    setSuggestions(data);
                } catch (error) {
                    console.error("Erreur autocomplétion:", error);
                } finally {
                    setIsLoadingSuggestions(false);
                }
            } else {
                setSuggestions([]);
            }
        };
        
        // Debounce simple
        const timeoutId = setTimeout(fetchSuggestions, 500);
        return () => clearTimeout(timeoutId);
    }, [streetValue]);

    const handleSelectSuggestion = (suggestion: Suggestion) => {
        const parsed = parseAddress(suggestion.display_name); // Assurez-vous que votre fonction parseAddress est compatible
        // Ou utiliser directement les champs de nominatim
        const addr = suggestion.address;
        
        setValue('street', addr.road || addr.pedestrian || suggestion.display_name.split(',')[0]);
        setValue('city', addr.city || addr.town || addr.village || '');
        setValue('zipCode', addr.postcode || '');
        setValue('country', addr.country || '');
        
        setSuggestions([]); // Fermer la liste
    };

    // Soumission du formulaire
    const onSubmit = async (data: AddressFormData) => {
        setIsSubmitting(true);
        try {
            // Récupérer l'ID utilisateur
            const userContext = await sessionService.getUserContext();
            const userId = userContext?.id;

            if (!userId) {
                toast.error("Utilisateur non connecté.");
                return;
            }

            if (status === 'add') {
                await addressService.createAddress(data, userId);
                toast.success("Adresse ajoutée !");
            } else if (status === 'update' && addressToEdit) {
                await addressService.updateAddress(addressToEdit.id, data, userId);
                toast.success("Adresse mise à jour !");
            }
            
            onSuccess(); // Recharger la liste parente
            handleClose();
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
            toast.error("Une erreur est survenue.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            {/* BOUTON D'OUVERTURE (Différent selon le mode) */}
            {status === "update" ? (
                <button 
                    className="cursor-pointer flex items-center px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors" 
                    onClick={handleClickOpen}
                >
                    <PaintBrushIcon className="w-4 h-4 mr-1" />
                    Edit
                </button>
            ) : (
                <button 
                    className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer group" 
                    onClick={handleClickOpen}
                >
                    <MapPinIcon className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-2" />
                    <div className="flex items-center text-gray-500 group-hover:text-blue-600 font-semibold">
                        <PlusCircleIcon className="w-5 h-5 mr-1" />
                        <span>Add a new address</span>
                    </div>
                </button>
            )}

            {/* MODALE (DIALOG) */}
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={fullScreen}
                PaperProps={{
                    className: 'w-full max-w-[600px] rounded-xl'
                }}
            >
                <DialogTitle className="border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        {status === 'add' ? 'Add New Address' : 'Edit Address'}
                    </h2>
                </DialogTitle>
                
                <DialogContent className="pt-6">
                    <form id="address-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
                        
                        {/* Titre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title (e.g., Home, Work)</label>
                            <input
                                {...register('title', { required: true })}
                                placeholder="Home"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {/* Rue avec Autocomplétion */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address / Street</label>
                            <div className="relative">
                                <input
                                    {...register('street', { required: true })}
                                    placeholder="123 Main St"
                                    autoComplete="off"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                {isLoadingSuggestions && (
                                    <div className="absolute right-3 top-2.5">
                                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Liste de suggestions */}
                            {suggestions.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                                    {suggestions.map((s, i) => (
                                        <li 
                                            key={i} 
                                            onClick={() => handleSelectSuggestion(s)}
                                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-0"
                                        >
                                            {s.display_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Ville & Code Postal */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    {...register('city', { required: true })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                <input
                                    {...register('zipCode', { required: true })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Pays */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input
                                {...register('country', { required: true })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </form>
                </DialogContent>

                <DialogActions className="p-4 border-t bg-gray-50 rounded-b-xl">
                    <Button onClick={handleClose} color="inherit" className="text-gray-600">
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        form="address-form" 
                        variant="contained" 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : (status === 'add' ? 'Add Address' : 'Update Address')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default BillingForm;