import React from 'react';

export function ProviderCard({ provider }: { provider: any }) {
  const { number, basic, addresses, taxonomies, enumeration_date } = provider;
  const name = `${basic.first_name || ''} ${basic.last_name || basic.organization_name || ''}`.trim();
  const credentials = basic.credential || 'N/A';
  const specialty = taxonomies?.[0]?.desc || 'General Practice';
  
  const practiceAddress = addresses.find((a: any) => a.address_purpose === 'LOCATION') || addresses[0];
  const fullAddress = `${practiceAddress.address_1}${practiceAddress.address_2 ? `, ${practiceAddress.address_2}` : ''}, ${practiceAddress.city}, ${practiceAddress.state} ${practiceAddress.postal_code}`;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border-l-4 border-l-blue-600">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
              NPI: {number}
            </span>
            {basic.gender && (
              <span className="text-xs font-medium text-gray-400">
                {basic.gender === 'M' ? 'Male' : 'Female'}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{name}</h3>
          <p className="text-sm text-blue-600 font-semibold">{credentials}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xs text-gray-400 font-medium mb-1">Status: Active</div>
          <div className="text-sm font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
            {practiceAddress.state}
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-50">
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Primary Specialty</h4>
          <div className="flex items-center text-sm text-gray-700 font-medium">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            {specialty}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Practice Location</h4>
          <div className="flex items-start text-sm text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{fullAddress}</span>
          </div>
        </div>

        {enumeration_date && (
          <div className="pt-2">
            <p className="text-[10px] text-gray-400 italic">
              Registered since: {new Date(enumeration_date).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
