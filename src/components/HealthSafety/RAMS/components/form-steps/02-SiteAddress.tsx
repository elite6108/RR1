import React from 'react';
import type { RAMSFormData } from '../../../../../types/rams';

interface SiteAddressProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

export function SiteAddress({ data, onChange }: SiteAddressProps) {
  const handleChange =
    (field: keyof RAMSFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ [field]: e.target.value });
    };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Site Address</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="address_line1"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            1st Line *
          </label>
          <input
            type="text"
            id="address_line1"
            value={data.address_line1}
            onChange={handleChange('address_line1')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="address_line2"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            2nd Line <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            id="address_line2"
            value={data.address_line2}
            onChange={handleChange('address_line2')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="address_line3"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            3rd Line <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            id="address_line3"
            value={data.address_line3}
            onChange={handleChange('address_line3')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="site_town"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Town *
          </label>
          <input
            type="text"
            id="site_town"
            value={data.site_town}
            onChange={handleChange('site_town')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="site_county"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            County *
          </label>
          <select
            id="site_county"
            value={data.site_county}
            onChange={(e) => handleChange('site_county')(e as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a county</option>
            <option value="Aberdeen">Aberdeen</option>
            <option value="Aberdeenshire">Aberdeenshire</option>
            <option value="Anglesey">Anglesey</option>
            <option value="Angus">Angus</option>
            <option value="Argyll and Bute">Argyll and Bute</option>
            <option value="Armagh">Armagh</option>
            <option value="Bath and North East Somerset">Bath and North East Somerset</option>
            <option value="Bedfordshire">Bedfordshire</option>
            <option value="Belfast">Belfast</option>
            <option value="Berkshire">Berkshire</option>
            <option value="Birmingham">Birmingham</option>
            <option value="Blaenau Gwent">Blaenau Gwent</option>
            <option value="Bradford">Bradford</option>
            <option value="Bridgend">Bridgend</option>
            <option value="Brighton and Hove">Brighton and Hove</option>
            <option value="Bristol">Bristol</option>
            <option value="Buckinghamshire">Buckinghamshire</option>
            <option value="Cambridgeshire">Cambridgeshire</option>
            <option value="Cardiff">Cardiff</option>
            <option value="Carmarthenshire">Carmarthenshire</option>
            <option value="Ceredigion">Ceredigion</option>
            <option value="Cheshire">Cheshire</option>
            <option value="Clackmannanshire">Clackmannanshire</option>
            <option value="Conwy">Conwy</option>
            <option value="Cornwall">Cornwall</option>
            <option value="Cumbria">Cumbria</option>
            <option value="Denbighshire">Denbighshire</option>
            <option value="Derbyshire">Derbyshire</option>
            <option value="Devon">Devon</option>
            <option value="Dorset">Dorset</option>
            <option value="Dumfries and Galloway">Dumfries and Galloway</option>
            <option value="Dundee">Dundee</option>
            <option value="Durham">Durham</option>
            <option value="East Ayrshire">East Ayrshire</option>
            <option value="East Dunbartonshire">East Dunbartonshire</option>
            <option value="East Lothian">East Lothian</option>
            <option value="East Renfrewshire">East Renfrewshire</option>
            <option value="East Riding of Yorkshire">East Riding of Yorkshire</option>
            <option value="East Sussex">East Sussex</option>
            <option value="Edinburgh">Edinburgh</option>
            <option value="Essex">Essex</option>
            <option value="Fife">Fife</option>
            <option value="Flintshire">Flintshire</option>
            <option value="Glasgow">Glasgow</option>
            <option value="Gloucestershire">Gloucestershire</option>
            <option value="Greater London">Greater London</option>
            <option value="Greater Manchester">Greater Manchester</option>
            <option value="Gwynedd">Gwynedd</option>
            <option value="Hampshire">Hampshire</option>
            <option value="Herefordshire">Herefordshire</option>
            <option value="Hertfordshire">Hertfordshire</option>
            <option value="Highlands">Highlands</option>
            <option value="Isle of Wight">Isle of Wight</option>
            <option value="Kent">Kent</option>
            <option value="Lancashire">Lancashire</option>
            <option value="Leicestershire">Leicestershire</option>
            <option value="Lincolnshire">Lincolnshire</option>
            <option value="Liverpool">Liverpool</option>
            <option value="Merseyside">Merseyside</option>
            <option value="Merthyr Tydfil">Merthyr Tydfil</option>
            <option value="Midlothian">Midlothian</option>
            <option value="Monmouthshire">Monmouthshire</option>
            <option value="Moray">Moray</option>
            <option value="Norfolk">Norfolk</option>
            <option value="North Yorkshire">North Yorkshire</option>
            <option value="Northamptonshire">Northamptonshire</option>
            <option value="Northumberland">Northumberland</option>
            <option value="Nottinghamshire">Nottinghamshire</option>
            <option value="Orkney Islands">Orkney Islands</option>
            <option value="Oxfordshire">Oxfordshire</option>
            <option value="Pembrokeshire">Pembrokeshire</option>
            <option value="Perth and Kinross">Perth and Kinross</option>
            <option value="Powys">Powys</option>
            <option value="Renfrewshire">Renfrewshire</option>
            <option value="Rhondda Cynon Taff">Rhondda Cynon Taff</option>
            <option value="Rutland">Rutland</option>
            <option value="Scottish Borders">Scottish Borders</option>
            <option value="Shetland Islands">Shetland Islands</option>
            <option value="Shropshire">Shropshire</option>
            <option value="Somerset">Somerset</option>
            <option value="South Yorkshire">South Yorkshire</option>
            <option value="Staffordshire">Staffordshire</option>
            <option value="Stirling">Stirling</option>
            <option value="Suffolk">Suffolk</option>
            <option value="Surrey">Surrey</option>
            <option value="Swansea">Swansea</option>
            <option value="Torfaen">Torfaen</option>
            <option value="Tyne and Wear">Tyne and Wear</option>
            <option value="Vale of Glamorgan">Vale of Glamorgan</option>
            <option value="Warwickshire">Warwickshire</option>
            <option value="West Dunbartonshire">West Dunbartonshire</option>
            <option value="West Lothian">West Lothian</option>
            <option value="West Midlands">West Midlands</option>
            <option value="West Sussex">West Sussex</option>
            <option value="West Yorkshire">West Yorkshire</option>
            <option value="Western Isles">Western Isles</option>
            <option value="Wiltshire">Wiltshire</option>
            <option value="Worcestershire">Worcestershire</option>
            <option value="Wrexham">Wrexham</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="post_code"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Postcode *
          </label>
          <input
            type="text"
            id="post_code"
            value={data.post_code}
            onChange={handleChange('post_code')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
