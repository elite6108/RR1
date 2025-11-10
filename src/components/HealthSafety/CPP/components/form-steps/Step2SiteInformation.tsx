import React from 'react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step2SiteInformationProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

export function Step2SiteInformation({ data, onChange }: Step2SiteInformationProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      siteInformation: {
        ...data.siteInformation,
        [name]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Site Information</h3>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          value={data.siteInformation.address.line1}
          onChange={(e) => onChange({
            siteInformation: {
              ...data.siteInformation,
              address: {
                ...data.siteInformation.address,
                line1: e.target.value
              }
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="principalContractor" className="block text-sm font-medium text-gray-700 mb-2">
            Principal Contractor
          </label>
          <input
            type="text"
            id="principalContractor"
            name="principalContractor"
            value={data.siteInformation.principalContractor || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="principalContractorEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Principal Contractor Email
          </label>
          <input
            type="email"
            id="principalContractorEmail"
            name="principalContractorEmail"
            value={data.siteInformation.principalContractorEmail || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="principalContractorPhone" className="block text-sm font-medium text-gray-700 mb-2">
            Principal Contractor Phone
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              +44
            </span>
            <input
              type="tel"
              id="principalContractorPhone"
              name="principalContractorPhone"
              value={data.siteInformation.principalContractorPhone || ''}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="principalContractorCompany" className="block text-sm font-medium text-gray-700 mb-2">
            Principal Contractor Company
          </label>
          <input
            type="text"
            id="principalContractorCompany"
            name="principalContractorCompany"
            value={data.siteInformation.principalContractorCompany || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="principalDesigner" className="block text-sm font-medium text-gray-700 mb-2">
            Principal Designer
          </label>
          <input
            type="text"
            id="principalDesigner"
            name="principalDesigner"
            value={data.siteInformation.principalDesigner || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="principalDesignerEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Principal Designer Email
          </label>
          <input
            type="email"
            id="principalDesignerEmail"
            name="principalDesignerEmail"
            value={data.siteInformation.principalDesignerEmail || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="principalDesignerPhone" className="block text-sm font-medium text-gray-700 mb-2">
            Principal Designer Phone
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              +44
            </span>
            <input
              type="tel"
              id="principalDesignerPhone"
              name="principalDesignerPhone"
              value={data.siteInformation.principalDesignerPhone || ''}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="principalDesignerCompany" className="block text-sm font-medium text-gray-700 mb-2">
            Principal Designer Company
          </label>
          <input
            type="text"
            id="principalDesignerCompany"
            name="principalDesignerCompany"
            value={data.siteInformation.principalDesignerCompany || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="siteManager" className="block text-sm font-medium text-gray-700 mb-2">
            Site Manager
          </label>
          <input
            type="text"
            id="siteManager"
            name="siteManager"
            value={data.siteInformation.siteManager || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="siteManagerEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Site Manager Email
          </label>
          <input
            type="email"
            id="siteManagerEmail"
            name="siteManagerEmail"
            value={data.siteInformation.siteManagerEmail || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="siteManagerPhone" className="block text-sm font-medium text-gray-700 mb-2">
            Site Manager Phone
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              +44
            </span>
            <input
              type="tel"
              id="siteManagerPhone"
              name="siteManagerPhone"
              value={data.siteInformation.siteManagerPhone || ''}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}