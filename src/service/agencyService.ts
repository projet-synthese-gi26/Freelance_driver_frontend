import axios from 'axios';

export interface Agency {
  id: string;
  name: string;
  description: string;
  servicesOffered: string;
  foundationDate: string;
  rating: string;
  numberOfRides: string;
  status: 'published' | 'unpublished';
  resource_id: string;
  organization_id: string;
  category_id: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gateway.yowyob.com/resource-service';
const ORGANIZATION_ID = 'e347ceb0-18fa-11f0-9b3d-97e645ebbe47';
const CATEGORY_ID = '1549b370-317d-11f0-a5b5-bb7d33c83c13';

const mapResourceToAgency = (resource: any): Agency => ({
  id: resource.resource_id || '',
  name: resource.name || '',
  description: resource.long_description || '',
  servicesOffered: resource.short_description || '',
  foundationDate: resource.created_at?.split('T')[0] || '',
  rating: resource.iot_number || '0',
  numberOfRides: resource.available_quantity?.toString() || '0',
  status: (resource.state?.toLowerCase() === 'available') ? 'published' : 'unpublished',
  resource_id: resource.resource_id || '',
  organization_id: resource.organization_id || ORGANIZATION_ID,
  category_id: resource.category_id || CATEGORY_ID,
});

const mapAgencyToResource = (agency: Partial<Agency>): any => {
  return {
    name: agency.name || '',
    long_description: agency.description || '',
    short_description: agency.servicesOffered || '',
    iot_number: agency.rating || '0',
    available_quantity: parseInt(agency.numberOfRides || '0'),
    state: agency.status === 'published' ? 'AVAILABLE' : 'UNAVAILABLE',
    category_id: CATEGORY_ID,
    organization_id: ORGANIZATION_ID,
    product_type: 'TANGIBLE',
    accessibility: 'PUBLIC',
  };
};

export const agencyService = {
  getAgency: async (): Promise<Agency | null> => {
    try {
      const response = await axios.get(`${API_URL}/${ORGANIZATION_ID}/resources/search`, {
        params: {
          organization_id: ORGANIZATION_ID,
          category_id: CATEGORY_ID
        }
      });
      const resources = Array.isArray(response.data)
        ? response.data
        : (response.data as any)?.data || (response.data as any)?.items || [];
      if (!resources.length) return null;
      return mapResourceToAgency(resources[0]);
    } catch (error) {
      console.error('Error fetching agency:', error);
      return null;
    }
  },
};
