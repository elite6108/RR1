import React from 'react';
import { FormStepProps } from '../../types';
import { CHAIR_POSTURE_IMAGES, TIPS } from '../../utils/constants';
import { YesNoQuestion } from './YesNoQuestion';
import { ImageSelection } from './ImageSelection';

export function FurnitureStep({ formData, setFormData }: FormStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Step 6: Furniture
      </h3>
      <div className="space-y-6">
        <YesNoQuestion
          label="Is your desk large enough for your tasks?"
          value={formData.desk_large_enough}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              desk_large_enough: value,
            }))
          }
          tip={TIPS.DESK_SIZE}
        />
        
        <YesNoQuestion
          label="Can you reach all the files, trays on your desk comfortably?"
          value={formData.reach_files_comfortably}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              reach_files_comfortably: value,
            }))
          }
          tip={TIPS.REACH_FILES}
        />
        
        <ImageSelection
          label="From the following images, which describes your posture on the chair?"
          images={CHAIR_POSTURE_IMAGES}
          selectedImage={formData.chair_posture}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, chair_posture: value }))
          }
          tip={TIPS.CHAIR_POSTURE}
        />
        
        <YesNoQuestion
          label="Does your chair have castor wheels?"
          value={formData.chair_castor_wheels}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              chair_castor_wheels: value,
            }))
          }
          tip={TIPS.CHAIR_WHEELS}
        />
        
        <YesNoQuestion
          label="Does your chair have height adjustment?"
          value={formData.chair_height_adjustment}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              chair_height_adjustment: value,
            }))
          }
          tip={TIPS.CHAIR_HEIGHT}
        />
        
        <YesNoQuestion
          label="Does your chair have depth adjustment?"
          value={formData.chair_depth_adjustment}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              chair_depth_adjustment: value,
            }))
          }
        />
        
        <YesNoQuestion
          label="Does your chair have lumbar support?"
          value={formData.chair_lumbar_support}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              chair_lumbar_support: value,
            }))
          }
          tip={TIPS.LUMBAR_SUPPORT}
        />
        
        <YesNoQuestion
          label="Does your chair have adjustable backrest?"
          value={formData.chair_adjustable_backrest}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              chair_adjustable_backrest: value,
            }))
          }
          tip={TIPS.ADJUSTABLE_BACKREST}
        />
        
        <YesNoQuestion
          label="Does your chair have adjustable or padded armrests?"
          value={formData.chair_adjustable_armrests}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              chair_adjustable_armrests: value,
            }))
          }
          tip={TIPS.ADJUSTABLE_ARMRESTS}
        />
        
        <YesNoQuestion
          label="Do you find the chair backrest support your lower back?"
          value={formData.chair_backrest_support}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              chair_backrest_support: value,
            }))
          }
          tip={TIPS.BACKREST_SUPPORT}
        />
        
        <YesNoQuestion
          label="Do you find your forearms are horizontal and eyes at roughly the same height as the top of the screen?"
          value={formData.forearms_horizontal}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              forearms_horizontal: value,
            }))
          }
          tip={TIPS.FOREARMS_HORIZONTAL}
        />
        
        <YesNoQuestion
          label="Are your feet flat on the floor without too much pressure from the seat?"
          value={formData.feet_flat_floor}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, feet_flat_floor: value }))
          }
          tip={TIPS.FEET_FLAT}
        />
      </div>
    </div>
  );
}
