// Shared types for Vehicle Management system

export interface StaffMember {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  ni_number: string;
  start_date: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
}

export interface Worker {
  id: string;
  full_name: string;
  email: string;
  company: string;
  phone: string;
  driving_licence_number?: string;
}

export interface CombinedStaffUser {
  id: string;
  name: string;
  type: 'staff' | 'user' | 'worker';
  original_id: string;
  email: string;
  position?: string;
  company?: string;
  phone?: string;
}

export interface Driver {
  id: string;
  staff_id: number;
  licence_number: string;
  licence_expiry: string;
  user_id: string;
  full_name?: string;
  last_check?: string;
  points?: number;
}

export interface DriverWithStaff extends Driver {
  staff: {
    name: string;
  };
}

export interface Vehicle {
  id: string;
  registration: string;
  make?: string;
  model?: string;
  vin?: string;
  driver?: string;
  driver_id?: string;
  mot_date?: string;
  tax_date?: string;
  service_date?: string;
  insurance_date?: string;
  breakdown_date?: string;
  last_service_date?: string;
  has_congestion?: boolean;
  has_dartford?: boolean;
  has_clean_air?: boolean;
  ulez?: string;
  service_interval_value?: string;
  service_interval_unit?: string;
  notes?: string;
  user_id: string;
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'n/a';
  notes: string;
  image_url: string;
  signed_url?: string;
  temp_category?: 'inside' | 'outside';
}

export interface VehicleChecklist {
  id: string;
  vehicle_id: string;
  user_id: string;
  items: ChecklistItem[];
  notes?: string;
  created_by_name: string;
  driver_name: string;
  mileage: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  status: 'pass' | 'fail';
  check_date: string;
  created_at: string;
}

export interface Reminder {
  type: 'vehicle' | 'driver';
  title: string;
  date: Date;
  description: string;
  severity: 'warning' | 'danger';
}

// Form Props Interfaces
export interface DriverFormProps {
  onClose: () => void;
  onSuccess: () => void;
  availableStaff: StaffMember[];
  selectedStaff: StaffMember | null;
  driverToEdit?: Driver | null;
}

export interface DriversListProps {
  onBack: () => void;
  onDriverUpdate?: () => void;
}

export interface VehicleChecklistFormProps {
  vehicle: any; // Using any to match existing Vehicle type from database
  checklistToEdit?: VehicleChecklist | null;
  onClose: () => void;
  onSuccess: () => void;
}

export interface VehicleFormProps {
  onClose: () => void;
  onSuccess: () => void;
  vehicleToEdit?: any | null; // Using any to match existing Vehicle type from database
}

export interface HSVehiclesProps {
  onBack: () => void;
  onOverdueDriversChange?: (count: number) => void;
  onOverdueVehiclesChange?: (count: number) => void;
}

export interface HSVehicleChecklistsProps {
  onBack: () => void;
}

export interface InventoryItem {
  id: string;
  item_name: string;
  category: string;
  display_order: number;
  is_active: boolean;
  is_custom?: boolean;
  created_by_user_id?: string;
  created_at: string;
}

export interface InventoryItemCheck {
  id: string;
  inventory_id: string;
  item_id: string;
  is_present: boolean;
  condition_status: 'good' | 'damaged' | 'missing' | 'replaced';
  notes?: string;
  replacement_date?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleInventory {
  id: string;
  vehicle_id: string;
  user_id: string;
  checked_by: string;
  check_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  item_checks?: InventoryItemCheck[];
}

export interface HSVehicleInventoryProps {
  onBack: () => void;
}

export interface VehicleInventoryFormProps {
  vehicle: any;
  inventoryToEdit?: VehicleInventory | null;
  onClose: () => void;
  onSuccess: () => void;
}
