import React from 'react';
import { ModuleToggle } from '../ModuleToggle';
import { moduleDefinitions } from '../../utils/constants';
import type { ModulesTabProps } from '../../types';

export function ModulesTab({ modules, onModuleChange }: ModulesTabProps) {
  return (
    <div className="space-y-6">
      {moduleDefinitions.map((module) => (
        <ModuleToggle
          key={module.key}
          title={module.title}
          description={module.description}
          enabled={modules[module.key]}
          onToggle={() => onModuleChange(module.key, !modules[module.key])}
        />
      ))}
    </div>
  );
}