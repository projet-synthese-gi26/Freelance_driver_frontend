"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  PlusIcon, MapPinIcon, CalendarIcon, ClockIcon, BanknotesIcon, 
  BriefcaseIcon, PencilSquareIcon, TrashIcon, PaperAirplaneIcon, 
  ArrowPathIcon, MagnifyingGlassIcon, BellAlertIcon, XMarkIcon,
  CheckBadgeIcon, ArrowUturnLeftIcon
} from "@heroicons/react/24/outline";
import { toast } from 'react-hot-toast';

// Services
import { announcementService } from '@/service/announcementService';
import { Announcement, AnnouncementStatus, PricingMethod, TripIntention, TripType } from '@/type/announcement';

type AnnouncementCardItem = {
    id: string;
    title: string;
    departureLocation: string;
    dropoffLocation: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    cost: string;
    baggageInfo: string;
    negotiable: boolean;
    paymentMethod?: string | null;
    status: AnnouncementStatus;
    tripType: TripType;
    meetupPoint: string;
    tripIntention: TripIntention;
    pricingMethod: PricingMethod;
    authorName?: string;
};

// --- COMPOSANT TIMER ---
const AnnouncementTimer = ({ startDate, startTime, endDate, endTime }: any) => {
    const [timeLeft, setTimeLeft] = useState<any>({ label: '', color: '', bgColor: '', value: '', isExpired: false, isActive: false });

    const calculate = useCallback(() => {
        const now = new Date().getTime();
        const start = new Date(`${startDate}T${startTime}`).getTime();
        const end = new Date(`${endDate}T${endTime}`).getTime();
        
        if (isNaN(start)) return { 
            label: 'Status', 
            color: 'text-gray-600', 
            bgColor: 'bg-gray-100',
            borderColor: 'border-gray-300',
            value: 'Scheduled',
            isExpired: false,
            isActive: false
        };
        
        if (now > end) return { 
            label: 'Expired', 
            color: 'text-red-600', 
            bgColor: 'bg-red-50',
            borderColor: 'border-red-300',
            value: 'Completed',
            isExpired: true,
            isActive: false
        };
        
        const isFuture = now < start;
        const target = isFuture ? start : end;
        const diff = target - now;
        
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        let displayValue = '';
        if (d > 0) displayValue = `${d}j ${h}h ${m}m`;
        else displayValue = `${h}h ${m}m ${s}s`;
        
        return {
            label: isFuture ? 'Starts in' : 'Ends in',
            color: isFuture ? 'text-amber-600' : 'text-green-600',
            bgColor: isFuture ? 'bg-amber-50' : 'bg-green-50',
            borderColor: isFuture ? 'border-amber-300' : 'border-green-300',
            value: displayValue,
            isExpired: false,
            isActive: !isFuture
        };
    }, [startDate, startTime, endDate, endTime]);

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(calculate()), 1000);
        return () => clearInterval(timer);
    }, [calculate]);

    return (
        <div className={`px-3 py-2 rounded-lg border ${timeLeft.borderColor} ${timeLeft.bgColor}`}>
            <p className={`text-[9px] uppercase font-bold tracking-wider ${timeLeft.color} mb-0.5`}>
                {timeLeft.label}
            </p>
            <p className={`text-xs font-mono font-bold ${timeLeft.color}`}>
                {timeLeft.value}
            </p>
        </div>
    );
};

// Helper pour obtenir le style du statut
const getStatusStyle = (status: AnnouncementStatus) => {
  switch (status) {
    case 'Published':
      return { bg: 'bg-green-100', text: 'text-green-700', label: 'Published' };
    case 'Ongoing':
      return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Ongoing' };
    case 'Draft':
      return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' };
    case 'Confirmed':
      return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confirmed' };
    case 'PendingConfirmation':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' };
    case 'Expired':
      return { bg: 'bg-red-100', text: 'text-red-700', label: 'Expired' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
  }
};

export default function AnnouncementsPage() {
    const [dataList, setDataList] = useState<AnnouncementCardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementCardItem | null>(null);
    const [activeStatusFilter, setActiveStatusFilter] = useState<AnnouncementStatus | 'All'>('All');

    const [formData, setFormData] = useState<{
        title: string;
        departureLocation: string;
        dropoffLocation: string;
        startDate: string;
        startTime: string;
        endDate: string;
        endTime: string;
        cost: string;
        baggageInfo: string;
        tripType: TripType;
        meetupPoint: string;
        tripIntention: TripIntention;
        pricingMethod: PricingMethod;
        isNegotiable: boolean;
        paymentMethod: string;
    }>({
        title: '',
        departureLocation: '',
        dropoffLocation: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        cost: '',
        baggageInfo: '',
        tripType: 'ONE_WAY',
        meetupPoint: '',
        tripIntention: 'PASSENGERS',
        pricingMethod: 'FIXED',
        isNegotiable: false,
        paymentMethod: 'cash',
    });


    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await announcementService.getMyAnnouncements();
            const mapped = response.map((item: Announcement) => ({
                id: item.id,
                title: item.title,
                departureLocation: item.departureLocation,
                dropoffLocation: item.dropoffLocation,
                startDate: item.startDate,
                startTime: item.startTime,
                endDate: item.endDate,
                endTime: item.endTime,
                cost: item.cost,
                baggageInfo: item.baggageInfo,
                negotiable: item.negotiable,
                paymentMethod: item.paymentMethod ?? null,
                status: item.status || 'Draft',
                tripType: item.tripType,
                meetupPoint: item.meetupPoint,
                tripIntention: item.tripIntention,
                pricingMethod: item.pricingMethod,
                authorName: item.clientName || 'Client',
            }));
            setDataList(mapped);
        } catch (error) {
            console.error(`❌ [ERROR]`, error);
            toast.error("Server connection error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading("Creating announcement...");
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            if (startDate < today) {
                toast.error("Start date cannot be before today.", { id: toastId });
                return;
            }
            if (endDate < startDate) {
                toast.error("End date cannot be before start date.", { id: toastId });
                return;
            }
            const formatTime = (value: string) => (value && value.length === 5 ? `${value}:00` : value);
            const toOffsetDateTime = (dateValue: string, timeValue: string) => {
                if (!dateValue || !timeValue) return '';
                return new Date(`${dateValue}T${formatTime(timeValue)}`).toISOString();
            };
            await announcementService.createAnnouncement({
                ...formData,
                startDate: toOffsetDateTime(formData.startDate, formData.startTime),
                endDate: toOffsetDateTime(formData.endDate, formData.endTime),
                startTime: formatTime(formData.startTime),
                endTime: formatTime(formData.endTime),
                status: 'Draft',
            });
            toast.success("Announcement created!", { id: toastId });
            setShowCreateModal(false);
            setFormData({
                title: '',
                departureLocation: '',
                dropoffLocation: '',
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                cost: '',
                baggageInfo: '',
                tripType: 'ONE_WAY',
                meetupPoint: '',
                tripIntention: 'PASSENGERS',
                pricingMethod: 'FIXED',
                isNegotiable: false,
                paymentMethod: 'cash',
            });
            fetchData();
        } catch (err) { 
            toast.error("Server error", { id: toastId }); 
        }
    };

    const handleEdit = (item: AnnouncementCardItem) => {
        const toDateInput = (value?: string) => (value ? value.split('T')[0] : '');
        const toTimeInput = (value?: string) => (value ? value.slice(0, 5) : '');
        setEditingAnnouncement(item);
        setFormData({
            title: item.title,
            departureLocation: item.departureLocation,
            dropoffLocation: item.dropoffLocation,
            startDate: toDateInput(item.startDate),
            startTime: toTimeInput(item.startTime),
            endDate: toDateInput(item.endDate),
            endTime: toTimeInput(item.endTime),
            cost: item.cost,
            baggageInfo: item.baggageInfo,
            tripType: item.tripType,
            meetupPoint: item.meetupPoint,
            tripIntention: item.tripIntention,
            pricingMethod: item.pricingMethod,
            isNegotiable: item.negotiable,
            paymentMethod: item.paymentMethod ?? 'cash',
        });
        setShowEditModal(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAnnouncement) return;
        const toastId = toast.loading("Updating announcement...");

        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            if (startDate < today) {
                toast.error("Start date cannot be before today.", { id: toastId });
                return;
            }
            if (endDate < startDate) {
                toast.error("End date cannot be before start date.", { id: toastId });
                return;
            }
            const formatTime = (value: string) => (value && value.length === 5 ? `${value}:00` : value);
            const toOffsetDateTime = (dateValue: string, timeValue: string) => {
                if (!dateValue || !timeValue) return '';
                return new Date(`${dateValue}T${formatTime(timeValue)}`).toISOString();
            };

            await announcementService.updateAnnouncement(editingAnnouncement.id, {
                ...formData,
                startDate: toOffsetDateTime(formData.startDate, formData.startTime),
                endDate: toOffsetDateTime(formData.endDate, formData.endTime),
                startTime: formatTime(formData.startTime),
                endTime: formatTime(formData.endTime),
                status: editingAnnouncement.status,
            });
            toast.success("Announcement updated!", { id: toastId });
            setShowEditModal(false);
            setEditingAnnouncement(null);
            fetchData();
        } catch (err) {
            toast.error("Update failed", { id: toastId });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Do you really want to delete this announcement?")) return;
        
        const toastId = toast.loading("Deleting...");
        try {
            await announcementService.deleteAnnouncement(id);
            toast.success("Announcement deleted", { id: toastId });
            fetchData();
        } catch (err) { 
            toast.error("Delete failed", { id: toastId }); 
        }
    };

    const handlePublish = async (item: AnnouncementCardItem, action: 'publish' | 'unpublish') => {
        const newStatus = action === 'publish' ? 'Published' : 'Draft';
        const toastId = toast.loading(action === 'publish' ? "Publishing..." : "Unpublishing...");
        
        try {
            await announcementService.updateAnnouncement(item.id, {
                title: item.title,
                departureLocation: item.departureLocation,
                dropoffLocation: item.dropoffLocation,
                startDate: item.startDate,
                startTime: item.startTime,
                endDate: item.endDate,
                endTime: item.endTime,
                cost: item.cost,
                baggageInfo: item.baggageInfo,
                isNegotiable: item.negotiable,
                paymentMethod: item.paymentMethod ?? '',
                status: newStatus,
            });
            toast.success(
                action === 'publish' ? "Announcement published!" : "Announcement unpublished",
                { id: toastId }
            );
            fetchData();
        } catch (err) { 
            toast.error("Action failed", { id: toastId }); 
        }
    };

    const filteredData = useMemo(() => {
        let filtered = dataList.filter(item => 
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.departureLocation?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (activeStatusFilter !== 'All') {
            filtered = filtered.filter(item => item.status === activeStatusFilter);
        }

        return filtered;
    }, [dataList, searchQuery, activeStatusFilter]);

    const STATUS_FILTERS: { id: AnnouncementStatus | 'All', label: string, icon: any }[] = [
        { id: 'All', label: 'All', icon: null },
        { id: 'Draft', label: 'Drafts', icon: null },
        { id: 'Published', label: 'Published', icon: null },
        { id: 'Confirmed', label: 'Confirmed', icon: null },
        { id: 'Ongoing', label: 'Ongoing', icon: null },
        { id: 'Expired', label: 'Expired', icon: null },
    ];

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen pb-24 text-gray-800">
            
            {/* Header */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-primary text-white p-3 rounded-full shadow-lg hover:rotate-90 transition-all"
                    >
                        <PlusIcon className="w-6 h-6 stroke-[3]" />
                    </button>
                </div>
                {/* Status filters */}
                <div className="overflow-x-auto">
                    <div className="flex gap-2 pb-2">
                        {STATUS_FILTERS.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveStatusFilter(filter.id)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                                    activeStatusFilter === filter.id
                                        ? "bg-primary text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Barre de recherche */}
            <div className="relative mb-6">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Filter announcements..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Liste des cartes */}
            {loading ? (
                <div className="text-center py-20">
                    <ArrowPathIcon className="w-10 h-10 animate-spin mx-auto text-primary" />
                </div>
            ) : filteredData.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <BellAlertIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400 font-medium">No items in this section</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredData.map((item) => {
                        const statusStyle = getStatusStyle(item.status as AnnouncementStatus);
                        
                        return (
                            <div key={item.id} className="bg-white rounded-[16px] shadow-lg shadow-black/5 border border-gray-50 overflow-hidden transition-transform hover:scale-[1.01]">
                                
                                {/* Card Header */}
                                <div className="p-4 border-b border-gray-50 flex justify-between items-start">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text}`}>
                                        {statusStyle.label}
                                    </span>
                                    <AnnouncementTimer {...item} />
                                </div>

                                {/* Card Body */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-5">
                                        <CheckBadgeIcon className="w-4 h-4 text-primary" />
                                        <span>{item.authorName}</span>
                                    </div>

                                    {/* Specs Grid */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <MapPinIcon className="w-5 h-5 text-blue-500"/>
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">Departure</p>
                                                <p className="text-sm font-semibold truncate">{item.departureLocation}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-50 rounded-lg">
                                                <MapPinIcon className="w-5 h-5 text-red-500"/>
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">Arrival</p>
                                                <p className="text-sm font-semibold truncate">{item.dropoffLocation}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                <CalendarIcon className="w-5 h-5 text-gray-500"/>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">Date</p>
                                                <p className="text-sm font-semibold">{item.startDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/5 rounded-lg">
                                                <BanknotesIcon className="w-5 h-5 text-primary"/>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">Budget</p>
                                                <p className="text-sm font-bold text-primary">{item.cost} XAF</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <div className="flex items-center gap-2 bg-[#E9F5FF] px-3 py-1.5 rounded-full">
                                            <ClockIcon className="w-4 h-4 text-primary" />
                                            <span className="text-[11px] font-bold text-primary">{item.startTime}</span>
                                        </div>
                                        {item.negotiable && (
                                            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                                                <CheckBadgeIcon className="w-4 h-4 text-green-600" />
                                                <span className="text-[11px] font-bold text-green-600">Negotiable</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                                            <BriefcaseIcon className="w-4 h-4 text-gray-500" />
                                            <span className="text-[11px] font-bold text-gray-600 truncate max-w-[100px]">
                                                {item.baggageInfo || 'Standard'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <>
                                            <button 
                                                onClick={() => handleEdit(item)}
                                                className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                            >
                                                <PencilSquareIcon className="w-4 h-4" />
                                                Edit
                                            </button>
                                            
                                            {item.status !== 'Published' ? (
                                                <button 
                                                    onClick={() => handlePublish(item, 'publish')}
                                                    className="flex-1 bg-green-50 text-green-600 py-3.5 rounded-xl font-bold text-sm hover:bg-green-100 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <PaperAirplaneIcon className="w-4 h-4" />
                                                    Publish
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handlePublish(item, 'unpublish')}
                                                    className="flex-1 bg-orange-50 text-orange-600 py-3.5 rounded-xl font-bold text-sm hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <ArrowUturnLeftIcon className="w-4 h-4" />
                                                    Unpublish
                                                </button>
                                            )}
                                            
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="bg-red-50 text-red-500 p-3.5 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal Création */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-xl rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">Create request</h2>
                            <button onClick={() => setShowCreateModal(false)}>
                                <XMarkIcon className="w-6 h-6"/>
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-5 overflow-y-auto">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Title</label>
                                <input 
                                    required 
                                    placeholder="e.g. Melen - Mvan trip" 
                                    className="w-full p-3.5 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 font-semibold" 
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})} 
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <p className="text-[11px] uppercase font-bold text-gray-400 mb-2">Departure</p>
                                    <input
                                        required
                                        placeholder="Ex: Melen / Yaoundé"
                                        className="w-full p-3.5 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                                        value={formData.departureLocation}
                                        onChange={(e) => setFormData({ ...formData, departureLocation: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase font-bold text-gray-400 mb-2">Arrival</p>
                                    <input
                                        required
                                        placeholder="Ex: Mvan / Yaoundé"
                                        className="w-full p-3.5 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                                        value={formData.dropoffLocation}
                                        onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input 
                                    required 
                                    type="date" 
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold" 
                                    value={formData.startDate}
                                    onChange={e => setFormData({...formData, startDate: e.target.value})} 
                                />
                                <input 
                                    required 
                                    type="time" 
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold" 
                                    value={formData.startTime}
                                    onChange={e => setFormData({...formData, startTime: e.target.value})} 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input 
                                    required 
                                    type="date" 
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold" 
                                    value={formData.endDate}
                                    onChange={e => setFormData({...formData, endDate: e.target.value})} 
                                />
                                <input 
                                    required 
                                    type="time" 
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold" 
                                    value={formData.endTime}
                                    onChange={e => setFormData({...formData, endTime: e.target.value})} 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input 
                                    required 
                                    placeholder="Price (XAF)" 
                                    type="number" 
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-bold text-primary" 
                                    value={formData.cost}
                                    onChange={e => setFormData({...formData, cost: e.target.value})} 
                                />
                                <select 
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold outline-none" 
                                    value={formData.paymentMethod}
                                    onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                                >
                                    <option value="cash">Cash</option>
                                    <option value="momo">Mobile Money</option>
                                    <option value="card">Card</option>
                                </select>
                            </div>
                            <input 
                                placeholder="Baggage info (optional)" 
                                className="w-full p-3.5 rounded-xl bg-gray-50 border-none font-semibold" 
                                value={formData.baggageInfo}
                                onChange={e => setFormData({...formData, baggageInfo: e.target.value})} 
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold outline-none"
                                    value={formData.tripType}
                                    onChange={e => setFormData({ ...formData, tripType: e.target.value as TripType })}
                                    required
                                >
                                    <option value="ONE_WAY">One-way</option>
                                    <option value="ROUND_TRIP">Round trip</option>
                                </select>
                                <input
                                    required
                                    placeholder="Meetup point"
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold"
                                    value={formData.meetupPoint}
                                    onChange={e => setFormData({ ...formData, meetupPoint: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold outline-none"
                                    value={formData.tripIntention}
                                    onChange={e => setFormData({ ...formData, tripIntention: e.target.value as TripIntention })}
                                    required
                                >
                                    <option value="PASSENGERS">Passengers</option>
                                    <option value="PACKAGES">Packages</option>
                                    <option value="BOTH">Both</option>
                                </select>
                                <select
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold outline-none"
                                    value={formData.pricingMethod}
                                    onChange={e => setFormData({ ...formData, pricingMethod: e.target.value as PricingMethod })}
                                    required
                                >
                                    <option value="FIXED">Fixed</option>
                                    <option value="PER_KM">Per km</option>
                                    <option value="PER_HOUR">Per hour</option>
                                    <option value="PER_DAY">Per day</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 accent-primary" 
                                    checked={formData.isNegotiable}
                                    onChange={e => setFormData({...formData, isNegotiable: e.target.checked})} 
                                />
                                <span className="text-sm font-bold text-primary">Price is negotiable</span>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all uppercase tracking-widest text-sm"
                            >
                                Publish announcement
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-xl rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">Edit request</h2>
                            <button onClick={() => setShowEditModal(false)}>
                                <XMarkIcon className="w-6 h-6"/>
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-6 space-y-5 overflow-y-auto">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Title</label>
                                <input 
                                    required 
                                    placeholder="e.g. Melen - Mvan trip" 
                                    className="w-full p-3.5 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 font-semibold" 
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})} 
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <p className="text-[11px] uppercase font-bold text-gray-400 mb-2">Departure</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <select
                                            className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold outline-none"
                                            value={departureRegion}
                                            onChange={(e) => {
                                                const region = e.target.value;
                                                setDepartureRegion(region);
                                                setDepartureDepartment('');
                                                setDepartureArrondissement('');
                                                setDepartureLocation(region, '', '');
                                            }}
                                            required
                                        >
                                            <option value="">Select region</option>
                                            {CAMEROON_REGIONS.map(region => (
                                                <option key={region.name} value={region.name}>{region.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold outline-none"
                                            value={departureDepartment}
                                            onChange={(e) => {
                                                const department = e.target.value;
                                                setDepartureDepartment(department);
                                                setDepartureArrondissement('');
                                                setDepartureLocation(departureRegion, department, '');
                                            }}
                                            disabled={!departureRegion}
                                            required
                                        >
                                            <option value="">Select department</option>
                                            {getDepartments(departureRegion).map(dep => (
                                                <option key={dep.name} value={dep.name}>{dep.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold outline-none"
                                            value={departureArrondissement}
                                            onChange={(e) => {
                                                const arrondissement = e.target.value;
                                                setDepartureArrondissement(arrondissement);
                                                setDepartureLocation(departureRegion, departureDepartment, arrondissement);
                                            }}
                                            disabled={!departureDepartment}
                                            required
                                        >
                                            <option value="">Select arrondissement</option>
                                            {getArrondissements(departureRegion, departureDepartment).map(arr => (
                                                <option key={arr} value={arr}>{arr}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase font-bold text-gray-400 mb-2">Arrival</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <select
                                            className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold outline-none"
                                            value={arrivalRegion}
                                            onChange={(e) => {
                                                const region = e.target.value;
                                                setArrivalRegion(region);
                                                setArrivalDepartment('');
                                                setArrivalArrondissement('');
                                                setArrivalLocation(region, '', '');
                                            }}
                                            required
                                        >
                                            <option value="">Select region</option>
                                            {CAMEROON_REGIONS.map(region => (
                                                <option key={region.name} value={region.name}>{region.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold outline-none"
                                            value={arrivalDepartment}
                                            onChange={(e) => {
                                                const department = e.target.value;
                                                setArrivalDepartment(department);
                                                setArrivalArrondissement('');
                                                setArrivalLocation(arrivalRegion, department, '');
                                            }}
                                            disabled={!arrivalRegion}
                                            required
                                        >
                                            <option value="">Select department</option>
                                            {getDepartments(arrivalRegion).map(dep => (
                                                <option key={dep.name} value={dep.name}>{dep.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold outline-none"
                                            value={arrivalArrondissement}
                                            onChange={(e) => {
                                                const arrondissement = e.target.value;
                                                setArrivalArrondissement(arrondissement);
                                                setArrivalLocation(arrivalRegion, arrivalDepartment, arrondissement);
                                            }}
                                            disabled={!arrivalDepartment}
                                            required
                                        >
                                            <option value="">Select arrondissement</option>
                                            {getArrondissements(arrivalRegion, arrivalDepartment).map(arr => (
                                                <option key={arr} value={arr}>{arr}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input 
                                    required 
                                    type="date" 
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold" 
                                    value={formData.startDate}
                                    onChange={e => setFormData({...formData, startDate: e.target.value})} 
                                />
                                <input 
                                    required 
                                    type="time" 
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold" 
                                    value={formData.startTime}
                                    onChange={e => setFormData({...formData, startTime: e.target.value})} 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input 
                                    required 
                                    type="date" 
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold" 
                                    value={formData.endDate}
                                    onChange={e => setFormData({...formData, endDate: e.target.value})} 
                                />
                                <input 
                                    required 
                                    type="time" 
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold" 
                                    value={formData.endTime}
                                    onChange={e => setFormData({...formData, endTime: e.target.value})} 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input 
                                    required 
                                    placeholder="Price (XAF)" 
                                    type="number" 
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-bold text-primary" 
                                    value={formData.cost}
                                    onChange={e => setFormData({...formData, cost: e.target.value})} 
                                />
                                <select 
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold outline-none" 
                                    value={formData.paymentMethod}
                                    onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                                >
                                    <option value="cash">Cash</option>
                                    <option value="momo">Mobile Money</option>
                                    <option value="card">Card</option>
                                </select>
                            </div>
                            <input 
                                placeholder="Baggage info (optional)" 
                                className="w-full p-3.5 rounded-xl bg-gray-50 border-none font-semibold" 
                                value={formData.baggageInfo}
                                onChange={e => setFormData({...formData, baggageInfo: e.target.value})} 
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold outline-none"
                                    value={formData.tripType}
                                    onChange={e => setFormData({ ...formData, tripType: e.target.value as TripType })}
                                    required
                                >
                                    <option value="ONE_WAY">One-way</option>
                                    <option value="ROUND_TRIP">Round trip</option>
                                </select>
                                <input
                                    required
                                    placeholder="Meetup point"
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold"
                                    value={formData.meetupPoint}
                                    onChange={e => setFormData({ ...formData, meetupPoint: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold outline-none"
                                    value={formData.tripIntention}
                                    onChange={e => setFormData({ ...formData, tripIntention: e.target.value as TripIntention })}
                                    required
                                >
                                    <option value="PASSENGERS">Passengers</option>
                                    <option value="PACKAGES">Packages</option>
                                    <option value="BOTH">Both</option>
                                </select>
                                <select
                                    className="p-3.5 rounded-xl bg-gray-50 border-none font-semibold outline-none"
                                    value={formData.pricingMethod}
                                    onChange={e => setFormData({ ...formData, pricingMethod: e.target.value as PricingMethod })}
                                    required
                                >
                                    <option value="FIXED">Fixed</option>
                                    <option value="PER_KM">Per km</option>
                                    <option value="PER_HOUR">Per hour</option>
                                    <option value="PER_DAY">Per day</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 accent-primary" 
                                    checked={formData.isNegotiable}
                                    onChange={e => setFormData({...formData, isNegotiable: e.target.checked})} 
                                />
                                <span className="text-sm font-bold text-primary">Price is negotiable</span>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all uppercase tracking-widest text-sm"
                            >
                                Update announcement
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}