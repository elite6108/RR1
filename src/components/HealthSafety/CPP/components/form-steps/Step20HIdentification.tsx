import React from 'react';
import { Check } from 'lucide-react';
import type { CPPFormData } from '../../../types/cpp';

interface Step20HIdentificationProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

export function Step20HIdentification({ data, onChange }: Step20HIdentificationProps) {
  const updateHazard = (hazard: keyof CPPFormData['hazardIdentification'], field: string, value: boolean) => {
    onChange({
      hazardIdentification: {
        ...data.hazardIdentification,
        [hazard]: {
          ...data.hazardIdentification?.[hazard],
          [field]: value
        }
      }
    });
  };

  const renderSubOptions = (
    hazard: keyof CPPFormData['hazardIdentification'],
    options: { field: string; label: string }[]
  ) => {
    if (!data.hazardIdentification?.[hazard]?.selected) return null;

    return (
      <div className="ml-8 mt-2 space-y-2">
        {options.map(({ field, label }) => (
          <button
            key={field}
            type="button"
            onClick={() => updateHazard(hazard, field, !data.hazardIdentification?.[hazard]?.[field])}
            className="flex items-center w-full p-2 rounded-md hover:bg-gray-50"
          >
            <div className={`
              flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3
              ${data.hazardIdentification?.[hazard]?.[field]
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300'
              }
            `}>
              {data.hazardIdentification?.[hazard]?.[field] && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Hazard Identification</h3>

      <div className="max-h-[400px] overflow-y-auto pr-4">
        <div className="space-y-4">
          {/* Working at Height */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => updateHazard('workingAtHeight', 'selected', !data.hazardIdentification?.workingAtHeight?.selected)}
              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center"
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3
                ${data.hazardIdentification?.workingAtHeight?.selected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'border-gray-300'
                }
              `}>
                {data.hazardIdentification?.workingAtHeight?.selected && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="font-medium">Working at height - This includes roof work, any work off a scaffold or out of a MEWP</span>
            </button>
            {renderSubOptions('workingAtHeight', [
              { field: 'fenceOff', label: 'Fence off underneath the work area' },
              { field: 'isolateHazard', label: 'Isolate the hazard using methods such as scaffolding, guarded work Platforms, mewps and edge protection' },
              { field: 'useCatchment', label: 'Use catchment methods such as netting to catch tools and debris' },
              { field: 'equipmentFitForPurpose', label: 'Working at height equipment must be fit for purpose and in good condition' },
              { field: 'useFallRestraint', label: 'Fall restraint equipment to be used eg harness' }
            ])}
          </div>

          {/* Scaffolding */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => updateHazard('scaffolding', 'selected', !data.hazardIdentification?.scaffolding?.selected)}
              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center"
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3
                ${data.hazardIdentification?.scaffolding?.selected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'border-gray-300'
                }
              `}>
                {data.hazardIdentification?.scaffolding?.selected && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="font-medium">Erecting or dismantling scaffolding (portable or fixed)</span>
            </button>
            {renderSubOptions('scaffolding', [
              { field: 'competentInstaller', label: 'To be installed and tagged by a competent installer' },
              { field: 'regularlyChecked', label: 'Regularly checked (weekly) as safe for use and current tag is on display' },
              { field: 'fitForPurpose', label: 'Ensure scaffold is fit for purpose eg correct load rating' }
            ])}
          </div>

          {/* MEWP */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => updateHazard('mewp', 'selected', !data.hazardIdentification?.mewp?.selected)}
              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center"
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3
                ${data.hazardIdentification?.mewp?.selected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'border-gray-300'
                }
              `}>
                {data.hazardIdentification?.mewp?.selected && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="font-medium">Using a mobile elevated working platform (MEWPs, man-cage, cherry picker)</span>
            </button>
            {renderSubOptions('mewp', [
              { field: 'certified', label: 'Ensure equipment is certified and fit for purpose' },
              { field: 'competentPerson', label: 'Must be operated by a competent person' },
              { field: 'preStartChecks', label: 'Daily pre-start checks to be done' },
              { field: 'useHarness', label: 'Use a harness when required' }
            ])}
          </div>

          {/* Demolition with Asbestos */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => updateHazard('demolitionAsbestos', 'selected', !data.hazardIdentification?.demolitionAsbestos?.selected)}
              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center"
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3
                ${data.hazardIdentification?.demolitionAsbestos?.selected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'border-gray-300'
                }
              `}>
                {data.hazardIdentification?.demolitionAsbestos?.selected && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="font-medium">Demolition Asbestos Survey required carried out by a qualified and competent surveyor</span>
            </button>
            {renderSubOptions('demolitionAsbestos', [
              { field: 'enclosures', label: 'Enclosures and negative pressure units are required for Licensed asbestos removal' },
              { field: 'managementPlan', label: 'An asbestos management plan that identifies all asbestos types and locations must be in place' },
              { field: 'controlPlan', label: 'An asbestos control plan has been prepared for the work and is attached to this CPP' },
              { field: 'certificates', label: 'All operatives must hold a certificate for specified class of asbestos work undertaken at the very least an Asbestos Awareness' },
              { field: 'airMonitoring', label: 'Air monitoring is required for licensed and non licensed asbestos removal control limit is .03 of a fibre per cubic centimetre of air' },
              { field: 'clearanceInspection', label: 'An independent clearance inspection is required where any asbestos fibres have or may have been released and a re-occupation certificate obtained' },
              { field: 'hseNotification', label: 'Ensure that HSE is notified at least 14 days prior to any licensed asbestos removal work and an online (HSE) notification of non licensed work must take place prior to work commencing' },
              { field: 'decontamination', label: 'Ensure site, equipment and ppe is decontaminated or disposed of correctly' },
              { field: 'deenergiseServices', label: 'Services to be de-energised' },
              { field: 'dampenArea', label: 'Dampen down or enclose work area to minimise dust' },
              { field: 'wasteDisposal', label: 'Removal of debris and waste to be disposed of following local council requirements' },
              { field: 'weatherConditions', label: 'Monitor adverse weather conditions' }
            ])}
          </div>

          {/* Demolition without Asbestos */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => updateHazard('demolitionNoAsbestos', 'selected', !data.hazardIdentification?.demolitionNoAsbestos?.selected)}
              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center"
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3
                ${data.hazardIdentification?.demolitionNoAsbestos?.selected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'border-gray-300'
                }
              `}>
                {data.hazardIdentification?.demolitionNoAsbestos?.selected && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="font-medium">Conducting any demolition works where asbestos is not present</span>
            </button>
            {renderSubOptions('demolitionNoAsbestos', [
              { field: 'deenergiseServices', label: 'Services to be de-energised' },
              { field: 'dampenArea', label: 'Dampen down or enclose work area to minimise dust' },
              { field: 'wasteDisposal', label: 'Removal of debris and waste to be disposed of following local council requirements' },
              { field: 'weatherConditions', label: 'Monitor adverse weather conditions' }
            ])}
          </div>

          {/* Excavations */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => updateHazard('excavations', 'selected', !data.hazardIdentification?.excavations?.selected)}
              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center"
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3
                ${data.hazardIdentification?.excavations?.selected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'border-gray-300'
                }
              `}>
                {data.hazardIdentification?.excavations?.selected && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="font-medium">Conducting excavations - This includes any work that may come in contact with overhead/underground utilities</span>
            </button>
            {renderSubOptions('excavations', [
              { field: 'coverHoles', label: 'Cover/fence/barricade holes' },
              { field: 'identifyServices', label: 'All services to be identified before work starts, implement lockout/tagout process to ensure safe isolation' },
              { field: 'useShoring', label: 'Use shoring for excavations greater than or equal to 1.5m or in unstable ground' },
              { field: 'keepClear', label: 'Keep other workers/visitors clear and stay visible to operator' },
              { field: 'regularServicing', label: 'Ensure regular equipment servicing' },
              { field: 'appropriateWeather', label: 'Dig in appropriate weather conditions' },
              { field: 'dailyInspection', label: 'Inspect the excavation daily before work starts or after any adverse weather conditions' }
            ])}
          </div>

          {/* Heavy Machinery */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => updateHazard('heavyMachinery', 'selected', !data.hazardIdentification?.heavyMachinery?.selected)}
              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center"
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3
                ${data.hazardIdentification?.heavyMachinery?.selected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'border-gray-300'
                }
              `}>
                {data.hazardIdentification?.heavyMachinery?.selected && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="font-medium">Using heavy machinery or cranes</span>
            </button>
            {renderSubOptions('heavyMachinery', [
              { field: 'turnOffAndLower', label: 'When not in use ensure all plant, machinery and equipment is turned off and lowered' },
              { field: 'keepClear', label: 'Keep clear of swing radius' },
              { field: 'lowerBucket', label: 'Bucket and attachments lowered before approach' },
              { field: 'stayVisible', label: 'Stay visible to operator' },
              { field: 'regularInspections', label: 'Regular inspections/servicing, daily pre-starts to be conducted' },
              { field: 'weightLimits', label: 'Do not exceed weight limits' },
              { field: 'equipmentRegister', label: 'A plant, machinery and equipment register must be up-to-date and available on site' }
            ])}
          </div>

          {/* Working with Concrete */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => updateHazard('concrete', 'selected', !data.hazardIdentification?.concrete?.selected)}
              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center"
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3
                ${data.hazardIdentification?.concrete?.selected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'border-gray-300'
                }
              `}>
                {data.hazardIdentification?.concrete?.selected && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="font-medium">Working with concrete</span>
            </button>
            {renderSubOptions('concrete', [
              { field: 'noWorkAbove', label: 'Do not work above reinforcing steel' },
              { field: 'capExposed', label: 'Cap all exposed reinforcing steel' },
              { field: 'eyewashFacilities', label: 'Eye wash facilities must be available on site' },
              { field: 'regularServicing', label: 'Ensure regular equipment servicing' },
              { field: 'hazardousRegister', label: 'Complete a hazardous substance register and attach to this CPP' },
              { field: 'msdsAvailable', label: 'Ensure Material safety data sheets (msds) are available on site' }
            ])}
          </div>

          {/* Hot Works */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => updateHazard('hotWorks', 'selected', !data.hazardIdentification?.hotWorks?.selected)}
              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center"
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3
                ${data.hazardIdentification?.hotWorks?.selected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'border-gray-300'
                }
              `}>
                {data.hazardIdentification?.hotWorks?.selected && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="font-medium">Carrying out any hot works (welding, brazing)</span>
            </button>
            {renderSubOptions('hotWorks', [
              { field: 'clearArea', label: 'Clear area of all combustible materials' },
              { field: 'secureGasBottles', label: 'Secure all gas bottles' },
              { field: 'fireExtinguisher', label: 'Clean water and fire extinguisher must be available at all times' },
              { field: 'permitRequired', label: 'A permit to work process is required' }
            ])}
          </div>

          {/* Temporary Supports */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => updateHazard('temporarySupports', 'selected', !data.hazardIdentification?.temporarySupports?.selected)}
              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center"
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3
                ${data.hazardIdentification?.temporarySupports?.selected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'border-gray-300'
                }
              `}>
                {data.hazardIdentification?.temporarySupports?.selected && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="font-medium">Using temporary supports (Acrow props)</span>
            </button>
            {renderSubOptions('temporarySupports', [
              { field: 'approvedProps', label: 'Use approved props installed to engineer\'s design' },
              { field: 'goodCondition', label: 'Ensure props are in good condition' }
            ])}
          </div>

          {/* Handling Glass */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => updateHazard('handlingGlass', 'selected', !data.hazardIdentification?.handlingGlass?.selected)}
              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center"
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3
                ${data.hazardIdentification?.handlingGlass?.selected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'border-gray-300'
                }
              `}>
                {data.hazardIdentification?.handlingGlass?.selected && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="font-medium">Handling glass</span>
            </button>
            {renderSubOptions('handlingGlass', [
              { field: 'keepClear', label: 'All visitors and other workers to keep clear' },
              { field: 'noWorkUnderneath', label: 'Do not work underneath where glass is being installed' },
              { field: 'correctDisposal', label: 'Glass to be disposed of correctly' },
              { field: 'immediateCleanup', label: 'All broken glass to be cleaned up immediately' }
            ])}
          </div>

          {/* Hazardous Substances */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => updateHazard('hazardousSubstances', 'selected', !data.hazardIdentification?.hazardousSubstances?.selected)}
              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center"
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3
                ${data.hazardIdentification?.hazardousSubstances?.selected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'border-gray-300'
                }
              `}>
                {data.hazardIdentification?.hazardousSubstances?.selected && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="font-medium">Hazardous Substances</span>
            </button>
            {renderSubOptions('hazardousSubstances', [
              { field: 'correctStorage', label: 'Ensure correct storage, handling and disposal' },
              { field: 'licensedHandlers', label: 'Ensure licensed handlers for prescribed types and quantities' },
              { field: 'coshhAssessment', label: 'Complete a task specific COSHH assessment and attach to this CPP' },
              { field: 'sdsAvailable', label: 'Ensure safety data sheets (sds) available on site and are followed' }
            ])}
          </div>

          {/* Cramped Conditions */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => updateHazard('crampedConditions', 'selected', !data.hazardIdentification?.crampedConditions?.selected)}
              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center"
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3
                ${data.hazardIdentification?.crampedConditions?.selected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'border-gray-300'
                }
              `}>
                {data.hazardIdentification?.crampedConditions?.selected && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="font-medium">Working in cramped conditions (underfloor, roof spaces)</span>
            </button>
            {renderSubOptions('crampedConditions', [
              { field: 'comfortableExit', label: 'Do not enter areas not large enough to comfortably exit' },
              { field: 'standbyPerson', label: 'Use a standby person' },
              { field: 'ventilationLighting', label: 'Ensure sufficient ventilation and lighting' }
            ])}
          </div>

          {/* Confined Space */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => updateHazard('confinedSpace', 'selected', !data.hazardIdentification?.confinedSpace?.selected)}
              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center"
            >
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-3
                ${data.hazardIdentification?.confinedSpace?.selected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'border-gray-300'
                }
              `}>
                {data.hazardIdentification?.confinedSpace?.selected && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="font-medium">Conducting any confined space work - A confined space is an enclosed or partially enclosed space, not intended for primary human occupancy. It is generally not a ceiling space or underfloor space (restricted space)</span>
            </button>
            {renderSubOptions('confinedSpace', [
              { field: 'authorizedOnly', label: 'Do not enter a confined space unless authorised to do so' },
              { field: 'testingAndPermit', label: 'Atmospheric testing/monitoring and entry permit in place' },
              { field: 'responseplan', label: 'High risk response plan to be put in place before works commence' }
            ])}
          </div>
        </div>
      </div>
    </div>
  );
}