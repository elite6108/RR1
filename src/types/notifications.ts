// A centralized place for all notification-related type definitions

export interface ActionPlanItem {
    id: string;
    item: string;
    next_due: string | null;
}

export interface CoshhAssessment {
    id: string;
    coshh_reference: string;
    review_date: string;
}

export interface RiskAssessment {
    id: string;
    ra_id: string;
    review_date: string;
}

export interface Vehicle {
    id: string;
    registration: string;
    mot_date: string | null;
    tax_date: string | null;
    insurance_date: string | null;
    breakdown_date: string | null;
    service_date: string | null;
}

export interface VehicleChecklist {
    id: string;
    check_date: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    vehicles: { registration: string } | null;
}

export interface Equipment {
    id: string;
    name: string;
}

export interface EquipmentChecklist {
    id: string;
    check_date: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    equipment: { name: string } | null;
}

export interface TrainingMatrixItem {
    id: string;
    name: string;
    training_records?: { training_name: string, expiry_date: string }[];
    certificates?: { certificate_name: string, date_expires: string }[];
    cards_tickets?: { card_name: string, date_expires: string }[];
}

export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: 'to_schedule' | 'booked_in' | 'over_due' | 'in_progress' | 'purchased' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    project_id: string | null;
    board_id: number;
    notes: string | null;
    tags: string[];
    staff_ids: number[];
    due_date: string | null;
    cost: number | null;
    created_at: string;
    updated_at: string;
    category: 'Quote' | 'Repair' | 'Aftersales' | 'Complaints' | 'Remedials' | 'Finance' | 'Insurance' | 'Tax' | 'Banking' | null;
}

export interface CalendarEvent {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    all_day: boolean;
    location?: string;
    notes?: string;
    calendar_id: string;
    assigned_to?: number[];
}

export interface FirstAidKit {
    id: string;
    user_id: string;
    name: string;
    location: string;
    description?: string;
    serial_number?: string;
    purchase_date?: string;
    expiry_date?: string;
    last_inspection_date?: string;
    next_inspection_date?: string;
    status: 'active' | 'needs_inspection' | 'expired' | 'out_of_service';
    created_at: string;
    updated_at: string;
}

export interface DismissedNotification {
    id: string;
    user_id: string;
    notification_type: string;
    notification_reference: string;
    dismissed_at: string;
}
