import React from 'react';
import { Pencil, QrCode as QrCodeIcon, Trash2 } from 'lucide-react';
import type { Site } from '../types';

interface SitesTableProps {
  sites: Site[];
  searchQuery: string;
  onEdit: (site: Site) => void;
  onDelete: (site: Site) => void;
  onDownloadQR: (site: Site) => void;
}

export function SitesTable({
  sites,
  searchQuery,
  onEdit,
  onDelete,
  onDownloadQR,
}: SitesTableProps) {
  const filteredSites = sites.filter((site) => {
    const query = searchQuery.toLowerCase();
    return (
      site.name?.toLowerCase().includes(query) ||
      site.address?.toLowerCase().includes(query) ||
      site.town?.toLowerCase().includes(query) ||
      site.county?.toLowerCase().includes(query) ||
      site.postcode?.toLowerCase().includes(query) ||
      site.site_manager?.toLowerCase().includes(query) ||
      site.phone?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Site Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Site Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSites.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    {searchQuery ? 'No sites match your search criteria' : 'No sites found for this project'}
                  </td>
                </tr>
              ) : (
                filteredSites.map((site) => (
                  <tr key={site.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {site.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {site.address}, {site.town}, {site.county}, {site.postcode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {site.site_manager}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {site.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(site.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(site);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownloadQR(site);
                        }}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-4"
                        title="Download QR Code"
                      >
                        <QrCodeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(site);
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="md:hidden">
        {filteredSites.length === 0 ? (
          <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No sites match your search criteria' : 'No sites found for this project'}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSites.map((site) => (
              <div key={site.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {site.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {site.address}, {site.town}, {site.county}, {site.postcode}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(site)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDownloadQR(site)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      title="Download QR Code"
                    >
                      <QrCodeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(site)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-500 dark:text-gray-400">Site Manager:</span>
                    <p className="text-gray-900 dark:text-white">{site.site_manager}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500 dark:text-gray-400">Phone:</span>
                    <p className="text-gray-900 dark:text-white">{site.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500 dark:text-gray-400">Created:</span>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(site.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
