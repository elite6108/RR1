import React from 'react';
import { FormStepProps } from '../../types';
import { MOUSE_POSITION_IMAGES, TIPS } from '../../utils/constants';
import { YesNoQuestion } from './YesNoQuestion';
import { ImageSelection } from './ImageSelection';

export function MouseStep({ formData, setFormData }: FormStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Step 3: Mouse</h3>
      <div className="space-y-6">
        <ImageSelection
          label="Which of the following images best describes your mouse position?"
          images={MOUSE_POSITION_IMAGES}
          selectedImage={formData.mouse_position}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, mouse_position: value }))
          }
        />
        
        <YesNoQuestion
          label="Are you using any wrist or forearm support pads?"
          value={formData.wrist_forearm_support}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              wrist_forearm_support: value,
            }))
          }
          tip={TIPS.WRIST_SUPPORT}
        />
        
        <YesNoQuestion
          label="Does the mouse work smoothly at a speed that suits you?"
          value={formData.mouse_smooth_speed}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              mouse_smooth_speed: value,
            }))
          }
          tip={TIPS.MOUSE_SPEED}
        />
      </div>
    </div>
  );
}
