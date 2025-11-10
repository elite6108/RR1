import React from 'react';
import { FormStepProps } from '../../types';
import { TIPS } from '../../utils/constants';
import { YesNoQuestion } from './YesNoQuestion';

export function ScreenStep({ formData, setFormData }: FormStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Step 4: Screens
      </h3>
      <div className="space-y-6">
        <YesNoQuestion
          label="Are the characters clear and readable?"
          value={formData.screen_characters_clear}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              screen_characters_clear: value,
            }))
          }
        />
        
        <YesNoQuestion
          label="Is the text size comfortable to read?"
          value={formData.screen_text_size_comfortable}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              screen_text_size_comfortable: value,
            }))
          }
          tip={TIPS.SCREEN_TEXT_SIZE}
        />
        
        <YesNoQuestion
          label="Is the brightness and contrast on your screen suitable?"
          value={formData.screen_brightness_contrast_suitable}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              screen_brightness_contrast_suitable: value,
            }))
          }
          tip={TIPS.SCREEN_BRIGHTNESS}
        />
        
        <YesNoQuestion
          label="Does your screen swivel and tilt?"
          value={formData.screen_swivel_tilt}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              screen_swivel_tilt: value,
            }))
          }
          tip={TIPS.SCREEN_SWIVEL}
        />
        
        <YesNoQuestion
          label="Is the screen free from glare and reflections?"
          value={formData.screen_free_glare}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              screen_free_glare: value,
            }))
          }
          tip={TIPS.SCREEN_GLARE}
        />
      </div>
    </div>
  );
}
