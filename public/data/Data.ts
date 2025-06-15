import { title } from "process";

export const Navdata = [
  {
    title: "Home",
    reference: "home",
    url: "/",
  },

  {
    title: "Dashboard",
    reference: "",
    submenu: [
      {
        title: "User Dashboard",
        url: "/Dashboard/customer-dashboard/personal-info",
      },
      {
        title: "Driver  Dashboard",
        submenu: [
          {
            title: "Freelance ",
            url: "/Dashboard/vendor-dashboard",
          },
          {
            title: "Vehicle-Pooler ",
            url: "/Dashboard/vehicle-pooling-dashboard",
          },
        ],
      },
      {
        title: "Admin Dashboard",
        url: "/Dashboard/admin-dashboard",
      },
      {
        title: "Rental Agency",
        url: "/Dashboard/rental_agency-dashboard",
      },
    ],
  },
  {
    title: "Partner",
    reference: "Become A partner",
  },
  {
    title: "Announce",
    reference: "/AnnouncementDisplay",
    url: "/AnnouncementDisplay",
  },
  {
    title: "Marketplace",
    reference: "marketplace",
    submenu: [
      {
        title: "Driver ",
        url: "/driver-info",
      },
      {
        title: "Customer",
        url: "/customer-info",
      },
      {
        title: "Agency",
        url: "/agency-info",
      },
    ],
  },
  {
    title: "Pricing",
    reference: "pricing",
    url: "/pricing-plan",
  },
];

export const FilterData = [
  {
    data1: "All",
    data2: "Trending",
  },
  {
    data1: "Popular",
    data2: "Features",
  },
  {
    data1: "Recommend",
    data: "Theme",
  },

  {
    data1: "Original",
    data: "Tour",
  },
  {
    data1: "Packages",
    data2: "",
  },
];

export const picardData = [
  {
    id: 1,
    src: "/BOOK_YOUR_CAR.png",
    title: " Book Now ",
  },
  {
    id: 2,
    src: "/Rectangle13.jpg",
    title: "Have A Save Trip",
  },
  {
    id: 3,
    src: "/img2.jpg",
    title: "Get The Best plans",
  },
  {
    id: 4,
    src: "/Capture d'écran 2024-07-04 135855.png",
    title: "Choose The Best Itinerary",
  },
];

export const NavDriver = [
  // conducteur sans voiture
  {
    title: "Home",
    reference: "/",
  },

  {
    title: "Dashboard",
    reference: "/Dashboard/vendor-dashboard",
  },
  {
    title: "Announce",
    reference: "/AnnouncementDisplay",
  },
  {
    title: "Pricing",
    reference: "/pricing-plan",
  },
];

export const NavDriver2 = [
  //conducteur avec voiture
  {
    title: "Home",
    reference: "/",
  },

  {
    title: "Dashboard",
    reference: "/Dashboard/vendor-dashboard",
  },
  {
    title: "Announce",
    reference: "/Announce",
  },
  {
    title: "Pricing",
    reference: "/pricing-plan",
  },
];

export const NavDriver3 = [
  //client sans voiture
  {
    title: "Home",
    reference: "/",
  },

  {
    title: "Dashboard",
    reference: "/customer-dashboard",
  },
  {
    title: "Announce",
    reference: "/Announce",
  },
  {
    title: "Pricing",
    reference: "/pricing-plan",
  },
];

export const NavDriver4 = [
  //client avec voiture
  {
    title: "Home",
    reference: "/",
  },

  {
    title: "Dashboard",
    reference: "/customer-dashboard",
  },
  {
    title: "Announce",
    reference: "/Announce",
  },
  {
    title: "Pricing",
    reference: "/pricing-plan",
  },
];
export const NavItinary = [
  {
    title: "Home",
    reference: "/",
  },
  {
    title: "Pricing",
    reference: "/pricing-plan",
  },
];
export const NavTraveller = [
  {
    title: "Home",
    reference: "/",
  },

  {
    title: "Dashboard",
    reference: "/customer-dashboard",
  },
  {
    title: "Home",
    reference: "/",
  },
  {
    title: "Pricing",
    reference: "/pricing-plan",
  },
];

export const NavAttractions = [
  {
    title: "Home",
    reference: "/",
  },
  {
    title: "Pricing",
    reference: "/pricing-plan",
  },
];

export const NavAgency = [
  //client avec voiture
  {
    title: "Home",
    reference: "/",
  },

  {
    title: "Dashboard",
    reference: "/Dashboard/agency-dashboard",
  },
  {
    title: "Announce",
    reference: "/Announce",
  },
  {
    title: "Pricing",
    reference: "/pricing-plan",
  },
];

export const NavRental = [
  //client avec voiture
  {
    title: "Home",
    reference: "/",
  },

  {
    title: "Dashboard",
    reference: "/Dashboard/rental_agency-dashboard",
  },
  {
    title: "Announce",
    reference: "/Announce",
  },
  {
    title: "Pricing",
    reference: "/pricing-plan",
  },
];
