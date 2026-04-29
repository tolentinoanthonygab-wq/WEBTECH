export type Role = 'super_admin' | 'owner' | 'staff' | 'customer';
export type CustomerStatus = 'Pending' | 'Approved' | 'Disapproved' | 'Inactive';
export type OrderStatus = 'Ongoing' | 'Done' | 'Cancelled';
export type PaymentStatus = 'Unpaid' | 'Paid';
export type PaymentMethod = 'Manual' | 'GCash';
export type EntityStatus = 'active' | 'inactive';
export type ServiceUnit = 'per_kg' | 'per_piece';

export interface AuthUser {
  user_id: string;
  user_name: string;
  first_name: string;
  email: string;
  role: Role;
  shop_id: string;
  shop_name: string;
  status: string;
}

export interface Customer {
  id: string;
  shop_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  contact_number: string;
  address: string;
  email: string;
  status: CustomerStatus;
  last_updated: string;
}

export interface Service {
  id: string;
  shop_id: string;
  service_name: string;
  unit: ServiceUnit;
  price_per_unit: number;
  category: string;
  status: EntityStatus;
}

export interface OrderItem {
  id?: string;
  service_id: string;
  service_name?: string;
  unit?: ServiceUnit;
  quantity_or_weight: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_ref: string;
  customer_id: string;
  shop_id: string;
  staff_id: string;
  first_name?: string;
  last_name?: string;
  contact_number?: string;
  address?: string;
  total_weight: number;
  total_amount: number;
  discount_amount: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  pickup_delivery_type: string;
  created_on: string;
  last_updated: string;
  items?: OrderItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
