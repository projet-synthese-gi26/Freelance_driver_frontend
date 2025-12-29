"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  PlusIcon, MapPinIcon, CalendarIcon, ClockIcon, BanknotesIcon, 
  BriefcaseIcon, PencilSquareIcon, TrashIcon, PaperAirplaneIcon, 
  ArrowPathIcon, MagnifyingGlassIcon, BellAlertIcon, XMarkIcon,
  CheckBadgeIcon, ChevronRightIcon
} from "@heroicons/react/24/outline";
import { toast } from 'react-hot-toast';

// Services
import { announcementService, PublicOfferView } from '@/service/announcementService';
import { planningService } from '@/service/planningService';
import { sessionService } from '@/service/sessionService';

// --- TYPES ---
type DashboardMode = 'annonces' | 'plannings' | 'reservations';

// --- COMPOSANT TIMER ---
const AnnouncementTimer = ({ startDate, startTime, endDate, endTime }: any) => {
    const [timeLeft, setTimeLeft] = useState<any>({ label: '', color: '', value: '' });

    const calculate = useCallback(() => {
        const now = new Date().getTime();
        const start = new Date(`${startDate}T${startTime}`).getTime();
        const end = new Date(`${endDate}T${endTime}`).getTime();
        if (isNaN(start)) return { label: 'Prévu', color: 'text-gray-400', value: startDate };
        if (now > end) return { label: 'Expiré', color: 'text-red-500', value: 'Terminé' };
        const isFuture = now < start;
        const target = isFuture ? start : end;
        const diff = target - now;
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        return {
            label: isFuture ? 'Départ dans' : 'Arrivée dans',
            color: isFuture ? 'text-amber-500' : 'text-green-500',
            value: `${h}h ${m}m ${s}s`
        };
    }, [startDate, startTime, endDate, endTime]);

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(calculate()), 1000);
        return () => clearInterval(timer);
    }, [calculate]);

    return (
        <div className="text-right">
            <p className="text-[10px] uppercase font-black opacity-40">{timeLeft.label}</p>
            <p className={`text-xs font-mono font-bold ${timeLeft.color}`}>{timeLeft.value}</p>
        </div>
    );
};

export default function AnnouncementsPage() {
    // --- ÉTATS ---
    const [mode, setMode] = useState<DashboardMode>('annonces');
    const [dataList, setDataList] = useState<PublicOfferView[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Formulaire d'annonce
    const [formData, setFormData] = useState({
        title: '', pickupLocation: '', dropoffLocation: '', 
        startDate: '', startTime: '', endDate: '', endTime: '',
        cost: '', baggageInfo: '', isNegotiable: false, paymentMethod: 'cash'
    });

    // --- CHARGEMENT DES DONNÉES (LOGS DÉTAILLÉS) ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        const context = sessionService.getUserSessionContext();
        console.log(`🚀 [MODE: ${mode.toUpperCase()}] Démarrage de la synchronisation...`);

        try {
            let response: any[];
            if (mode === 'annonces') {
                response = await announcementService.getMyAnnouncements();
            } else if (mode === 'plannings') {
                response = await planningService.getPublishedPlannings();
            } else {
                response = await planningService.getMyReservedRides();
            }

            console.group(`📦 [BACKEND RAW] Données brutes pour ${mode}`);
            console.log("Status Code: 200 OK");
            console.log("Payload:", response);
            console.groupEnd();

            // Mapping vers vue publique si nécessaire
            const mapped = response.map(item => ({
                ...item,
                cost: item.cost || item.defaultSellPrice || 0,
                authorName: item.authorName || item.clientName || 'Inconnu'
            }));

            console.table(mapped.map(m => ({ ID: m.id, Titre: m.title, Statut: m.status })));
            setDataList(mapped);
        } catch (error) {
            console.error(`❌ [ERROR ${mode}]`, error);
            toast.error("Échec de la récupération des données");
        } finally {
            setLoading(false);
        }
    }, [mode]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // --- ACTIONS ---
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading("Création de l'annonce...");
        console.log("📤 [POST] Envoi de la nouvelle annonce:", formData);
        
        try {
            await announcementService.createAnnouncement(formData as any);
            console.log("✅ [SUCCESS] Annonce créée sur SyllaDB");
            toast.success("Annonce créée !", { id: toastId });
            setShowCreateModal(false);
            fetchData();
        } catch (err) {
            toast.error("Erreur lors de la création", { id: toastId });
        }
    };

    const handleBooking = async (planningId: string) => {
        console.log(`🎟️ [ACTION] Demande de réservation pour le planning: ${planningId}`);
        try {
            await planningService.requestPlanningBooking(planningId);
            toast.success("Demande de réservation envoyée !");
            setMode('reservations');
        } catch (err) {
            toast.error("Erreur de réservation");
        }
    };

    const handleDelete = async (id: string) => {
        if(!confirm("Supprimer cet élément ?")) return;
        setDataList(prev => prev.filter(item => item.id !== id)); // Optimiste
        await announcementService.deleteAnnouncement(id);
        toast.success("Supprimé");
    };

    // --- FILTRAGE ---
    const filteredData = useMemo(() => {
        return dataList.filter(item => 
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.pickupLocation?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [dataList, searchQuery]);

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen pb-24 font-sans text-gray-900">
            
            {/* Header & Tabs Majeurs */}
            <div className="flex flex-col gap-6 mb-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-black tracking-tighter">ANNONCES</h1>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                    >
                        <PlusIcon className="w-6 h-6 stroke-[3]" />
                    </button>
                </div>

                <div className="flex p-1.5 bg-gray-100 rounded-[24px] w-full max-w-2xl mx-auto shadow-inner">
                    {[
                        { id: 'annonces', label: 'Mes Annonces', color: 'bg-blue-500' },
                        { id: 'plannings', label: 'Plannings Chauffeurs', color: 'bg-green-500' },
                        { id: 'reservations', label: 'Mes Réservations', color: 'bg-purple-500' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setMode(tab.id as DashboardMode)}
                            className={`flex-1 py-4 px-2 rounded-[20px] text-xs md:text-sm font-black transition-all duration-300 uppercase tracking-widest ${
                                mode === tab.id ? `${tab.color} text-white shadow-lg` : "text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recherche */}
            <div className="relative mb-8 group">
                <MagnifyingGlassIcon className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder={`Rechercher dans ${mode}...`}
                    className="w-full pl-16 pr-6 py-5 rounded-[24px] border-none bg-white shadow-sm ring-1 ring-gray-200 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Liste Dynamique */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <ArrowPathIcon className="w-12 h-12 text-primary animate-spin" />
                    <p className="font-black text-gray-300 uppercase tracking-widest">Synchronisation Backend...</p>
                </div>
            ) : filteredData.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[40px] border-4 border-dashed border-gray-50 flex flex-col items-center">
                    <BellAlertIcon className="w-20 h-20 text-gray-100 mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 uppercase">Aucune donnée trouvée</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredData.map((item) => (
                        <div key={item.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 group relative">
                            <div className="flex justify-between items-center mb-6">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-[0.15em] ${
                                    item.status === 'Published' ? "bg-green-50 text-green-500 border-green-100" : "bg-gray-50 text-gray-400 border-gray-100"
                                }`}>
                                    {item.status}
                                </span>
                                <AnnouncementTimer {...item} />
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors">{item.title}</h3>
                                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase flex items-center gap-1">
                                        <CheckBadgeIcon className="w-4 h-4 text-blue-400" />
                                        Chauffeur: {item.authorName}
                                    </p>
                                </div>

                                <div className="space-y-4 relative">
                                    <div className="absolute left-[15px] top-4 bottom-4 w-0.5 border-l-2 border-dashed border-gray-100"></div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center z-10 shadow-lg shadow-blue-100">
                                            <MapPinIcon className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="font-bold text-gray-800 text-sm">{item.pickupLocation}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center z-10 shadow-lg shadow-red-100">
                                            <MapPinIcon className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="font-bold text-gray-800 text-sm">{item.dropoffLocation}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-5 rounded-[24px]">
                                    <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 opacity-30"/><span className="text-xs font-bold">{item.startDate}</span></div>
                                    <div className="flex items-center gap-2"><ClockIcon className="w-4 h-4 opacity-30"/><span className="text-xs font-bold">{item.startTime}</span></div>
                                    <div className="flex items-center gap-2"><BanknotesIcon className="w-4 h-4 text-green-400"/><span className="text-lg font-black text-green-600">{item.cost} <small className="text-[10px]">XAF</small></span></div>
                                </div>
                            </div>

                            {/* Actions selon le MODE */}
                            <div className="mt-8 flex gap-3">
                                {mode === 'plannings' ? (
                                    <button 
                                        onClick={() => handleBooking(item.id)}
                                        className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                    >
                                        Réserver ce trajet
                                        <ChevronRightIcon className="w-4 h-4 stroke-[3]" />
                                    </button>
                                ) : mode === 'annonces' ? (
                                    <>
                                        <button className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-xs uppercase transition-all hover:bg-primary hover:text-white">Modifier</button>
                                        <button onClick={() => handleDelete(item.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><TrashIcon className="w-5 h-5"/></button>
                                    </>
                                ) : (
                                    <button className="flex-1 bg-amber-50 text-amber-600 py-4 rounded-2xl font-black text-xs uppercase transition-all hover:bg-red-500 hover:text-white">Annuler la réservation</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL DE CRÉATION D'ANNONCE */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-2xl font-black uppercase tracking-tight">Nouvelle Annonce</h2>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><XMarkIcon className="w-6 h-6"/></button>
                        </div>
                        <form onSubmit={handleCreate} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase ml-2">Titre du trajet</label>
                                <input required placeholder="Ex: Course urgente Yaoundé" className="w-full p-4 rounded-2xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input required placeholder="Lieu de départ" className="p-4 rounded-2xl bg-gray-100 border-none font-bold" onChange={e => setFormData({...formData, pickupLocation: e.target.value})} />
                                <input required placeholder="Lieu d'arrivée" className="p-4 rounded-2xl bg-gray-100 border-none font-bold" onChange={e => setFormData({...formData, dropoffLocation: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="date" className="p-4 rounded-2xl bg-gray-100 border-none font-bold" onChange={e => setFormData({...formData, startDate: e.target.value})} />
                                <input required type="time" className="p-4 rounded-2xl bg-gray-100 border-none font-bold" onChange={e => setFormData({...formData, startTime: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input required placeholder="Budget (XAF)" type="number" className="p-4 rounded-2xl bg-gray-100 border-none font-bold text-primary" onChange={e => setFormData({...formData, cost: e.target.value})} />
                                <input placeholder="Bagages (ex: 2 valises)" className="p-4 rounded-2xl bg-gray-100 border-none font-bold" onChange={e => setFormData({...formData, baggageInfo: e.target.value})} />
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
                                <input type="checkbox" className="w-5 h-5 accent-primary" onChange={e => setFormData({...formData, isNegotiable: e.target.checked})} />
                                <span className="text-sm font-bold text-blue-800">Le prix est négociable</span>
                            </div>
                            <button type="submit" className="w-full bg-primary text-white py-5 rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">Publier sur SyllaDB</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}