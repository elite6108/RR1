// County list for supplier address forms
export const COUNTY_LIST = [
  "Aberdeen", "Aberdeenshire", "Anglesey", "Angus", "Argyll and Bute", "Armagh",
  "Bath and North East Somerset", "Bedfordshire", "Belfast", "Berkshire", "Birmingham",
  "Blaenau Gwent", "Bradford", "Bridgend", "Brighton and Hove", "Bristol", "Buckinghamshire",
  "Canterbury", "Carlisle", "Caerphilly", "Cambridgeshire", "Cardiff", "Carmarthenshire",
  "Ceredigion", "Chelmsford", "Cheshire", "Chester", "Chichester", "Clackmannanshire",
  "Conwy", "Cornwall", "Coventry", "Cumbria", "Denbighshire", "Derbyshire", "Devon",
  "Dorset", "Dumfries and Galloway", "Dundee", "Durham", "East Ayrshire", "East Dunbartonshire",
  "East Lothian", "East Renfrewshire", "East Riding of Yorkshire", "East Sussex", "Edinburgh",
  "Essex", "Exeter", "Falkirk", "Fife", "Flintshire", "Glasgow", "Gloucestershire",
  "Greater London", "Greater Manchester", "Gwynedd", "Hampshire", "Herefordshire",
  "Hertfordshire", "Highlands", "Inverclyde", "Isle of Wight", "Kent", "Lancashire",
  "Leicestershire", "Lincolnshire", "Liverpool", "Londonderry", "Merseyside", "Merthyr Tydfil",
  "Midlothian", "Monmouthshire", "Moray", "Neath Port Talbot", "Newcastle upon Tyne",
  "Newport", "Newry", "Norfolk", "North Ayrshire", "North Lanarkshire", "North Yorkshire",
  "Northamptonshire", "Northumberland", "Nottinghamshire", "Orkney Islands", "Oxfordshire",
  "Pembrokeshire", "Perth and Kinross", "Powys", "Renfrewshire", "Rhondda Cynon Taff",
  "Rutland", "Salford", "Scottish Borders", "Shetland Islands", "Shropshire", "Somerset",
  "South Ayrshire", "South Lanarkshire", "South Yorkshire", "Staffordshire", "Stirling",
  "Sunderland", "Suffolk", "Surrey", "Swansea", "Torfaen", "Tyne and Wear", "Vale of Glamorgan",
  "Warwickshire", "West Dunbartonshire", "West Lothian", "West Midlands", "West Sussex",
  "West Yorkshire", "Western Isles", "Wiltshire", "Worcestershire", "Wrexham"
];

// CSS classes for consistent styling
export const INPUT_CLASS_NAME = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400";

export const BUTTON_PRIMARY = "w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export const BUTTON_SECONDARY = "w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600";

export const BUTTON_DANGER = "px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 dark:hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500";

// Form step labels
export const FORM_STEP_LABELS = ['Supplier Name', 'Address'];

// Utility functions
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const filterSuppliers = (suppliers: any[], searchQuery: string) => {
  const query = searchQuery.toLowerCase();
  return suppliers.filter((supplier) =>
    supplier.name?.toLowerCase().includes(query) ||
    supplier.email?.toLowerCase().includes(query) ||
    supplier.phone?.toLowerCase().includes(query) ||
    supplier.address_line1?.toLowerCase().includes(query) ||
    supplier.town?.toLowerCase().includes(query) ||
    supplier.post_code?.toLowerCase().includes(query)
  );
};