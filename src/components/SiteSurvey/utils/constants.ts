// Form step constants
export enum FORM_STEPS {
  DETAILS = 1,
  SITE_ACCESS = 2,
  LAND = 3,
  WORK_REQUIRED = 4,
  COURT_FEATURES = 5,
  DRAWINGS_PLANS = 6,
  REVIEW = 7
}

export const STEP_LABELS = [
  'Details',
  'Site Access', 
  'Land',
  'Work Required',
  'Court Features',
  'Drawings & Plans',
  'Review'
];

export const TOTAL_STEPS = 7;

// Court features options
export const COURT_FEATURES = [
  'Glass walls',
  'Nets',
  'Customised Posts',
  'Canopies'
];

// File upload settings
export const FILE_UPLOAD_CONFIG = {
  IMAGES: {
    accept: 'image/*',
    maxSize: 10 * 1024 * 1024, // 10MB
    description: 'PNG, JPG, GIF up to 10MB'
  },
  VIDEOS: {
    accept: 'video/mp4,video/quicktime,video/x-msvideo,video/avi,video/*',
    maxSize: 350 * 1024 * 1024, // 350MB
    description: 'MP4, MOV, AVI up to 350MB (supports H.264, HEVC/H.265)'
  }
};

// Storage configuration
export const STORAGE_CONFIG = {
  BUCKET_NAME: 'site_survey_files',
  SIGNED_URL_EXPIRY: 60 * 60 * 24 * 7, // 7 days for new uploads
  LONG_TERM_EXPIRY: 60 * 60 * 24 * 30 // 30 days for saved items
};

// What3Words configuration
export const WHAT3WORDS_CONFIG = {
  DEFAULT_URL: 'https://what3words.com/pretty.needed.chill',
  IFRAME_HEIGHT: '70vh'
};

// Court specifications text
export const COURT_SPECIFICATIONS = {
  DIMENSIONS: `The regulation size of a padel court is set out by the International Padel Federation (FIP) who say that a padel court should be 'a rectangle 10 meters wide by 20 meters long'.
The 10m x 20m measurements refer to the internal playing area of the court within the surrounding enclosure. There is a 0.5% tolerance for padel courts so any court that falls within these sizes can be used for competitive use.`,

  HEIGHT: `A key consideration for any racket sport is the roof height needed to play. When it comes to padel the minimum height needed for a padel court is 6m according to the FIP. For any new facilities, the FIP recommend a clearance height of 8m to ensure play isn't interrupted by the ball hitting ceilings, fixtures and fittings such as court lights, or any other objects. Whilst there are minimum height requirements there is no maximum court height.`,

  ENCLOSURES: `Padel courts are completely enclosed by transparent or solid walls that are typically made from glass panels with metallic mesh fence, although other materials such as fiberglass, concrete or rendered blocks can be used.

Padel court walls play a key role in the game of padel, and they differentiate padel courts significantly from tennis courts.

As they surround the court, the walls are 10m long and 20m wide. To meet FIP requirements there are two possible options when it comes to the height of padel court walls.`,

  OPTION_1: `Option 1 is the most common type of padel court in the UK and uses stepped walls at each end of the court. The first 2m wide step at each end of the court is 3m high from the floor and the second 2m wide step is 2m high. These steps are typically made from glass panels but can be fiberglass, concrete, rendered bricks/blocks or other materials. Each step then has 1m of metallic mesh fence added to take the total height of the first step to 4m and the height of the second step to 3m. Where the two different parts of the wall meet it should be flush to avoid any irregular bounces. The remaining 12m length of the court (6m either side of the net) is made up of 3m high metallic mesh fence, with doors often located by the net on one or both sides of the court.`,

  OPTION_2: `Option 2 has the same stepped walls, but the metallic mesh fence is 2m high on the second step meaning both steps are 4m high. The 12m length of court in the middle uses 4m high metallic mesh fence, meaning the court enclosure is 4m high all the way round the court. As with option 1 the materials are the same and the two parts of the wall must be flush with neither material protruding to cause irregular bounces.`,

  FLOOR_MATERIALS: `Padel is normally played on either synthetic grass, porous cement/concrete, or carpet. All options are perfectly fine to play on, and some padel courts place sand on the court to provide better grip. The most important thing with padel court flooring is that it provides a consistent bounce, whilst outdoor courts also need to drain to avoid any water accumulating.

Padel courts are most commonly blue, but green and terracotta are also popular court colours. Black floor surfaces are allowed by the FIP for indoor courts but not outdoor courts. The full court surface should be the same colour and as we've already mentioned the court lines must contrast with the surface.`
};

// Utility functions
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
  return `${timestamp}_${cleanName}`;
};

export const getFilePathFromUrl = (url: string): string | null => {
  // Extract file path from signed URL
  const signedMatch = url.match(/\/storage\/v1\/object\/sign\/site_survey_files\/(.+)\?token/);
  if (signedMatch && signedMatch[1]) {
    return decodeURIComponent(signedMatch[1]);
  }

  // Extract file path from public URL
  const publicMatch = url.match(/\/storage\/v1\/object\/public\/site_survey_files\/(.+)/);
  if (publicMatch && publicMatch[1]) {
    return decodeURIComponent(publicMatch[1]);
  }

  return null;
};

// Input class names for consistent styling
export const INPUT_CLASS_NAME = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

export const DISABLED_INPUT_CLASS_NAME = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed";

// Button class names
export const BOOLEAN_BUTTON_ACTIVE = "px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white";
export const BOOLEAN_BUTTON_INACTIVE = "px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";

export const COURT_FEATURE_ACTIVE = "flex items-center justify-center p-3 rounded-md cursor-pointer bg-indigo-600 text-white";
export const COURT_FEATURE_INACTIVE = "flex items-center justify-center p-3 rounded-md cursor-pointer bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";