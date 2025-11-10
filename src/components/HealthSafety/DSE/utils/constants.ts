import { ImageOption, DSEFormData, StepConfig, FormStep } from '../types';

export const KEYBOARD_POSTURE_IMAGES: ImageOption[] = [
  {
    id: 'Sitting upright, not stretching, not leaning',
    label: 'Sitting upright, not stretching, not leaning',
  },
  {
    id: 'Stretching to reach the keyboard',
    label: 'Stretching to reach the keyboard',
  },
  { 
    id: 'Leaning forward', 
    label: 'Leaning forward' 
  },
  { 
    id: 'Slouching', 
    label: 'Slouching' 
  },
];

export const MOUSE_POSITION_IMAGES: ImageOption[] = [
  {
    id: 'Mouse is next to the keyboard',
    label: 'Mouse is next to the keyboard',
  },
  {
    id: 'Mouse is away from the keyboard',
    label: 'Mouse is away from the keyboard',
  },
];

export const CHAIR_POSTURE_IMAGES: ImageOption[] = [
  {
    id: 'Sitting upright providing correct lumbar',
    label: 'Sitting upright providing correct lumbar',
  },
  { 
    id: 'Slouching', 
    label: 'Slouching' 
  },
  { 
    id: 'Leaning Forward', 
    label: 'Leaning Forward' 
  },
];

export const FORM_STEPS: StepConfig[] = [
  { id: 1, title: 'Step 1: Personal Information', label: 'Personal Details' },
  { id: 2, title: 'Step 2: Keyboard', label: 'Keyboard' },
  { id: 3, title: 'Step 3: Mouse', label: 'Mouse' },
  { id: 4, title: 'Step 4: Screens', label: 'Screen' },
  { id: 5, title: 'Step 5: Vision', label: 'Desk' },
  { id: 6, title: 'Step 6: Furniture', label: 'Chair' },
  { id: 7, title: 'Step 7: Environment', label: 'Environment' },
  { id: 8, title: 'Step 8: Your Feedback', label: 'Your Feedback' },
];

export const INITIAL_FORM_DATA: DSEFormData = {
  full_name: '',
  keyboard_separate_from_screen: null,
  keyboard_tilt_legs: null,
  keyboard_posture: '',
  keyboard_comfortable: null,
  keyboard_characters_clear: null,
  mouse_position: '',
  wrist_forearm_support: null,
  mouse_smooth_speed: null,
  screen_characters_clear: null,
  screen_text_size_comfortable: null,
  screen_brightness_contrast_suitable: null,
  screen_swivel_tilt: null,
  screen_free_glare: null,
  vision_straining: null,
  desk_large_enough: null,
  reach_files_comfortably: null,
  chair_posture: '',
  chair_castor_wheels: null,
  chair_height_adjustment: null,
  chair_depth_adjustment: null,
  chair_lumbar_support: null,
  chair_adjustable_backrest: null,
  chair_adjustable_armrests: null,
  chair_backrest_support: null,
  forearms_horizontal: null,
  feet_flat_floor: null,
  room_change_position: null,
  lighting_suitable: null,
  heat_comfortable: null,
  noise_comfortable: null,
  experienced_discomfort: null,
  interested_eye_test: null,
  regular_breaks: null,
  notes: '',
};

export const TIPS = {
  KEYBOARD_POSTURE: 'Try pushing the display screen further back to create more room for the keyboard, hands and wrists. Users of thick, raised keyboards may need a wrist rest.',
  KEYBOARD_COMFORTABLE: 'Hands bent up at the wrist. Do not hit the keys too hard. Do not overstretch the fingers.',
  KEYBOARD_CHARACTERS: 'The keyboard should be kept clean. If you cannot see the characters after cleaning, then it may be best to replace the keyboard.',
  WRIST_SUPPORT: 'Support can be gained from, for example, the desk surface or arm of a chair.',
  MOUSE_SPEED: 'If not, adjustments can be made on your computer to increase or decrease the speed.',
  SCREEN_TEXT_SIZE: 'Try using different screen colours to reduce flicker. If still persists, you may need to replace your screen.',
  SCREEN_BRIGHTNESS: 'If not, adjustments can be made on your screen itself to a combination suitable for your eyes.',
  SCREEN_SWIVEL: 'Screens need to be at eye level which encourages correct posture. If your screen does not swivel or tilt, a screen stand/mount can be purchased to raise, lower or tilt the screens.',
  SCREEN_GLARE: 'If you notice glare, you may need to adjust the angle of the monitor or adjust the position on your desk. Additionally anti-glare filters can be purchased to screens to improve visibility.',
  VISION_STRAINING: 'If so, you may need to increase the text size on your computer. Additionally, you may need to adjust your posture and screen position. If your still straining your eyesight, you may need to visit an optician. Under HSE laws, employees are entitled to have their eye test paid for.',
  DESK_SIZE: 'If not, create more room by moving printers, materials elsewhere. Tidy any paperwork and other clutter away.',
  REACH_FILES: 'Rearrange equipment, papers etc to bring frequently used things within easy reach. A document holder may be needed, positioned to minimise uncomfortable head and eye movements.',
  CHAIR_SUITABLE: 'The chair may need repairing or replacing if you are finding it uncomfortable.',
  CHAIR_POSTURE: 'The arms of chairs can stop the user getting close enough to use the equipment comfortably. Move any obstructions from under the desk.',
  CHAIR_WHEELS: 'HSE recommends office chairs should have a 5 point wheels.',
  CHAIR_HEIGHT: "It's crucial that the chair goes up and down, so you can set up at the correct working height. To judge this, look at where the arms fall in relation to the desk. Ideally, the forearms should be in line with the work surface (or just above), with a 90-degree angle in the elbows.",
  LUMBAR_SUPPORT: 'Reclining the backrest whilst not working forward (keying or writing) allows the backrest to take some of the weight of your upper body. This in turn reduces the pressure on discs and muscles.',
  ADJUSTABLE_BACKREST: 'Reclining the backrest whilst not working forward (keying or writing) allows the backrest to take some of the weight of your upper body. This in turn reduces the pressure on discs and muscles.',
  ADJUSTABLE_ARMRESTS: 'Supports the weight of your arms, removing the muscle work for shoulders and upper arms. Armrests can be of particular benefit for support when keying or mousing. However, if they are not adjustable they can cause problems when armrests hit the edges of tables, causing users to key/mouse with a straight arm or perch on the front of the chair receiving no back support.',
  BACKREST_SUPPORT: 'You should have a straight back, supported by the chair, with relaxed shoulders.',
  FOREARMS_HORIZONTAL: 'Adjust your chair height and screen accordingly.',
  FEET_FLAT: 'If not, a footrest may be needed for shorter operators.',
  ROOM_CHANGE_POSITION: 'Space is needed to move and stretch. Consider reorganising the office layout and check for obstructions. Cables should be tidy and not a trip or snag hazard.',
  LIGHTING: 'If you are finding lighting to bright or dark, consider using blinds or shading, changing light sources such as desk lamps or reposition your screen.',
  HEAT: 'Can heating be better controlled? More ventilation or air conditioning may be required if there is a lot of electronic equipment in the room.',
  NOISE: 'Consider moving sources of noise like printers, desk fans away from you.',
};

export const EYE_TEST_INFO = 'Under UK Law, employees using screens should be provided with an eye test funded by their employer. This should be a full eye examination and vision test. If glasses are needed solely for screen use, the employer is obliged to pay. If an ordinary prescription is suitable, employers do not have to pay for glasses.';

export const TOTAL_STEPS = 8;

// Utility functions
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const getNextDueDate = (): string => {
  return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year from now
};

export const getCurrentDate = (): string => {
  return new Date().toISOString();
};

export const getStepByNumber = (step: number): StepConfig | undefined => {
  return FORM_STEPS.find(s => s.id === step);
};

export const isValidStep = (step: number): step is FormStep => {
  return step >= 1 && step <= TOTAL_STEPS;
};

export const calculateProgress = (currentStep: number): number => {
  return (currentStep / TOTAL_STEPS) * 100;
};
