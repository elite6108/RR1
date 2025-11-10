import React from 'react';
import { FormStepProps } from '../../types';
import { TIPS } from '../../utils/constants';
import { YesNoQuestion } from './YesNoQuestion';

export function VisionStep({ formData, setFormData }: FormStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Step 5: Vision
      </h3>
      <div className="space-y-6">
        <YesNoQuestion
          label="Are you straining your vision to see and use the computer?"
          value={formData.vision_straining}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, vision_straining: value }))
          }
          tip={TIPS.VISION_STRAINING}
        />
      </div>
    </div>
  );
}
