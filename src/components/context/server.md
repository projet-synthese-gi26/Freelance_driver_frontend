### User personnal info ###
  userId: string;
  country:string;
  nationality:string;
  first_name: string;
  last_name: string;
  friendly_name: string;
  email: string;
  phoneNumber: string;
  address: string;
  billing address: string[];
  role: string; --customer,driver,administrator
  sex: string;
  birthday: string;
  registration date: string;
  language: string;
  userPictureUrl: string; --photo de profil
  avatarUrl:string;

### Driver info ####
  driver_id:string;
  driver_agency_id:string,
  user_id:string;
  first_name:string,
  last_name:string,
  friendly_name:string,--userName–
  date_of_birth:string,
  driver_plan:string,
  profile_photo_portrait_with_vehicle_immatrucation:string; --photo url
  driver_profile_image string, -- blob or link
  driver_images string[], -- blobs or links to différent picture
  driver_email string,
  driver_phone_number string,
  driver_license_number string, -- 
  driver_license_photo string, -- blob or link
  driver_keywords string[],
  driver_amenities string[],
  driver_experiences string[],
  driver_portfolio string,