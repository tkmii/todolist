import type { FilterItemProps } from '../types/index';

function FilterItem({ state, text, isActive, onFilterChange }: FilterItemProps) {
  const handleClick = () => {
    onFilterChange(state);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-full cursor-pointer transition duration-300 ease-in-out hover:bg-indigo-500 hover:text-white ${
        isActive 
          ? 'bg-indigo-500 text-white' 
          : 'bg-gray-200 text-gray-700'
      }`}
      data-filter={state}
    >
      {text}
    </button>
  );
}

export default FilterItem;