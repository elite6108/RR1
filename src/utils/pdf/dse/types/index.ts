export interface DSEAssessment {
  id: string;
  full_name: string;
  submitted_date: string;
  next_due_date: string;
  user_id: string;
  keyboard_separate_from_screen: boolean;
  keyboard_tilt_legs: boolean;
  keyboard_posture: string;
  keyboard_comfortable: boolean;
  keyboard_characters_clear: boolean;
  mouse_position: string;
  wrist_forearm_support: boolean;
  mouse_smooth_speed: boolean;
  screen_characters_clear: boolean;
  screen_text_size_comfortable: boolean;
  screen_brightness_contrast_suitable: boolean;
  screen_swivel_tilt: boolean;
  screen_free_glare: boolean;
  vision_straining: boolean;
  desk_large_enough: boolean;
  reach_files_comfortably: boolean;
  chair_posture: string;
  chair_castor_wheels: boolean;
  chair_height_adjustment: boolean;
  chair_depth_adjustment: boolean;
  chair_lumbar_support: boolean;
  chair_adjustable_backrest: boolean;
  chair_adjustable_armrests: boolean;
  chair_backrest_support: boolean;
  forearms_horizontal: boolean;
  feet_flat_floor: boolean;
  room_change_position: boolean;
  lighting_suitable: boolean;
  heat_comfortable: boolean;
  noise_comfortable: boolean;
  experienced_discomfort: boolean;
  interested_eye_test: boolean;
  regular_breaks: boolean;
  notes: string;
}

export interface CompanySettings {
  id?: string;
  logo_url?: string;
  company_number?: string;
  vat_number?: string;
  [key: string]: any;
}

export interface PDFTheme {
  themeColor: string;
  headerColor: string;
  cellBackgroundColor: string;
  detailsHeaderColor: string;
  borderColor: [number, number, number];
}

export interface PDFDimensions {
  pageWidth: number;
  leftColumnX: number;
  rightColumnX: number;
  boxWidth: number;
}
