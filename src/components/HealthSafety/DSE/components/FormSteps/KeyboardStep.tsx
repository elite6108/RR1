import React from 'react';
import { FormStepProps } from '../../types';
import { KEYBOARD_POSTURE_IMAGES, TIPS } from '../../utils/constants';
import { YesNoQuestion } from './YesNoQuestion';
import { ImageSelection } from './ImageSelection';

export function KeyboardStep({ formData, setFormData }: FormStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Step 2: Keyboard
      </h3>
      <div className="space-y-6">
        <YesNoQuestion
          label="Is the keyboard separate from the screen?"
          value={formData.keyboard_separate_from_screen}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              keyboard_separate_from_screen: value,
            }))
          }
        />
        
        <YesNoQuestion
          label="Does the keyboard tilt or have legs to tilt?"
          value={formData.keyboard_tilt_legs}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              keyboard_tilt_legs: value,
            }))
          }
        />
        
        <ImageSelection
          label="Which of the following images best describes your posture?"
          images={KEYBOARD_POSTURE_IMAGES}
          selectedImage={formData.keyboard_posture}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, keyboard_posture: value }))
          }
          tip={TIPS.KEYBOARD_POSTURE}
        />
        
        <YesNoQuestion
          label="Is it comfortable for you to use the keyboard?"
          value={formData.keyboard_comfortable}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              keyboard_comfortable: value,
            }))
          }
          tip={TIPS.KEYBOARD_COMFORTABLE}
        />
        
        <YesNoQuestion
          label="Are the characters on the keyboard clear to read?"
          value={formData.keyboard_characters_clear}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              keyboard_characters_clear: value,
            }))
          }
          tip={TIPS.KEYBOARD_CHARACTERS}
        />
      </div>
    </div>
  );
}
