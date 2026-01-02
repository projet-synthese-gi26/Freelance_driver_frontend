import axios from 'axios';

export interface Order {
  id: string;
  profileUrl: string;
  name: string;
  location: string;
  availableSeats: number;
  price: number;
  date: string;
  time: string;
  paymentMethod: string;
  hasCar: boolean;
  status: string;
  email: string;
  phone: string;
  clientName: string;
  resource_id: string;
  organization_id: string;
  category_id: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gateway.yowyob.com/resource-service';
const ORGANIZATION_ID = 'e347ceb0-18fa-11f0-9b3d-97e645ebbe47';
const CATEGORY_ID = '4d2f1cd0-2467-11f0-a7e0-c929ab2c082a';

const mapResourceToOrder = (resource: any): Order => ({
  id: resource.resource_id,
  profileUrl: resource.qr_code || "",
  name: resource.name,
  location: resource.storage_condition || "",
  availableSeats: resource.available_quantity,
  price: resource.base_price,
  date: resource.expires_at?.split('T')[0] || "",
  time: resource.expires_at?.split('T')[1]?.split('.')[0] || "",
  paymentMethod: resource.sku_code || "Cash",
  hasCar: resource.is_tangible,
  status: (resource.state || 'AVAILABLE').toLowerCase(),
  email: resource.serial_number || "", 
  phone: resource.iot_number || "", 
  clientName: resource.name || "",
  resource_id: resource.resource_id,
  organization_id: resource.organization_id,
  category_id: resource.category_id,
});

export const orderService = {
  getAllOrders: async () => {
    const response = await axios.get(`${API_URL}/${ORGANIZATION_ID}/resources/search`, {
      params: {
        organization_id: ORGANIZATION_ID,
        category_id: CATEGORY_ID
      }
    });
    const resources = Array.isArray(response.data)
      ? response.data
      : (response.data as any)?.data || (response.data as any)?.items || [];
    return resources.map(mapResourceToOrder);
  },
};
