export const carlistings = [
    {
      driverData:{
          driver_id:"b21ccd75-5be8-4129-bd14-f4837b935fa3",
          driver_profile_image : "/img/chauffeur.png",
          driver_first_name : "3GI",
          driver_last_name:"Henri",
          driver_phone_number : "6********",
          driverLocation: "Melen Yaounde",
          driver_email : "fogangzacharieteneIgor40642gkhgkuhfkvfkjg@gmail.com",
          driver_keywords:["Enthusiast" ," Expert" , "Night Driving" , "Long distance" , "Permis B"],
          driver_languages :["English", "French"],
          driver_specialities:["Long distance", "Night driving"],
          description:
              "Passionné de conduite et de mécanique, " +
              "Martin est un chauffeur expérimentéise qui " +
              "s'efforce de toujours offrir un service irréprochable à ses clients." +
              " Doté d'un excellent sens de l'orientation et d'une connaissance approfondie" +
              " des routes et des itinéraires, il est capable de naviguer avec aisance " +
              "dans les rues les plus encombrées. Son grand professionnalisme et sa courtoisie " +
              "font de lui un atout précieux pour toute entreprise de transport." +
              " Toujours à l'écoute des besoins de ses passagers, il fait preuve d'une " +
              "patience et d'une adaptabilité remarquables, quel que soit le type de trajet." +
              " Attentif à la sécurité, il veille scrupuleusement au respect des règles de la route. " +
              "En dehors de son travail, Martin est un amateur de sports mécaniques qui apprécie" +
              " de passer du temps avec sa famille et ses amis. Son enthousiasme et son " +
              "dévouement en font un employé apprécié de tous.",
          driver_license_number:"Axvdsvsdvv",
          driver_experiences: [
              {
                  driver_experience_id: '123e4567-e89b-12d3-a456-426614174000',
                  driver_id: '98765432-e89b-12d3-a456-426614174000',
                  start_date: '2013-09-01T00:00:00Z',
                  end_date: '2018-06-30T00:00:00Z',
                  description: 'Chauffeure pour une compagnie de taxis de luxe',
                  vehicle_models: ['Mercedes-Benz Classe S', 'BMW Série 7'],
                  transmission_types: ['Manuelle', 'Automatique'],
                  driving_skills: ['Conduite de luxe', 'Service client exceptionnel'],
                  experience_illustrations: ['/img/car-list-6.jpg', '/img/car-list-5.jpg'],
                  experience_references: ['/docs/reference1.pdf'],
                  created_at: '2023-01-01T12:00:00Z',
                  updated_at: '2023-06-15T09:30:00Z'
              },
              {
                  driver_experience_id: '987e6543-e21b-12d3-a456-426614174000',
                  driver_id: '98765432-e89b-12d3-a456-426614174000',
                  start_date: '2018-07-01T00:00:00Z',
                  end_date: null,
                  description: 'Chauffeure VIP indépendante',
                  vehicle_models: ['Rolls-Royce Phantom', 'Bentley Continental'],
                  transmission_types: ['Automatique'],
                  driving_skills: ['Conduite de luxe', 'Service client exceptionnel'],
                  experience_illustrations: ['/img/car-list-2.jpg', '/img/car-list-3.jpg'],
                  experience_references: ['/docs/reference2.pdf', '/docs/reference3.pdf'],
                  created_at: '2023-01-01T12:00:00Z',
                  updated_at: '2023-06-15T09:30:00Z'
              }
          ],
          driver_portfolio:[" 1990 Permis B à AUTO-ECOLE KASAP"],
          has_vehicle:true,
          driver_statistics:{
              review_total_number:0,
              average_rating:0,
          },
          driver_reviews:[
              {
                  review_id :"uuidv4()",
                  rated_entity_id :"uuidv4()",
                  rated_entity_type :"uuidv4()",
                  comment:
                      "Excellent vehicle ! This car was soft and comfortable. I would recommend it !",
                  created_at :"23/10/2024",
                  updated_at :"18h15",
                  note :3,
                  likes_count :3,
                  dislikes_count :4,
                  reviewer_name: "William",
              },
              {
                  review_id :"uuidv4()",
                  rated_entity_id :"uuidv4()",
                  rated_entity_type :"uuidv4()",
                  comment:
                      "Excellent vehicle ! This car was soft and comfortable. I would recommend it !",
                  created_at :"23/10/2024",
                  updated_at :"18h15",
                  note :3,
                  likes_count :3,
                  dislikes_count :4,
                  reviewer_name: "William",
              },
              {
                  review_id :"uuidv4()",
                  rated_entity_id :"uuidv4()",
                  rated_entity_type :"uuidv4()",
                  comment:
                      "Excellent vehicle ! This car was soft and comfortable. I would recommend it !",
                  created_at :"23/10/2024",
                  updated_at :"18h15",
                  note :3,
                  likes_count :3,
                  dislikes_count :4,
                  reviewer_name: "William",
              },
              {
                  review_id :"uuidv4()",
                  rated_entity_id :"uuidv4()",
                  rated_entity_type :"uuidv4()",
                  comment:
                      "Excellent vehicle ! This car was soft and comfortable. I would recommend it !",
                  created_at :"23/10/2024",
                  updated_at :"18h15",
                  note :3,
                  likes_count :3,
                  dislikes_count :4,
                  reviewer_name: "William",
              },
          ],
          driver_availability_table: [
              {
                  driver_availability_id: "1",
                  is_available: true,
                  start_date: "2024-06-28",
                  end_date: "2024-06-28",
                  start_time: "08:00",
                  end_time: "18:00",
                  price: 1000,
                  driver_billing_method_name: "daily",
                  is_interval:false
              },
              {
                  driver_availability_id: "2",
                  is_available: true,
                  start_date: "2024-06-29",
                  end_date: "2024-06-29",
                  start_time: "08:00",
                  end_time: "18:00",
                  price: 10000,
                  driver_billing_method_name: "daily",
                  is_interval:false
              },
              {
                  driver_availability_id: "3",
                  is_available: true,
                  start_date: "2024-06-30",
                  end_date: "2024-07-01",
                  start_time: "12:00",
                  end_time: "02:00",
                  price: 1500,
                  driver_billing_method_name: "flat_rate",
                  is_interval:true

              },
              {
                  driver_availability_id: "4",
                  is_available: true,
                  start_date: "2024-07-01",
                  end_date: "2024-07-01",
                  start_time: "08:00",
                  end_time: "18:00",
                  price: 2000,
                  driver_billing_method_name: "daily",
                  is_interval:true
              }
          ],

          transmission_types:["Manual 2WD", "Manual 4WD", "Automatic 2WD", "Automatic 4WD"],
          preferred_language:["English", "french","Deutsch"],
          driver_certifications:["Certified by driving school kassap"],


      },
      vehicleData:{
          vehicleId: 'b21ccd75-5be8-4129-bd14-f4837b935fa3',
          illustration_images: [
              { url: '/img/devantVoiture.png', alt: 'Photo 1' },
              { url: '/img/derriereVoiture.png', alt: 'Photo 2' },
              { url: '/img/latteralVoiture.png', alt: 'Photo 3' },
              { url: '/img/InterieurVoiture.png', alt: 'Photo 4' },
          ],
          can_transport: ['animals', 'Goods', 'Pets', 'fragile package'],
          vehicle_amenities: ['Air-conditioned' ,' Comfortable' ,'Soft', 'screen','wifi','Toll charge','Car Parking','Alarm'],
          model_name: 'Corolla',

          transmission_type_name: 'Automatic 2WD',
          make_name: 'Toyota',
          type_name: 'personnal',
          size_name: 'Compact',
          fuel_type_name: 'Gasoline',
          manufacturer_name: 'Toyota',
          registration_number: 'AZS 8778',
          vehicle_serial_number: 'AZS87784',
          tank_capacity: 50,
          luggage_max_capacity: 400,
          total_seat_number: 5,
          vehicle_age_at_start: 2,
          mileage_at_mileage_since_commissioning:0,
          average_fuel_consumption_per_kilometer:1,
          vehicle_reviews:[

              {
                  review_id :"uuidv4()",
                  rated_entity_id :"uuidv4()",
                  rated_entity_type :"uuidv4()",
                  comment:
                      "Excellent vehicle ! This car was soft and comfortable. I would recommend it !",
                  created_at :"23/10/2024",
                  updated_at :"18h15",
                  note :3,
                  likes_count :3,
                  dislikes_count :4,
                  reviewer_name: "William",
              },
              {
                  review_id :"uuidv4()",
                  rated_entity_id :"uuidv4()",
                  rated_entity_type :"uuidv4()",
                  comment:
                      "Excellent vehicle ! This car was air-conditionned and comfortable. I would recommend it !",
                  created_at :"23/10/2024",
                  updated_at :"18h15",
                  note :3,
                  likes_count :3,
                  dislikes_count :4,
                  reviewer_name: "Zacharie",
              }
          ],
   },
},


    {
        driverData: {
            driver_id: "c32dfe86-7a9b-4e3c-b5f1-8d6e9a7c2b3d",
            driver_profile_image: "/img/chauffeur_nouveau.png",
            driver_first_name: "Alex",
            driver_last_name: "Dubois",
            driver_phone_number: "7********",
            driverLocation: "Biyem-Assi Yaoundé",
            driver_email: "alexdubois_pro_chauffeur75@gmail.com",
            driver_keywords: ["Experienced", "Punctual", "City Expert", "Mountain driving", "Permis C"],
            driver_languages: ["French", "English", "Spanish"],
            driver_specialities: ["City tours", "Mountain routes"],
            Description:
                "Alex est un chauffeur professionnel avec plus de 15 ans d'expérience. " +
                "Spécialisé dans les trajets urbains et montagneux, il offre un service " +
                "de qualité supérieure à ses clients. Sa connaissance approfondie des routes " +
                "et sa capacité à anticiper les conditions de circulation font de lui un choix " +
                "idéal pour les trajets complexes. Calme et courtois, Alex s'assure toujours du " +
                "confort et de la sécurité de ses passagers. En dehors du travail, il est passionné " +
                "de photographie et aime capturer les paysages qu'il traverse lors de ses voyages.",
            driver_license_number: "DBSCM98765432",
            driver_experiences:[
                {
                    driver_experience_id: '123e4567-e89b-12d3-a456-426614174000',
                    driver_id: '98765432-e89b-12d3-a456-426614174000',
                    start_date: '2013-09-01T00:00:00Z',
                    end_date: '2018-06-30T00:00:00Z',
                    description: 'Chauffeure pour une compagnie de taxis de luxe',
                    vehicle_models: ['Mercedes-Benz Classe S', 'BMW Série 7'],
                    transmission_types: ['Manuelle', 'Automatique'],
                    driving_skills: ['Conduite de luxe', 'Service client exceptionnel'],
                    experience_illustrations: ['/img/car-list-2.jpg', '/img/car-list-3.jpg'],
                    experience_references: ['/docs/reference1.pdf'],
                    created_at: '2023-01-01T12:00:00Z',
                    updated_at: '2023-06-15T09:30:00Z'
                },
                {
                    driver_experience_id: '987e6543-e21b-12d3-a456-426614174000',
                    driver_id: '98765432-e89b-12d3-a456-426614174000',
                    start_date: '2018-07-01T00:00:00Z',
                    end_date: null,
                    description: 'Chauffeure VIP indépendante',
                    vehicle_models: ['Rolls-Royce Phantom', 'Bentley Continental'],
                    transmission_types: ['Automatique'],
                    driving_skills: ['Conduite de luxe', 'Service client exceptionnel'],
                    experience_illustrations: ['/img/car-list-2.jpg', '/img/car-list-3.jpg'],
                    experience_references: ['/docs/reference2.pdf', '/docs/reference3.pdf'],
                    created_at: '2023-01-01T12:00:00Z',
                    updated_at: '2023-06-15T09:30:00Z'
                }
            ],
            driver_portfolio: [
                "2005 Permis B à AUTO-ECOLE EXCELLENCE",
                "2009 Permis C à CENTRE DE FORMATION ROUTIÈRE AVANCÉE"
            ],
            has_vehicle: true,
            driver_statistics: {
                review_total_number: 87,
                average_rating: 4.7,
            },
            driver_reviews: [
                {
                    review_id: "rev-9876-5432-1098",
                    rated_entity_id: "ent-5678-9012-3456",
                    rated_entity_type: "driver",
                    comment: "Alex est un excellent chauffeur, très professionnel et ponctuel. Je le recommande vivement !",
                    created_at: "15/07/2024",
                    updated_at: "10h30",
                    note: 5,
                    likes_count: 12,
                    dislikes_count: 0,
                    reviewer_name: "Sophie",
                },
                {
                    review_id: "rev-2468-1357-9080",
                    rated_entity_id: "ent-1357-2468-9012",
                    rated_entity_type: "driver",
                    comment: "Trajet agréable et sécurisé. Alex connaît parfaitement la ville.",
                    created_at: "02/08/2024",
                    updated_at: "14h45",
                    note: 4,
                    likes_count: 8,
                    dislikes_count: 1,
                    reviewer_name: "Pierre",
                },
            ],
            driver_availability_table: [
                {
                    driver_availability_id: "1",
                    is_available: true,
                    start_date: "2024-06-28",
                    end_date: "2024-06-28",
                    start_time: "08:00",
                    end_time: "18:00",
                    price: 1000,
                    driver_billing_method_name: "daily",
                    is_interval:false
                },
                {
                    driver_availability_id: "2",
                    is_available: true,
                    start_date: "2024-06-29",
                    end_date: "2024-06-29",
                    start_time: "08:00",
                    end_time: "18:00",
                    price: 10000,
                    driver_billing_method_name: "daily",
                    is_interval:false
                },
                {
                    driver_availability_id: "3",
                    is_available: true,
                    start_date: "2024-06-30",
                    end_date: "2024-07-01",
                    start_time: "12:00",
                    end_time: "02:00",
                    price: 1500,
                    driver_billing_method_name: "flat_rate",
                    is_interval:true

                },
                {
                    driver_availability_id: "4",
                    is_available: true,
                    start_date: "2024-07-01",
                    end_date: "2024-07-01",
                    start_time: "08:00",
                    end_time: "18:00",
                    price: 2000,
                    driver_billing_method_name: "daily",
                    is_interval:true
                }
            ],
            transmission_types: ["Manual", "Automatic"],
            preferred_language: ["French", "English", "Spanish"],
            driver_certifications: ["Certification en conduite éco-responsable", "Formation premiers secours"],
        },
        vehicleData: {
            vehicleId: 'veh-9876-5432-1098',
            illustration_images: [
                { url: '/img/devantVoiture.png', alt: 'Photo 1' },
                { url: '/img/derriereVoiture.png', alt: 'Photo 2' },
                { url: '/img/latteralVoiture.png', alt: 'Photo 3' },
                { url: '/img/InterieurVoiture.png', alt: 'Photo 4' },
            ],
            can_transport: ['Bagages', 'Colis', 'Animaux de compagnie', 'Équipement sportif'],
            vehicle_amenities: ['Air-conditioned' ,'wifi','Toll charge','Car Parking','Alarm'],
            model_name: 'Camry',
            transmission_type_name: 'Automatic',
            make_name: 'Toyota',
            type_name: 'Berline',
            size_name: 'Moyenne',
            fuel_type_name: 'Hybrid',
            manufacturer_name: 'Toyota',
            registration_number: 'CE 234 YD',
            vehicle_serial_number: 'JTDKARFP0L3123456',
            tank_capacity: 55,
            luggage_max_capacity: 450,
            total_seat_number: 5,
            vehicle_age_at_start: 1,
            mileage_at_mileage_since_commissioning: 15000,
            average_fuel_consumption_per_kilometer: 4.5,
            vehicle_reviews: [
                {
                    review_id: "vrev-1234-5678-9012",
                    rated_entity_id: "vent-5678-1234-9012",
                    rated_entity_type: "vehicle",
                    comment: "Voiture très confortable et économe en carburant. Parfaite pour les longs trajets.",
                    created_at: "05/08/2024",
                    updated_at: "16h20",
                    note: 5,
                    likes_count: 15,
                    dislikes_count: 1,
                    reviewer_name: "Marie",
                },
                {
                    review_id: "vrev-9876-5432-1098",
                    rated_entity_id: "vent-1098-7654-3210",
                    rated_entity_type: "vehicle",
                    comment: "Bonne voiture dans l'ensemble, mais le GPS pourrait être amélioré.",
                    created_at: "20/07/2024",
                    updated_at: "09h45",
                    note: 4,
                    likes_count: 7,
                    dislikes_count: 2,
                    reviewer_name: "Thomas",
                }
            ],
        },
    },

    {
        driverData: {
            driver_id: "f45e9c21-3a7d-4b8f-95c6-1d2e3f4a5b6c",
            driver_profile_image: "/img/chauffeur_ancien.png",
            driver_first_name: "Sophie",
            driver_last_name: "Mbarga",
            driver_phone_number: "9********",
            driverLocation: "Bastos Yaoundé",
            driver_email: "sophie.mbarga_chauffeur_pro@outlook.com",
            driver_keywords: ["Courtoise", "Ponctuelle", "VIP", "Multilingue", "Permis D"],
            driver_languages: ["French", "English", "German", "Ewondo"],
            driver_specialities: ["Transport VIP", "Longue distance", "Événements spéciaux"],
            Description:
                "Sophie est une chauffeure professionnelle spécialisée dans le transport VIP " +
                "et les longues distances. Avec plus de 10 ans d'expérience, elle se distingue " +
                "par sa ponctualité, sa discrétion et son professionnalisme. Polyglotte, Sophie " +
                "excelle dans la communication avec une clientèle internationale. Sa conduite " +
                "souple et sa connaissance approfondie des routes en font une chauffeure de choix " +
                "pour les trajets exigeants. Passionnée par son métier, Sophie s'efforce constamment " +
                "d'améliorer ses compétences pour offrir un service de haute qualité.",
            driver_license_number: "MBSPH78901234",
            driver_experiences: [
                {
                    driver_experience_id: '123e4567-e89b-12d3-a456-426614174000',
                    driver_id: '98765432-e89b-12d3-a456-426614174000',
                    start_date: '2013-09-01T00:00:00Z',
                    end_date: '2018-06-30T00:00:00Z',
                    description: 'Chauffeure pour une compagnie de taxis de luxe',
                    vehicle_models: ['Mercedes-Benz Classe S', 'BMW Série 7'],
                    transmission_types: ['Manuelle', 'Automatique'],
                    driving_skills: ['Conduite de luxe', 'Service client exceptionnel'],
                    experience_illustrations: ['/img/car-list-1.jpg', '/img/car-list-4.jpg'],
                    experience_references: ['/docs/reference1.pdf'],
                    created_at: '2023-01-01T12:00:00Z',
                    updated_at: '2023-06-15T09:30:00Z'
                },
                {
                    driver_experience_id: '987e6543-e21b-12d3-a456-426614174000',
                    driver_id: '98765432-e89b-12d3-a456-426614174000',
                    start_date: '2018-07-01T00:00:00Z',
                    end_date: null,
                    description: 'Chauffeure VIP indépendante',
                    vehicle_models: ['Rolls-Royce Phantom', 'Bentley Continental'],
                    transmission_types: ['Automatique'],
                    driving_skills: ['Conduite VIP', 'Discrétion', 'Ponctualité', 'Connaissance des protocoles'],
                    experience_illustrations: ['/img/car-list-2.jpg', '/img/car-list-5.jpg'],
                    experience_references: ['/docs/reference2.pdf', '/docs/reference3.pdf'],
                    created_at: '2023-01-01T12:00:00Z',
                    updated_at: '2023-06-15T09:30:00Z'
                }
            ],
            driver_portfolio: [
                "2010 Permis B à ÉCOLE DE CONDUITE ÉLITE",
                "2012 Permis D à CENTRE DE FORMATION POUR CHAUFFEURS PROFESSIONNELS",
                "2015 Certification en conduite défensive"
            ],
            has_vehicle: true,
            driver_statistics: {
                review_total_number: 132,
                average_rating: 4.9,
            },
            driver_reviews: [
                {
                    review_id: "rev-abcd-efgh-ijkl",
                    rated_entity_id: "ent-mnop-qrst-uvwx",
                    rated_entity_type: "driver",
                    comment: "Sophie est exceptionnelle ! Service impeccable et conduite très confortable.",
                    created_at: "03/08/2024",
                    updated_at: "17h20",
                    note: 5,
                    likes_count: 24,
                    dislikes_count: 0,
                    reviewer_name: "Jean-Pierre",
                },
                {
                    review_id: "rev-wxyz-1234-5678",
                    rated_entity_id: "ent-9876-5432-dcba",
                    rated_entity_type: "driver",
                    comment: "Très professionnelle et ponctuelle. Je recommande vivement pour les voyages d'affaires.",
                    created_at: "25/07/2024",
                    updated_at: "09h15",
                    note: 5,
                    likes_count: 18,
                    dislikes_count: 1,
                    reviewer_name: "Laura",
                },
            ],
            driver_availability_table: [
                {
                    driver_availability_id: "1",
                    is_available: true,
                    start_date: "2024-06-28",
                    end_date: "2024-06-28",
                    start_time: "08:00",
                    end_time: "18:00",
                    price: 1000,
                    driver_billing_method_name: "daily",
                    is_interval:false
                },
                {
                    driver_availability_id: "2",
                    is_available: true,
                    start_date: "2024-06-29",
                    end_date: "2024-06-29",
                    start_time: "08:00",
                    end_time: "18:00",
                    price: 10000,
                    driver_billing_method_name: "daily",
                    is_interval:false
                },
                {
                    driver_availability_id: "3",
                    is_available: true,
                    start_date: "2024-06-30",
                    end_date: "2024-07-01",
                    start_time: "12:00",
                    end_time: "02:00",
                    price: 1500,
                    driver_billing_method_name: "flat_rate",
                    is_interval:true

                },
                {
                    driver_availability_id: "4",
                    is_available: true,
                    start_date: "2024-07-01",
                    end_date: "2024-07-01",
                    start_time: "08:00",
                    end_time: "18:00",
                    price: 2000,
                    driver_billing_method_name: "daily",
                    is_interval:true
                }
            ],
            transmission_types: ["Automatic", "Manual"],
            preferred_language: ["French", "English", "German"],
            driver_certifications: ["Certification conduite VIP", "Formation sécurité personnelle", "Premiers secours avancés"],
        },
        vehicleData: {
            vehicleId: 'veh-7531-9753-1597',
            illustration_images: [
                { url: '/img/devantVoiture.png', alt: 'Photo 1' },
                { url: '/img/derriereVoiture.png', alt: 'Photo 2' },
                { url: '/img/latteralVoiture.png', alt: 'Photo 3' },
                { url: '/img/InterieurVoiture.png', alt: 'Photo 4' },
            ],
            can_transport: ['Bagages de luxe', 'Équipement professionnel', 'Animaux de petite taille'],
            vehicle_amenities: ['Soft', 'screen','wifi','Toll charge'],
            model_name: 'S-Class',
            transmission_type_name: 'Automatic',
            make_name: 'Mercedes-Benz',
            type_name: 'Berline de luxe',
            size_name: 'Grande',
            fuel_type_name: 'Diesel',
            manufacturer_name: 'Mercedes-Benz',
            registration_number: 'LX 789 ZY',
            vehicle_serial_number: 'WDDUG8FB8MA456789',
            tank_capacity: 70,
            luggage_max_capacity: 530,
            total_seat_number: 5,
            vehicle_age_at_start: 0,
            mileage_at_mileage_since_commissioning: 5000,
            average_fuel_consumption_per_kilometer: 6.5,
            vehicle_reviews: [
                {
                    review_id: "vrev-9876-5432-1098",
                    rated_entity_id: "vent-7654-3210-9876",
                    rated_entity_type: "vehicle",
                    comment: "Véhicule de luxe exceptionnel. Confort inégalé et équipements haut de gamme.",
                    created_at: "10/08/2024",
                    updated_at: "14h30",
                    note: 5,
                    likes_count: 27,
                    dislikes_count: 0,
                    reviewer_name: "Éric",
                },
                {
                    review_id: "vrev-2468-1357-9080",
                    rated_entity_id: "vent-1357-2468-8642",
                    rated_entity_type: "vehicle",
                    comment: "Une berline parfaite pour les déplacements professionnels. Silence et technologie au rendez-vous.",
                    created_at: "05/08/2024",
                    updated_at: "11h45",
                    note: 5,
                    likes_count: 22,
                    dislikes_count: 1,
                    reviewer_name: "Carine",
                }
            ],
        },
    },

    {
        driverData:{
            driver_id:"b21ccd75-5be8-4129-bd14-f4837b935fa3",
            driver_profile_image : "/img/chauffeur.png",
            driver_first_name : "4GI",
            driver_last_name:"Henri",
            driver_phone_number : "6********",
            driverLocation: "Melen Yaounde",
            driver_email : "fogangzacharieteneIgor40642gkhgkuhfkvfkjg@gmail.com",
            driver_keywords:["Enthusiast" ," Expert" , "Night Driving" , "Long distance" , "Permis B"],
            driver_languages :["English", "French"],
            driver_specialities:["Long distance", "Night driving"],
            Description:
                "Passionné de conduite et de mécanique, " +
                "Martin est un chauffeur expérimentéise qui " +
                "s'efforce de toujours offrir un service irréprochable à ses clients." +
                " Doté d'un excellent sens de l'orientation et d'une connaissance approfondie" +
                " des routes et des itinéraires, il est capable de naviguer avec aisance " +
                "dans les rues les plus encombrées. Son grand professionnalisme et sa courtoisie " +
                "font de lui un atout précieux pour toute entreprise de transport." +
                " Toujours à l'écoute des besoins de ses passagers, il fait preuve d'une " +
                "patience et d'une adaptabilité remarquables, quel que soit le type de trajet." +
                " Attentif à la sécurité, il veille scrupuleusement au respect des règles de la route. " +
                "En dehors de son travail, Martin est un amateur de sports mécaniques qui apprécie" +
                " de passer du temps avec sa famille et ses amis. Son enthousiasme et son " +
                "dévouement en font un employé apprécié de tous.",
            driver_license_number:"Axvdsvsdvv",
            driver_experiences:[
                {
                    driver_experience_id: '123e4567-e89b-12d3-a456-426614174000',
                    driver_id: '98765432-e89b-12d3-a456-426614174000',
                    start_date: '2013-09-01T00:00:00Z',
                    end_date: '2018-06-30T00:00:00Z',
                    description: 'Chauffeure pour une compagnie de taxis de luxe',
                    vehicle_models: ['Mercedes-Benz Classe S', 'BMW Série 7'],
                    transmission_types: ['Manuelle', 'Automatique'],
                    driving_skills: ['Conduite de luxe', 'Service client exceptionnel'],
                    experience_illustrations: ['/img/car-list-2.jpg', '/img/car-list-3.jpg'],
                    experience_references: ['/docs/reference1.pdf'],
                    created_at: '2023-01-01T12:00:00Z',
                    updated_at: '2023-06-15T09:30:00Z'
                },
                {
                    driver_experience_id: '987e6543-e21b-12d3-a456-426614174000',
                    driver_id: '98765432-e89b-12d3-a456-426614174000',
                    start_date: '2018-07-01T00:00:00Z',
                    end_date: null,
                    description: 'Chauffeure VIP indépendante',
                    vehicle_models: ['Rolls-Royce Phantom', 'Bentley Continental'],
                    transmission_types: ['Automatique'],
                    driving_skills: ['Conduite de luxe', 'Service client exceptionnel'],
                    experience_illustrations: ["/img/car-list-2.jpg", "/img/car-list-3.jpg"],
                    experience_references: ['/docs/reference2.pdf', '/docs/reference3.pdf'],
                    created_at: '2023-01-01T12:00:00Z',
                    updated_at: '2023-06-15T09:30:00Z'
                }
            ],
            driver_portfolio:[" 1990 Permis B à AUTO-ECOLE KASAP"],
            has_vehicle:true,
            driver_statistics:{
                review_total_number:0,
                average_rating:0,
            },
            driver_reviews:[
                {
                    review_id :"uuidv4()",
                    rated_entity_id :"uuidv4()",
                    rated_entity_type :"uuidv4()",
                    comment:
                        "Excellent vehicle ! This car was soft and comfortable. I would recommend it !",
                    created_at :"23/10/2024",
                    updated_at :"18h15",
                    note :3,
                    likes_count :3,
                    dislikes_count :4,
                    reviewer_name: "William",
                },
                {
                    review_id :"uuidv4()",
                    rated_entity_id :"uuidv4()",
                    rated_entity_type :"uuidv4()",
                    comment:
                        "Excellent vehicle ! This car was soft and comfortable. I would recommend it !",
                    created_at :"23/10/2024",
                    updated_at :"18h15",
                    note :3,
                    likes_count :3,
                    dislikes_count :4,
                    reviewer_name: "William",
                },
                {
                    review_id :"uuidv4()",
                    rated_entity_id :"uuidv4()",
                    rated_entity_type :"uuidv4()",
                    comment:
                        "Excellent vehicle ! This car was soft and comfortable. I would recommend it !",
                    created_at :"23/10/2024",
                    updated_at :"18h15",
                    note :3,
                    likes_count :3,
                    dislikes_count :4,
                    reviewer_name: "William",
                },
                {
                    review_id :"uuidv4()",
                    rated_entity_id :"uuidv4()",
                    rated_entity_type :"uuidv4()",
                    comment:
                        "Excellent vehicle ! This car was soft and comfortable. I would recommend it !",
                    created_at :"23/10/2024",
                    updated_at :"18h15",
                    note :3,
                    likes_count :3,
                    dislikes_count :4,
                    reviewer_name: "William",
                },
            ],
            driver_availability_table: [
                {
                    driver_availability_id: "1",
                    is_available: true,
                    start_date: "2024-06-28",
                    end_date: "2024-06-28",
                    start_time: "08:00",
                    end_time: "18:00",
                    price: 1000,
                    driver_billing_method_name: "daily",
                    is_interval:false
                },
                {
                    driver_availability_id: "2",
                    is_available: true,
                    start_date: "2024-06-29",
                    end_date: "2024-06-29",
                    start_time: "08:00",
                    end_time: "18:00",
                    price: 10000,
                    driver_billing_method_name: "daily",
                    is_interval:false
                },
                {
                    driver_availability_id: "3",
                    is_available: true,
                    start_date: "2024-06-30",
                    end_date: "2024-07-01",
                    start_time: "12:00",
                    end_time: "02:00",
                    price: 1500,
                    driver_billing_method_name: "flat_rate",
                    is_interval:true

                },
                {
                    driver_availability_id: "4",
                    is_available: true,
                    start_date: "2024-07-01",
                    end_date: "2024-07-01",
                    start_time: "08:00",
                    end_time: "18:00",
                    price: 2000,
                    driver_billing_method_name: "daily",
                    is_interval:true
                }
            ],
            transmission_types:["Manual 2WD", "Manual 4WD", "Automatic 2WD", "Automatic 4WD"],
            preferred_language:["English", "french","Deutsch"],
            driver_certifications:["Certified by driving school kassap"],


        },
        vehicleData:{
            vehicleId: 'b21ccd75-5be8-4129-bd14-f4837b935fa3',
            illustration_images: [
                { url: '/img/devantVoiture.png', alt: 'Photo 1' },
                { url: '/img/derriereVoiture.png', alt: 'Photo 2' },
                { url: '/img/latteralVoiture.png', alt: 'Photo 3' },
                { url: '/img/InterieurVoiture.png', alt: 'Photo 4' },
            ],
            can_transport: ['animals', 'Goods', 'Pets', 'fragile package'],
            vehicle_amenities: ['Car Parking','Alarm'],
            model_name: 'Corolla',
            transmission_type_name: 'Automatic 2WD',
            make_name: 'Toyota',
            type_name: 'personnal',
            size_name: 'Compact',
            fuel_type_name: 'Gasoline',
            manufacturer_name: 'Toyota',
            registration_number: 'AZS 8778',
            vehicle_serial_number: 'AZS87784',
            tank_capacity: 50,
            luggage_max_capacity: 400,
            total_seat_number: 5,
            vehicle_age_at_start: 2,
            mileage_at_mileage_since_commissioning:0,
            average_fuel_consumption_per_kilometer:1,
            vehicle_reviews:[

                {
                    review_id :"uuidv4()",
                    rated_entity_id :"uuidv4()",
                    rated_entity_type :"uuidv4()",
                    comment:
                        "Excellent vehicle ! This car was soft and comfortable. I would recommend it !",
                    created_at :"23/10/2024",
                    updated_at :"18h15",
                    note :3,
                    likes_count :3,
                    dislikes_count :4,
                    reviewer_name: "William",
                },
                {
                    review_id :"uuidv4()",
                    rated_entity_id :"uuidv4()",
                    rated_entity_type :"uuidv4()",
                    comment:
                        "Excellent vehicle ! This car was air-conditionned and comfortable. I would recommend it !",
                    created_at :"23/10/2024",
                    updated_at :"18h15",
                    note :3,
                    likes_count :3,
                    dislikes_count :4,
                    reviewer_name: "Zacharie",
                }
            ],
        },
    },


]
