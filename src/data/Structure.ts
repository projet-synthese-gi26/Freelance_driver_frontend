import {countries, languages} from "countries-list";

import moment from 'moment-timezone';
import currencyCodes from 'currency-codes';
import { Order } from "@/app/type/Order";
import { Referral } from '@/app/type/Referral';
import { Question,Rubrique,Ride } from "@/app/type/Faq";

const currencyOptions = currencyCodes.data.map(currency => ({
  value: currency.code,
  label: `${currency.code} - ${currency.currency}`
}));

const timezoneOptions = moment.tz.names().map(tz => ({
  value: tz,
  label: `${tz} (${moment.tz(tz).format('Z')})`
}));

const countryOptions = Object.entries(countries).map(([code, country]) => ({
    value: code,
    label: country.name
}));

const languageOptions = Object.entries(languages).map(([code, language]) => ({
    value: code,
    label: language.name
}));

const meetingPointOptions = [
    { value: 'any', label: 'any' },
    { value: 'airport', label: 'Airport' },
    { value: 'trainStation', label: 'Train Station' },
    { value: 'cityCenter', label: 'City Center' },
    { value: 'hotel', label: 'Hôtel' },

];

const driverType=[
    {value: 'any', label: 'Any'},
    {value: 'with', label: 'With vehicle'},
    {value: 'without', label: 'Without vehicle'},

]

const tripType=[
    {value: 'any', label: 'Any'},
    {value: 'vip', label: 'VIP'},
    {value: 'classic', label: 'Classic'},
    {value: 'emergency', label: 'Emergency'},

]

const vehiculeType=[
    {value: 'economy', label: 'Economy'},
    {value: 'luxury', label: 'Luxury'},
    {value: 'Commercial', label: 'Commercial'},
    {value: 'Personal', label: 'Personal'},
]

const vehicleSize = [
    {value: "compact", label: "Compact"},
    {value: "midsize", label: "Midsize"},
    {value:"fullsize",label:"Fullsize"},
    {value: "suv", label: "SUV"},
    {value: "truck", label: "Truck"},
    {value: "van", label: "Van"},
    {value: 'minivan', label: 'Minivan'},
    {value: 'pickup', label: 'Pickup'},
  ];

  const testimonials = [
    {
      text: "Ce produit a révolutionné notre façon de travailler. Nous sommes plus productifs que jamais!",
      author: "Marie Dupont",
      title: "CEO",
      imageUrl: "/img/bafou1.jpg"
    },
    {
      text: "Le service client est exceptionnel. Ils ont résolu notre problème en un rien de temps.",
      author: "Jean Martin",
      title: "Directeur technique",
      imageUrl: "/img/bafou6.jpg"
    },
    {
      text: "Je recommande vivement cette solution à toute entreprise cherchant à améliorer ses processus.",
      author: "Sophie Lefebvre",
      title: "Manager",
      imageUrl: "/img/bafou4.jpg"
    }
  ];

  const partners = [
    {
      id: '1',
      name: 'Entreprise A',
      logo: '/img/featured-img-2.jpg',
      website: 'https://www.entreprise-a.com'
    },
    {
      id: '2',
      name: 'Entreprise B',
      logo: '/img/featured-img-3.jpg',
      website: 'https://www.entreprise-b.com'
    },
    {
      id: '3',
      name: 'Entreprise C',
      logo: '/img/featured-img-4.jpg',
      website: 'https://www.entreprise-a.com'
    },
    {
      id: '4',
      name: 'Entreprise D',
      logo: '/img/featured-img-5.jpg',
      website: 'https://www.entreprise-b.com'
    },
  ];

const paymentHistoryData= [
    {
        paymentInvoice: 'INV12345',
        driverName: 'John Doe',
        amount: 50.0,
        paymentMethod: 'Credit Card',
        status: 'Completed',
        createdAt: '2023-08-01T10:00:00Z',
        payAt: '2023-08-01T10:05:00Z',
    },
    {
        paymentInvoice: 'INV12346',
        driverName: 'Jane Smith',
        amount: 30.0,
        paymentMethod: 'Cash',
        status: 'Pending',
        createdAt: '2023-08-05T14:15:00Z',
        payAt: '',
    },
    {
        paymentInvoice: 'INV12347',
        driverName: 'Alice Johnson',
        amount: 70.0,
        paymentMethod: 'Mobile Payment',
        status: 'Failed',
        createdAt: '2023-08-10T09:30:00Z',
        payAt: '',
    },
    {
        paymentInvoice: 'INV12348',
        driverName: 'Bob Brown',
        amount: 25.0,
        paymentMethod: 'Credit Card',
        status: 'Completed',
        createdAt: '2023-08-15T12:00:00Z',
        payAt: '2023-08-15T12:02:00Z',
    },
    {
        paymentInvoice: 'INV12349',
        driverName: 'Charlie Davis',
        amount: 45.0,
        paymentMethod: 'Cash',
        status: 'Pending',
        createdAt: '2023-08-18T17:45:00Z',
        payAt: '',
    },
];

const paymentMethod=[
    {value: 'any', label: 'any', icon:'/img/visa.png', info:''},
    {value: 'Bank Card', label: 'Bank Card', icon:'/img/credit-card-2.png', info:'Card Number'},
    {value: 'Paypal', label: 'Paypal', icon:'/img/paypal.png', info:'examplePaypal@gmail.com'},
    {value: 'Orange Money', label: 'Orange Money', icon:'/img/orange-money.png', info:'123456789'},
    {value: 'Mobile Money', label: 'Mobile Money', icon:'/img/mobile--money.png', info:'987654321'},
    {value: 'Cash', label: 'Cash', icon:'/img/salary.png', info:'30000'},
]

const tripIntention=[
    {value: 'any', label: 'any'},
    {value: 'tourism', label: 'Tourism'},
    {value: 'short', label: 'Short distance travel'},
    {value: 'long', label: 'Long distance travel'},
    {value: 'errand', label: 'Errand'} 
]

const pricingMethod=[
    {value: 'any', label: 'any'},
    {value: 'km', label: 'Price per km'},
    {value: 'hour', label: 'Price per hour'},
    {value: 'day', label: 'Price per day'},
    {value: 'flatRate',label:'flat rate'},

]



const paymentOptions = [
    {value: 'any', label: 'any'},
    {value: 'km', label: 'Price per km'},
    {value: 'hour', label: 'Price per hour'},
    {value: 'day', label: 'Price per day'},
    {value: 'flatRate', label: 'Flat rate'},
];

const experienceOptions = [
    { value: '0-1', label: '0-1 an' },
    { value: '1-3', label: '1-3 ans' },
    { value: '3-5', label: '3-5 ans' },
    { value: '5-10', label: '5-10 ans' },
    { value: '10+', label: '10+ ans' },
];

const adsMap=[
    {id:1,pickup_location:'Yaoundé',dropoff_location:'Baganté',travel_date:'15/08/2024',travel_time:'3pm',
    offer_status:'Published',mobility_cost:1500,is_mobility_cost_negociable:false,
    prefered_payment_mode_id:'Card',prefered_billing_id:'',created_at:'14/08/2024',
    updated_at:'15/08/2024',is_luggage:false
    },
    {id:2,pickup_location:'Douala',dropoff_location:'Edea',travel_date:'20/08/2024',travel_time:'8am',
    offer_status:'Drafts',mobility_cost:1000,is_mobility_cost_negociable:true,
    prefered_payment_mode_id:'Mobile',prefered_billing_id:'',created_at:'14/08/2024',
    updated_at:'15/08/2024',is_luggage:false
    },
    {id:3,pickup_location:'Bamenda',dropoff_location:'Maroua',travel_date:'20/08/2024',travel_time:'2am',
    offer_status:'Confirmed',mobility_cost:50000,is_mobility_cost_negociable:true,
    prefered_payment_mode_id:'Mobile',prefered_billing_id:'',created_at:'14/08/2024',
    updated_at:'15/08/2024',is_luggage:false 
    },
    {id:4,pickup_location:'Edea',dropoff_location:'Mamfe',travel_date:'16/08/2024',travel_time:'2am',
        offer_status:'Drafts',mobility_cost:50000,is_mobility_cost_negociable:true,
        prefered_payment_mode_id:'Mobile',prefered_billing_id:'',created_at:'14/08/2024',
        updated_at:'15/08/2024',is_luggage:false
    },
    {id:5,pickup_location:'Kribi',dropoff_location:'Bafoussam',travel_date:'20/08/2024',travel_time:'2am',
        offer_status:'Drafts',mobility_cost:50000,is_mobility_cost_negociable:true,
        prefered_payment_mode_id:'Mobile',prefered_billing_id:'',created_at:'14/08/2024',
        updated_at:'15/08/2024',is_luggage:true
    },
    {id:6,pickup_location:'Kribi',dropoff_location:'Bafoussam',travel_date:'20/08/2024',travel_time:'2am',
        offer_status:'Expired',mobility_cost:50000,is_mobility_cost_negociable:true,
        prefered_payment_mode_id:'Mobile',prefered_billing_id:'',created_at:'14/08/2024',
        updated_at:'15/08/2024',is_luggage:true
    }
]

const BillAddress=[
    {id:1, country:'Cameroon', city:'Yaoundé', street:'Biyem Assi', postalCode:'0000', select:false},
    {id:2, country:'Cameroon', city:'Douala', street:'Ndokoti', postalCode:'0000', select:false}
  ]

const sortOptions = [
    {value: 'any', label: 'any'},
    { value: 'mostCommented', label: 'Top rated' },
    { value: 'avgRating', label: 'The avarage ' },
    { value: 'priceLow', label: 'Price: Low to High' },
    { value: 'priceHigh', label: 'Price: High to Low' },

];

const amenitiesOptions = [
    { value: 'any', label: 'any' },
    { value: 'wifi', label: 'WiFi' },
    { value: 'air_conditioned', label: 'Air-conditioned' },
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'soft', label: 'Soft' },
    { value: 'Audio system', label: 'Audio system' },
    { value: 'Bluetooth', label: 'Bluetooth' },
    { value: 'Backup camera', label: 'Backup camera' },
    { value: 'Display Screen', label: 'Display Screen' },
];

const referringOptions = [
    { value: 'any', label: 'any' },
    { value: 'syndicate', label: 'Syndicate' },
    { value: 'agencies', label: 'Agencies' },
    { value: 'driving_school', label: 'Driving School' },
    { value: 'driving_organisation', label: 'Driving Organisation' },
];

const priceCategoryOptions = [
    { value: 'all_price', label: 'All prices' },
    { value: 'low_price', label: 'Low price' },
    { value: 'high_price', label: 'High price' },
    { value: 'average_price', label: 'Average price' },
    { value: 'best_price', label: 'Best price' },
];

const vehicles = [
    {
      id: 1,
      model: "Camry",
      brand: "Toyota",
      transmission: "Automatic 2WD",
      size: "Midsize",
      fuelType: "Gasoline",
      type: "Sedan",
      manufacturer: "Toyota Motor Corporation",
      amenities: ["Air conditioning", "Audio system", "Bluetooth", "Backup camera"],
      keywords: ["economical", "reliable", "comfortable"],
      registration: "AB-123-CD",
      registrationExpiryDate: "2025-12-31",
      serialnumber: "JTDKB3FU1M3226789",
      images: [], // This would normally be filled with File objects
      tankCapacity: 50, // in liters
      luggageCapacity: 450, // in liters
      availableSeats: 5,
      canTransport: ["Passengers", "Luggage","Animals"],
      mileage: 45000, // in kilometers
      fuelconsumption: 6.5, // in liters/100km
      age: 3,
      active:true // in years
    },
    {
      id: 2,
      model: "Corolla",
      brand: "Toyota",
      transmission: "Automatic 2WD",
      size: "Compact",
      fuelType: "Gasoline",
      type: "Sedan",
      manufacturer: "Toyota Motor Corporation",
      amenities: ["Air conditioning", "Audio system", "Bluetooth", "Backup camera"],
      keywords: ["economical", "reliable", "compact"],
      registration: "EF-456-GH",
      registrationExpiryDate: "2026-06-30",
      serialnumber: "JTDBR3FU2M3456789",
      images: [], // This would normally be filled with File objects
      tankCapacity: 45, // in liters
      luggageCapacity: 350, // in liters
      availableSeats: 5,
      canTransport: ["Passengers", "Luggage"],
      mileage: 35000, // in kilometers
      fuelconsumption: 5.5, // in liters/100km
      age: 2,
      active:false // in years
    },
    {
      id: 3,
      model: "RAV4",
      brand: "Toyota",
      transmission: "Automatic 4WD",
      size: "Compact SUV",
      fuelType: "Gasoline",
      type: "SUV",
      manufacturer: "Toyota Motor Corporation",
      amenities: ["Air conditioning", "Audio system", "Bluetooth", "Backup camera", "All-wheel drive"],
      keywords: ["spacious", "versatile", "capable"],
      registration: "IJ-789-KL",
      registrationExpiryDate: "2027-03-31",
      serialnumber: "JTMRF3FU3M3789012",
      images: [], // This would normally be filled with File objects
      tankCapacity: 55, // in liters
      luggageCapacity: 580, // in liters
      availableSeats: 5,
      canTransport: ["Passengers", "Luggage", "Sports equipment"],
      mileage: 25000, // in kilometers
      fuelconsumption: 7.0, // in liters/100km
      age: 1,
      active:false // in years
    }
  ];

const fuelType=[
    {value:"diesel",label:"Diesel"},
    {value:"gasoline",label:"Gasoline"},
    {value:"electric",label:"Electric"},
    {value:"hybrid",label:"Hybrid"},
    {value:"solar",label:"Solar"},
    {value:"propane",label:"Propane"},
    {value:"ethanol",label:"Ethanol"},
]

const orders: Order[] = [
  {
      id: "ORD001",
      clientName: "Alice Dupont",
      start_date: "2023-11-01",
      end_date: "2023-11-02",
      start_time: "08:00",
      end_time: "17:00",
      pick_location: "Paris",
      drop_location: "Lyon",
      availability: 'Full time',
      status: 'Pending',
      price: 200,
      payment_type: 'Flat rate',
      passenger: 2,
      Lugguage: 'With Lugguage',
      Negociable: true,
  },
  {
      id: "ORD002",
      clientName: "Bob Martin",
      start_date: "2023-11-03",
      end_date: "2023-11-03",
      start_time: "09:00",
      end_time: "15:00",
      pick_location: "Marseille",
      drop_location: "Nice",
      availability: 'Part time',
      status: 'Accepted',
      price: 150,
      payment_type: 'Per Hour',
      passenger: 1,
      Lugguage: 'Without Lugguage',
      Negociable: false,
  },
  {
      id: "ORD003",
      clientName: "Charlie Durand",
      start_date: "2023-11-05",
      end_date: "2023-11-05",
      start_time: "10:00",
      end_time: "14:00",
      pick_location: "Bordeaux",
      drop_location: "Toulouse",
      availability: 'Full time',
      status: 'Rejected',
      price: 180,
      payment_type: 'Per Km',
      passenger: 3,
      Lugguage: 'With Lugguage',
      Negociable: true,
  },
  {
      id: "ORD004",
      clientName: "David Lefevre",
      start_date: "2023-11-07",
      end_date: "2023-11-08",
      start_time: "07:00",
      end_time: "19:00",
      pick_location: "Lille",
      drop_location: "Strasbourg",
      availability: 'Full time',
      status: 'Pending',
      price: 250,
      payment_type: 'Flat rate',
      passenger: 4,
      Lugguage: 'With Lugguage',
      Negociable: false,
  },
  {
      id: "ORD005",
      clientName: "Eve Simon",
      start_date: "2023-11-10",
      end_date: "2023-11-10",
      start_time: "11:00",
      end_time: "16:00",
      pick_location: "Nantes",
      drop_location: "Rennes",
      availability: 'Part time',
      status: 'Accepted',
      price: 100,
      payment_type: 'Per Day',
      passenger: 2,
      Lugguage: 'Without Lugguage',
      Negociable: true,
  },
  {
      id: "ORD006",
      clientName: "Frank Bernard",
      start_date: "2023-11-12",
      end_date: "2023-11-12",
      start_time: "12:00",
      end_time: "18:00",
      pick_location: "Lyon",
      drop_location: "Grenoble",
      availability: 'Full time',
      status: 'Pending',
      price: 130,
      payment_type: 'Per Hour',
      passenger: 1,
      Lugguage: 'With Lugguage',
      Negociable: false,
  },
  {
      id: "ORD007",
      clientName: "Grace Moreau",
      start_date: "2023-11-14",
      end_date: "2023-11-15",
      start_time: "09:30",
      end_time: "17:30",
      pick_location: "Strasbourg",
      drop_location: "Mulhouse",
      availability: 'Part time',
      status: 'Rejected',
      price: 160,
      payment_type: 'Per Km',
      passenger: 2,
      Lugguage: 'Without Lugguage',
      Negociable: true,
  },
  {
    id:"ORD008", 
    clientName:"Hugo Petit", 
    start_date:"2023-11-16", 
    end_date:"2023-11-16", 
    start_time:"08:30", 
    end_time:"12:30", 
    pick_location:"Marseille", 
    drop_location:"Avignon", 
    availability:'Full time', 
    status:'Accepted', 
    price : 90, 
    payment_type:'Per Day', 
    passenger : 1, 
    Lugguage:'With Lugguage', 
    Negociable:false
  },
  {
    id:"ORD009", 
    clientName:"Isabelle Dubois", 
    start_date:"2023-11-18", 
    end_date:"2023-11-19", 
    start_time:"10 :00", 
    end_time:"20 :00", 
    pick_location:"Toulouse", 
    drop_location:"Bordeaux",
    availability:'Full time', 
    status:'Pending', 
    price : 220, 
    payment_type:'Flat rate', 
    passenger : 3, 
    Lugguage:'With Lugguage', 
    Negociable:true
  },
  {
    id:"ORD010", 
    clientName:"Julien Gauthier", 
    start_date:"2023-11-20", 
    end_date:"2023-11-20", 
    start_time:"09 :00", 
    end_time:"14 :00", 
    pick_location:"Nantes", 
    drop_location:"Lille", 
    availability:'Part time', 
    status:'Accepted', 
    price : 140, 
    payment_type:'Per Hour', 
    passenger : 2, 
    Lugguage:'Without Lugguage', 
    Negociable:false
  },
  {
    id:"ORD011", 
    clientName:"Katherine Roussel", 
    start_date:"2023-11-22", 
    end_date:"2023-11-22", 
    start_time:"12 :00", 
    end_time:"18 :00", 
    pick_location:"Lyon", 
    drop_location:"Nice", 
    availability:'Full time', 
    status:'Rejected', 
    price : 180, 
    payment_type:'Per Km', 
    passenger : 1, 
    Lugguage:'With Lugguage', 
    Negociable:true
  },
  {
    id:"ORD012", 
    clientName:"Louis Bernard", 
    start_date:"2023-11-24", 
    end_date:"2023-11-24", 
    start_time:"10 :30", 
    end_time:"16 :30", 
    pick_location:"Marseille", 
    drop_location:"Avignon", 
    availability:'Part time', 
    status:'Pending', 
    price : 110, 
    payment_type:'Per Day', 
    passenger : 2, 
    Lugguage:'Without Lugguage', 
    Negociable:false
  },
  {
    id:"ORD013", 
    clientName:"Monique Lefèvre", 
    start_date:"2023-11-26", 
    end_date:"2023-11-26", 
    start_time:"09 :00", 
    end_time:"13 :00", 
    pick_location:"Strasbourg", 
    drop_location:"Mulhouse", 
    availability:'Full time', 
    status:'Accepted', 
    price : 95, 
    payment_type:'Flat rate', 
    passenger : 1, 
    Lugguage:'With Lugguage', 
    Negociable:true
  },
  {
   id:"ORD014" ,  
   clientName:"Nicolas Martin" ,  
   start_date:"2023-11-28" ,  
   end_date:"2023-11-28" ,  
   start_time:"08 :00" ,  
   end_time:"10 :00" ,  
   pick_location:"Bordeaux" ,  
   drop_location:"Toulouse" ,  
   availability:'Part time' ,  
   status:'Rejected' ,  
   price : 60 ,  
   payment_type:'Per Hour' ,  
   passenger : 1 ,  
   Lugguage:'Without Lugguage' ,  
   Negociable:false
 },
 {
   id:"ORD015" ,  
   clientName:"Olivier Caron" ,  
   start_date:"2023-12-01" ,  
   end_date:"2023-12-02" ,  
   start_time:"14 :00" ,  
   end_time:"20 :00" ,  
   pick_location:"Nantes" ,  
   drop_location:"Rennes" ,  
   availability:'Full time' ,  
   status:'Pending' ,  
   price : 250 ,  
   payment_type:'Flat rate' ,  
   passenger : 4 ,  
   Lugguage:'With Lugguage' ,  
   Negociable:true
 },
 {
   id:"ORD016" ,  
   clientName:"Paul Simon" ,  
   start_date:"2023-12-03" ,  
   end_date:"2023-12-03" ,  
   start_time:"09 :30" ,  
   end_time:"15 :30" ,  
   pick_location:"Marseille" ,  
   drop_location:"Nice" ,  
   availability:'Part time' ,  
   status:'Accepted' ,  
   price : 130 ,  
   payment_type:'Per Km' ,  
   passenger : 1 ,  
   Lugguage:'Without Lugguage' ,  
   Negociable:false
 },
 {
   id:"ORD017" ,  
   clientName:"Sophie Dubois" ,  
   start_date:"2023-12-05" ,  
   end_date:"2023-12-05" ,  
   start_time:"12 :00" ,  
   end_time:"18 :00" ,  
   pick_location:"Lille" ,  
   drop_location:"Strasbourg" ,  
   availability:'Full time' ,  
   status:'Rejected' ,  
   price : 190 ,  
   payment_type:'Per Day' ,  
   passenger : 2 ,  
   Lugguage:'With Lugguage' ,  
   Negociable:true
 },
 {
   id:"ORD018" ,  
   clientName:"Thierry Moreau" ,  
   start_date:"2023-12-07" ,  
   end_date:"2023-12-07" ,  
   start_time:"09 :00" ,  
   end_time:"13 :00" ,  
   pick_location:"Nantes" ,  
   drop_location:"Rennes" ,  
   availability:'Part time' ,  
   status:'Pending' ,  
   price : 80 ,
   payment_type:'Per Hour' ,  
   passenger : 1 ,  
   Lugguage:'Without Lugguage' ,  
   Negociable:false
 },
 {
  id :"ORD019" ,    
  clientName :"Victor Roussel" ,    
  start_date :"2023 -12 -09" ,    
  end_date :"2023 -12 -09" ,    
  start_time :"10 :30" ,    
  end_time :"14 :30" ,    
  pick_location :"Lyon" ,    
  drop_location :"Nice" ,    
  availability :'Full time' ,    
  status :'Accepted' ,    
  price : 150 ,    
  payment_type :'Per Km' ,    
  passenger : 2 ,    
  Lugguage :'With Lugguage' ,    
  Negociable :true   
 },
 {
  id :"ORD020" ,    
  clientName :"Elodie Lefevre" ,    
  start_date :"2023 -12 -10" ,    
  end_date :"2023 -12 -10" ,    
  start_time :"08 :00" ,    
  end_time :"12 :00" ,    
  pick_location :"Marseille" ,    
  drop_location :"Avignon" ,    
  availability :'Part time' ,    
  status :'Rejected' ,    
  price : 120 ,    
  payment_type :'Flat rate' ,    
  passenger : 1 ,    
  Lugguage :'Without Lugguage' ,    
  Negociable :false   
 }
];

const referrals: Referral[] = [
  {
      id: "REF001",
      name: "Syndicat des Conducteurs",
      type: "syndicate",
      verificationDate: "2023-10-01",
  },
  {
      id: "REF002",
      name: "École de Conduite Paris",
      type: "driving_school",
      verificationDate: "2023-10-05",
  },
  {
      id: "REF003",
      name: "Association des Chauffeurs",
      type: "syndicate",
      verificationDate: "2023-10-10",
  },
  {
      id: "REF004",
      name: "Auto École Lyon",
      type: "driving_school",
      verificationDate: "2023-10-12",
  },
  {
      id: "REF005",
      name: "Syndicat des Transporteurs",
      type: "syndicate",
      verificationDate: "2023-10-15",
  },
  {
      id: "REF006",
      name: "École de Conduite Nice",
      type: "driving_school",
      verificationDate: "2023-10-18",
  },
  {
      id: "REF007",
      name: "Autopartage Syndicat",
      type: "other",
      verificationDate: "2023-10-20",
  },
  {
      id: "REF008",
      name: "Conduite Sécurisée",
      type: "driving_school",
      verificationDate: "2023-10-22",
  },
  {
      id: "REF009",
      name: "Syndicat des Conducteurs Professionnels",
      type: "syndicate",
      verificationDate: "2023-10-25",
  },
  {
      id: "REF010",
      name: "École de Conduite Bordeaux",
      type: "driving_school",
      verificationDate: "2023-10-28",
  },
  {
      id: "REF011",
      name: "Syndicat des Chauffeurs de Taxi",
      type: "syndicate",
      verificationDate: "2023-11-01",
  },
  {
      id: "REF012",
      name: "École de Conduite Toulouse",
      type: "driving_school",
      verificationDate: "2023-11-03",
  },
  {
      id: "REF013",
      name: "Syndicat des Conducteurs de Bus",
      type: "syndicate",
      verificationDate: "2023-11-05",
  },
  {
      id: "REF014",
      name: "Conduite Écologique",
      type: "other",
      verificationDate: "2023-11-07",
  },
  {
      id: "REF015",
      name: "École de Conduite Marseille",
      type: "driving_school",
      verificationDate: "2023-11-10",
  },
  {
      id: "REF016",
      name: "Syndicat des Transporteurs Publics",
      type: "syndicate",
      verificationDate: "2023-11-12",
  },
  {
      id: "REF017",
      name: "École de Conduite Lille",
      type: "driving_school",
      verificationDate: "2023-11-15",
  },
  {
      id: "REF018",
      name: "Syndicat des Conducteurs Indépendants",
      type: "other",
      verificationDate: "2023-11-18",
  },
  {
      id: "REF019",
      name: "École de Conduite Strasbourg",
      type: "driving_school",
      verificationDate: "2023-11-20",
  },
  {
      id: "REF020",
      name: "Syndicat des Conducteurs de Véhicules Électriques",
      type: "syndicate",
      verificationDate: "2023-11-22",
  }
];

const reviews: Review[] = [
{
    review_id: "REV001",
    user_id: "USR001",
    rated_entity_id: "ENT001",
    rated_entity_type: "driving_school",
    rating: 5,
    comment: "Excellente école de conduite, les instructeurs sont très professionnels !",
    note: 9,
    icon: "star",
    like_count: 25,
    dislike_count: 2,
    created_at: "2023-10-01T10:00:00Z",
    update_at: "2023-10-01T12:00:00Z",
    is_hidden: false,
},
{
    review_id: "REV002",
    user_id: "USR002",
    rated_entity_id: "ENT002",
    rated_entity_type: "syndicate",
    rating: 4,
    comment: "Bonne expérience, mais il y a quelques améliorations à apporter.",
    note: 8,
    icon: "thumbs-up",
    like_count: 15,
    dislike_count: 1,
    created_at: "2023-10-02T11:30:00Z",
    update_at: "2023-10-02T11:30:00Z",
    is_hidden: false,
},
{
    review_id: "REV003",
    user_id: "USR003",
    rated_entity_id: "ENT003",
    rated_entity_type: "driving_school",
    rating: 3,
    comment: "L'école est correcte, mais les horaires sont parfois compliqués.",
    note: 6,
    icon: "meh",
    like_count: 5,
    dislike_count: 3,
    created_at: "2023-10-03T14:45:00Z",
    update_at: "2023-10-03T14:45:00Z",
    is_hidden: false,
},
{
    review_id: "REV004",
    user_id: "USR004",
    rated_entity_id: "ENT004",
    rated_entity_type: "other",
    rating: 2,
    comment: "Pas satisfait de l'accueil, je ne recommande pas.",
    note: 4,
    icon: "thumbs-down",
    like_count: 2,
    dislike_count: 20,
    created_at: "2023-10-04T09:15:00Z",
    update_at: "2023-10-04T09:15:00Z",
    is_hidden: false,
},
{
    review_id: "REV005",
    user_id: "USR005",
    rated_entity_id: "ENT005",
    rated_entity_type: "syndicate",
    rating: 5,
    comment: "Une très bonne organisation, je me sens soutenu !",
    note: 10,
    icon: "heart",
    like_count: 30,
    dislike_count: 0,
    created_at: "2023-10-05T16:30:00Z",
    update_at: "2023-10-05T16:30:00Z",
    is_hidden: false,
}
];

const faqData: Rubrique[] = [
  {
    id: 1,
    title: "General Questions",
    questions: [
      {
        id: 1,
        question: "What is Yowyob Letsgo Freelance Driver?",
        answer: "Yowyob Letsgo Freelance Driver is a platform that connects freelance drivers with customers or passengers needing transportation services. It allows easy ride bookings through our web https://driver.yowyob.com/ and mobile application. Our goal is to provide a seamless and efficient ride-hailing experience."
      },
      {
        id: 2,
        question: "How do I sign up?",
        answer: "You can sign up by downloading our app or visiting our website. Simply fill out the registration form with your details, and you'll be set to start using the service."
      },
      {
        id: 3,
        question: "How does Freelance Driver work?",
        answer: "Passengers can request rides to all of a specific driver via the app. Our system matches them with nearby available drivers. Once the ride is completed, payment is automatically processed based the selected payment option, through the app or gré-à-gré to the driver."
      },
      {
        id: 4,
        question: "Is Freelance Driver available in my area?",
        answer: "We're continuously expanding our coverage. Check our app or website to see currently serviced areas."
      },
      {
        id: 5,
        question: "How do I download the Freelance Driver app?",
        answer: "Our app is available for free on the App Store for iOS devices and on Google Play Store for Android devices."
      }
    ]
  },
  {
    id: 2,
    title: "Rider-Related Questions",
    questions: [
      {
        id: 1,
        question: "How do I request a ride?",
        answer: "Open the app, enter your destination, choose your preferred vehicle type, and confirm your request. A nearby driver will be assigned to your ride. You can equally post a public ride announcement or directly post your drive request to a specific driver."
      },
      {
        id: 2,
        question: "How are fares calculated?",
        answer: "Fares are based on distance traveled and time taken, with possible adjustments for time of day and demand. It can also be daily-based, hourly-based or flat rate negotiation with the driver."
      },
      {
        id: 3,
        question: "Can I schedule a ride in advance?",
        answer: "Yes, you can schedule a ride up to 7 days in advance using our booking feature in the app. You can equally post your ride announcement or desire publicly or directly to a specific driver. Drivers can apply to your public ride announcement for you to accept the one that suits your needs."
      },
      {
        id: 4,
        question: "How do I pay for my ride?",
        answer: "You can pay via the app using a credit card, PayPal, or other payment methods available in your region mainly mobile money & compatible apps (e.g. MoMo and Orange Money (OM) in Cameroon). You can equally choose the gré-à-gré option which includes direct negotiation with you and the driver."
      },
      {
        id: 5,
        question: "What if I leave an item in the car?",
        answer: "Pay attention when leaving the vehicle; your responsibility is described in the ToU. If that happens, you can contact our customer service immediately through the app. We'll help you get in touch with the driver to retrieve your item."
      }
    ]
  },
  {
    id: 3,
    title: "Driver-Related Questions",
    questions: [
      {
        id: 1,
        question: "How can I become a driver on the platform?",
        answer: "To become a driver, you must complete the application process through our app by signing up, provide necessary documentation, and pass a background check. A referral (e.g. Driving School or a Transportation Syndicate) must validate your application."
      },
      {
        id: 2,
        question: "What are the requirements to drive with Letsgo Driver?",
        answer: "Drivers must be at least 18 years old, possess a valid driver's license, have a reliable vehicle that meets our quality and safety criteria, and meet our insurance requirements."
      },
      {
        id: 3,
        question: "How do I get paid?",
        answer: "There are two payment options: gré-à-gré payment to the driver or payment through our platform. For the second option, payments are made weekly via the preferred payment method of the driver. E.g. direct bank transfer to your account or to your mobile pocket account."
      },
      {
        id: 4,
        question: "Can I choose my own schedule?",
        answer: "Yes, you have complete freedom to choose when and how long you want to work, by planning and publishing your availability."
      },
      {
        id: 5,
        question: "What happens if there's an accident?",
        answer: "First ensure everyone's safety. Contact authorities if necessary, then our emergency support through the app. Above all, check our responsibility and yours in the agreed ToU."
      }
    ]
  },
  {
    id: 4,
    title: "Account Management",
    questions: [
      {
        id: 1,
        question: "How do I create an account?",
        answer: "Download the app, tap 'Sign Up,' and follow the prompts to enter your details and verify your account."
      },
      {
        id: 2,
        question: "How do I update my personal information?",
        answer: "Go to the 'Profile' or 'Account Settings' section in the app to update your personal information."
      },
      {
        id: 3,
        question: "How do I change my payment method?",
        answer: "In the app, go to 'Payment Methods' in your account settings to add, remove, or update payment options."
      },
      {
        id: 4,
        question: "Can I use the same account as both a rider and a driver?",
        answer: "No, for security reasons, we maintain separate accounts for riders and drivers. You'll need to create distinct accounts for each role."
      }
    ]
  },
  {
    id: 5,
    title: "Payment and Wallet Questions",
    questions: [
      {
        id: 1,
        question: "How do I pay for my rides?",
        answer: "You can pay for your rides using a credit/debit card or by topping up your wallet within the app."
      },
      {
        id: 2,
        question: "What is the wallet feature?",
        answer: "The wallet allows you to store funds in your account, making it easier to pay for rides without needing to enter payment details each time."
      },
      {
        id: 3,
        question: "How can I top up my wallet?",
        answer: "You can top up your wallet through the app by selecting the 'Top Up' option and following the prompts to add funds."
      },
      {
        id: 4,
        question: "Can I get a refund if I cancel my ride?",
        answer: "Refund policies vary based on the timing of your cancellation. Please refer to our cancellation policy for more details."
      }
    ]
  },
  {    id: 6,
      title: "Subscription Questions",
      questions: [
        {
          id: 1,
          question: "What are subscription plans?",
          answer: "Subscription plans offer users discounted rates for frequent rides. You can choose a plan that suits your needs and enjoy savings on your trips."
        },
        {
          id: 2,
          question: "How do I manage my subscription?",
          answer: "You can manage your subscription through your account settings in the app. Here, you can view, upgrade, or cancel your subscription."
        }
      ]
    },
    {
      id: 7,
      title: "Trip and Reservation Questions",
      questions: [
        {
          id: 1,
          question: "How do I book a ride?",
          answer: "To book a ride, open the app, enter your destination, select your preferred vehicle type, and confirm your booking."
        },
        {
          id: 2,
          question: "Can I schedule a ride in advance?",
          answer: "Yes, you can schedule rides in advance by selecting the \"Schedule a Ride\" option in the app and choosing your desired date and time."
        }
      ]
    },
    {
      id: 8,
      title: "Safety and Support Questions",
      questions: [
        {
          id: 1,
          question: "What safety measures does Letsgo implement?",
          answer: "We prioritize safety by conducting background checks on drivers, providing in-app safety features, and allowing users to share their trip details with trusted contacts."
        },
        {
          id: 2,
          question: "How can I contact customer support?",
          answer: "You can reach our customer support team through the app or website by navigating to the \"Help\" section and submitting a request."
        }
      ]
    },
    {
      id: 9,
      title: "Technical Questions",
      questions: [
        {
          id: 1,
          question: "What should I do if I encounter an issue with the app?",
          answer: "If you experience any technical issues, try restarting the app. If the problem persists, please contact our support team for assistance."
        },
        {
          id: 2,
          question: "Is the app available on all devices?",
          answer: "Yes, our app is available for both iOS and Android devices. You can download it from the App Store or Google Play Store."
        },
        {
          id: 3,
          question: "What features are included in the Letsgo Freelance Driver platform?",
          answer: "Here are the key features included in the Letsgo Freelance Driver platform:\n\nUser-Friendly Interface\n- Intuitive Design: Easy navigation for both drivers and passengers.\n- Quick Registration: Simple sign-up process for new users.\n\nRide Booking\n- Instant Booking: Users can book rides in real-time.\n- Scheduled Rides: Option to schedule rides in advance.\n- Ride Types: Multiple vehicle options (e.g., economy, premium, van).\n\nDriver Features\n- Driver Dashboard: Overview of earnings, trip history, and performance metrics.\n- Trip Management: Ability to accept, decline, or manage ride requests.\n- Navigation Assistance: Integrated GPS for optimal routing.\n\nPayment Options\n- Multiple Payment Methods: Accepts credit/debit cards, mobile wallets, and cash.\n- Wallet Feature: Users can top up their wallets for quicker payments.\n- Automatic Fare Calculation: Transparent fare estimates before booking.\n\nSubscription Plans\n- Discounted Rides: Users can subscribe for regular rides at a reduced rate.\n- Flexible Plans: Various subscription tiers to suit different needs.\n\nRatings and Reviews\n- User Feedback: Passengers can rate drivers and leave comments.\n- Driver Ratings: Drivers can also rate passengers for accountability.\n\nSafety Features\n- In-App Emergency Button: Quick access to emergency services.\n- Trip Sharing: Share ride details with trusted contacts.\n- Driver Background Checks: Ensuring passenger safety through thorough vetting.\n\nCustomer Support\n- 24/7 Support: Accessible customer service via chat, email, or phone.\n- Help Center: FAQs and troubleshooting guides available in-app.\n\nNotifications and Alerts\n- Real-Time Updates: Notifications for ride requests, cancellations, and promotions.\n- Trip Status Alerts: Keep users informed about their ride's progress.\n\nAnalytics and Reporting\n- Earnings Reports: Detailed breakdown of daily, weekly, and monthly earnings for drivers.\n- User Insights: Data analytics to help improve service and user experience.\n\nPromotions and Discounts\n- Referral Programs: Incentives for users who refer new customers.\n- Seasonal Promotions: Special discounts during holidays or events.\n\nMulti-Language Support\n- Language Options: Catering to diverse user demographics with multiple language settings.\n\nThese features collectively enhance the experience for both our drivers and riders, making the Letsgo Freelance Driver platform a comprehensive solution for mobility needs."
        }
      ]
    }
  ];

  const HelpData: Rubrique[] = [
    {
      id: 1,
      title: "App Installation Issues",
      questions: [
        {
          id: 1,
          question: "I can't install the app. What should I do?",
          answer: [
            "Check Compatibility: Ensure your device meets the app's system requirements (iOS/Android version).",
            "Storage Space: Verify that you have enough storage space on your device.",
            "Internet Connection: Make sure you have a stable internet connection."
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Account Registration Problems",
      questions: [
        {
          id: 1,
          question: "I'm having trouble creating an account.",
          answer: [
            "Email Verification: Check your email for a verification link and follow the instructions.",
            "Password Issues: Ensure your password meets the required criteria (length, special characters).",
            "Existing Account: If you already have an account, try logging in instead."
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Login Issues",
      questions: [
        {
          id: 1,
          question: "I can't log into my account.",
          answer: [
            "Forgot Password: Use the \"Forgot Password\" option to reset your password.",
            "Verify your username and password",
            "Account Lockout: After multiple failed attempts, your account may be temporarily locked. Wait 15 minutes before trying again.",
            "Clear Cache: Clear the app cache and data or browser cache and try logging in again (for Android users).",
            "Ensure your account hasn't been suspended (check your email for notifications)",
            "If using social media login, ensure you're logged into that account on your device."
          ]
        }
      ]
    },
    {
      id: 4,
      title: "Ride Booking Problems",
      questions: [
        {
          id: 1,
          question: "I can't book a ride.",
          answer: [
            "Location Services: Ensure your location services are enabled for the app.",
            "Payment Method: Check that your payment method is valid and has sufficient funds.",
            "Driver Availability: If no drivers are available, try again later or check different pickup locations."
          ]
        },
        {
          id: 2,
          question: "I can't Request a Ride",
          answer: [
            "Check your internet connection",
            "Verify your payment method is valid and has sufficient funds",
            "Ensure location services are enabled for the app",
            "Try restarting the app",
            "If the issue continues, try uninstalling and reinstalling the app"
          ]
        },
        {
          id: 3,
          question: "A Driver Can't Find My Location",
          answer: [
            "Ensure your GPS is turned on and working correctly",
            "Try moving to an open area for better GPS signal",
            "Manually enter your pickup address",
            "Contact your driver through the in-app messaging or calling feature"
          ]
        },
        {
          id: 4,
          question: "A Ride is Cancelled Unexpectedly",
          answer: [
            "Check your app for any notifications about the cancellation",
            "Ensure your payment method is valid",
            "Try requesting another ride",
            "If it happens repeatedly, contact our support team"
          ]
        },
        {
          id: 5,
          question: "Issues with Scheduled Rides",
          answer: [
            "Ensure your app is up to date",
            "Check that your scheduled ride details are correct",
            "Verify your payment method is valid for the scheduled time",
            "If you need to cancel, do so within the allowed time frame to avoid fees"
          ]
        }
      ]
    },
    {
      id: 5,
      title: "Payment Issues",
      questions: [
        {
          id: 1,
          question: "My payment didn't go through.",
          answer: [
            "Payment Method: Verify that your payment method details credit/debit card details are correct.",
            "Bank Restrictions: Contact your bank to ensure there are no restrictions on transactions.",
            "Check Wallet Balance: If using the wallet, ensure you have enough balance to cover the fare.",
            "Ensure your card hasn't expired",
            "Check if you have sufficient funds",
            "Try adding a different payment method"
          ]
        }
      ]
    },
    {
      id: 6,
      title: "App Won't Open or Crashes or Freezes",
      questions: [
        {
          id: 1,
          question: "The app won't open, keeps crashing or freezing.",
          answer: [
            "Update the App: Ensure you're using the latest version of the app or that your device's operating system is up to date.",
            "Close all background apps and Restart Your Device: Sometimes, a simple restart can resolve app issues.",
            "Reinstall the App: Uninstall and then reinstall the app to clear any corrupted files.",
            "Check your internet connection",
            "If problems persist, contact our support team"
          ]
        },
        {
          id: 2,
          question: "App Features Not Working",
          answer: [
            "Ensure you're using the latest version of the app",
            "Check your internet connection",
            "Restart the app",
            "If problems persist, try uninstalling and reinstalling the app"
          ]
        }
      ]
    },
    {
      id: 7,
      title: "Driver Issues and Ride Quality",
      questions: [
        {
          id: 1,
          question: "I'm a driver and can't accept rides.",
          answer: [
            "Driver Status: Ensure your driver status is set to \"Online\" in the app.",
            "Check Notifications: Look for any alerts regarding your account status or requirements.",
            "App Permissions: Verify that the app has the necessary permissions (location, notifications).",
            "Use the in-app rating and feedback system after your ride",
            "For serious issues, use the \"Report a Problem\" feature in the app",
            "For immediate assistance during a ride, use the in-app emergency button"
          ]
        },
        {
          id: 2,
          question: "Unable to Contact Driver",
          answer: [
            "Check your phone's settings to ensure the app has permission to make calls",
            "Verify your phone number in the app settings",
            "Try the in-app messaging feature instead",
            "If all else fails, contact our support team for assistance"
          ]
        }
      ]
    },
    {
      id: 8,
      title: "Subscription Management",
      questions: [
        {
          id: 1,
          question: "I can't manage my subscription.",
          answer: [
            "Login Issues: Ensure you are logged into the correct account associated with the subscription.",
            "Subscription Status: Check if your subscription is still active or has expired.",
            "Contact Support: If issues persist, reach out to customer support for assistance."
          ]
        }
      ]
    },
    {
      id: 9,
      title: "Safety Features Not Functioning",
      questions: [
        {
          id: 1,
          question: "The emergency button or trip sharing isn't working.",
          answer: [
            "App Permissions: Ensure location and notification permissions are enabled.",
            "Internet Connection: Check your internet connection, as these features require connectivity.",
            "Restart the App: Close and reopen the app to refresh the features."
          ]
        }
      ]
    },
    {
      id: 10,
      title: "Customer Support",
      questions: [
        {
          id: 1,
          question: "How can I contact customer support?",
          answer: [
            "In-App Support: Use the \"Help\" section in the app to submit a request.",
            "Email Support: Reach out to our support team at support@yowyob.com.",
            "Live Chat: If available, use the live chat feature on our website for immediate assistance."
          ]
        }
      ]
    }
  ];

  

  const rides: Ride[] = [
    {
      id: "1",
      type: "short distance",
      startDateTime: new Date("2024-09-01T08:00:00"),
      endDateTime: new Date("2024-09-01T08:30:00"),
      paymentOption: "cash",
      paymentDetails: 15,
      clientName: "Alice Dupont",
      paymentMethod: "card",
      status: "completed",
    },
    {
      id: "2",
      type: "long distance",
      startDateTime: new Date("2024-09-01T09:00:00"),
      endDateTime: new Date("2024-09-01T11:00:00"),
      paymentOption: "per km",
      paymentDetails: 50,
      clientName: "Bob Martin",
      paymentMethod: "paypal",
      status: "ongoing",
    },
    {
      id: "3",
      type: "short distance",
      startDateTime: new Date("2024-09-01T10:00:00"),
      endDateTime: new Date("2024-09-01T10:20:00"),
      paymentOption: "daily",
      paymentDetails: 30,
      clientName: "Céline Petit",
      paymentMethod: "mobile",
      status: "completed",
    },
    {
      id: "4",
      type: "long distance",
      startDateTime: new Date("2024-09-01T12:00:00"),
      endDateTime: new Date("2024-09-01T14:00:00"),
      paymentOption: "hourly",
      paymentDetails: 100,
      clientName: "David Leroy",
      paymentMethod: "card",
      status: "cancelled",
    },
    {
      id: "5",
      type: "short distance",
      startDateTime: new Date("2024-09-01T15:00:00"),
      endDateTime: new Date("2024-09-01T15:15:00"),
      paymentOption: "cash",
      paymentDetails: 10,
      clientName: "Emma Moreau",
      paymentMethod: "paypal",
      status: "completed",
    },
    {
      id: "6",
      type: "long distance",
      startDateTime: new Date("2024-09-01T16:00:00"),
      endDateTime: new Date("2024-09-01T18:00:00"),
      paymentOption: "per km",
      paymentDetails: 75,
      clientName: "François Dubois",
      paymentMethod: "mobile",
      status: "ongoing",
    },
    {
      id: "7",
      type: "short distance",
      startDateTime: new Date("2024-09-01T19:00:00"),
      endDateTime: new Date("2024-09-01T19:30:00"),
      paymentOption: "daily",
      paymentDetails: 25,
      clientName: "Gabrielle Lefèvre",
      paymentMethod: "card",
      status: "completed",
    },
    {
      id: "8",
      type: "long distance",
      startDateTime: new Date("2024-09-01T20:00:00"),
      endDateTime: new Date("2024-09-01T22:00:00"),
      paymentOption: "hourly",
      paymentDetails: 120,
      clientName: "Hugo Garnier",
      paymentMethod: "paypal",
      status: "cancelled",
    },
    {
      id: "9",
      type: "short distance",
      startDateTime: new Date("2024-09-01T21:00:00"),
      endDateTime: new Date("2024-09-01T21:15:00"),
      paymentOption: "cash",
      paymentDetails: 12,
      clientName: "Isabelle Roche",
      paymentMethod: "mobile",
      status: "completed",
    },
    {
      id: "10",
      type: "long distance",
      startDateTime: new Date("2024-09-01T22:00:00"),
      endDateTime: new Date("2024-09-01T23:30:00"),
      paymentOption: "per km",
      paymentDetails: 90,
      clientName: "Jean-Claude Simon",
      paymentMethod: "card",
      status: "ongoing",
    }
  ];

export {

    //Searchpage
    meetingPointOptions,
    driverType,
    tripIntention,
    tripType,
    paymentMethod,
    pricingMethod,
    countryOptions,
    languageOptions,

    //SearchResultSections
    paymentOptions,
    experienceOptions,
    sortOptions,
    amenitiesOptions,
    referringOptions,
    priceCategoryOptions,

    //Dashboard user preference
    currencyOptions,
    timezoneOptions,
    vehiculeType,

    //USer Ads
    adsMap,
    BillAddress,
    paymentHistoryData,

    vehicles,
    fuelType,
    vehicleSize,
    orders,
    referrals,
    reviews,
    faqData,
    HelpData,
    rides,
    testimonials,
    partners





}