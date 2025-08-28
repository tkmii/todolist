import FilterItem from './FilterItem';
import type { FilterType, FilterTabsProps } from '../types';



function FilterTabs({ onFilterChange, currentFilter }: FilterTabsProps) {
  const filters = [
    { state: 'all' as FilterType, text: 'Все' },
    { state: 'active' as FilterType, text: 'Активные' },
    { state: 'completed' as FilterType, text: 'Выполненные' }
  ];

  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {filters.map((filter) => (
        <FilterItem
          key={filter.state}
          state={filter.state}
          text={filter.text}
          isActive={currentFilter === filter.state}
          onFilterChange={onFilterChange}
        />
      ))}
    </div>
  );
}

export default FilterTabs;