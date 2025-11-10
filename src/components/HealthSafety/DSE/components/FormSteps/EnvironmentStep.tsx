import React from 'react';
import { FormStepProps } from '../../types';
import { TIPS } from '../../utils/constants';
import { YesNoQuestion } from './YesNoQuestion';

export function EnvironmentStep({ formData, setFormData }: FormStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Step 7: Environment
      </h3>
      <div className="space-y-6">
        <YesNoQuestion
          label="Is there enough room to change position and vary movement?"
          value={formData.room_change_position}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              room_change_position: value,
            }))
          }
          tip={TIPS.ROOM_CHANGE_POSITION}
        />
        
        <YesNoQuestion
          label="Is the lighting suitable?"
          value={formData.lighting_suitable}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              lighting_suitable: value,
            }))
          }
          tip={TIPS.LIGHTING}
        />
        
        <YesNoQuestion
          label="Are the levels of heat comfortable?"
          value={formData.heat_comfortable}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, heat_comfortable: value }))
          }
          tip={TIPS.HEAT}
        />
        
        <YesNoQuestion
          label="Are the levels of noise comfortable?"
          value={formData.noise_comfortable}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              noise_comfortable: value,
            }))
          }
          tip={TIPS.NOISE}
        />
      </div>
    </div>
  );
}
