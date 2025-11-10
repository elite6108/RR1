import { CATEGORY_ICONS } from './constants';
import { Anvil } from 'lucide-react';
import type { Task } from '../types';

export const getCategoryIcon = (iconName: string) => {
  const iconData = CATEGORY_ICONS.find(icon => icon.name === iconName);
  return iconData ? iconData.icon : Anvil;
};

export const getFilteredIcons = (iconSearch: string) => {
  if (!iconSearch.trim()) return CATEGORY_ICONS;
  return CATEGORY_ICONS.filter(iconData =>
    iconData.name.toLowerCase().includes(iconSearch.toLowerCase())
  );
};

export const getViewTitle = (currentView: string, categories: any[], selectedCategory: string | null) => {
  switch (currentView) {
    case 'today': return 'Today';
    case 'next7days': return 'Next 7 Days';
    case 'category': 
      const category = categories.find(c => c.id === selectedCategory);
      return category ? category.name : 'Category';
    default: return 'Main Tasks';
  }
};

export const getTodayTaskCount = (tasks: Task[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return tasks.filter(task => {
    if (!task.due_date || task.completed) return false;
    const dueDate = new Date(task.due_date);
    return dueDate >= today && dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
  }).length;
};

export const getNext7DaysTaskCount = (tasks: Task[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const next7Days = new Date(today);
  next7Days.setDate(today.getDate() + 7);
  return tasks.filter(task => {
    if (!task.due_date || task.completed) return false;
    const dueDate = new Date(task.due_date);
    return dueDate >= today && dueDate <= next7Days;
  }).length;
};

export const getFilteredTasks = (tasks: Task[], currentView: string, selectedCategory: string | null) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const next7Days = new Date(today);
  next7Days.setDate(today.getDate() + 7);

  let filtered = tasks;

  switch (currentView) {
    case 'today':
      filtered = tasks.filter(task => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate >= today && dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      });
      break;
    case 'next7days':
      filtered = tasks.filter(task => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate >= today && dueDate <= next7Days;
      });
      break;
    case 'category':
      if (selectedCategory) {
        filtered = tasks.filter(task => task.category === selectedCategory);
      }
      break;
    default: // inbox
      filtered = tasks;
  }

  return filtered;
};
