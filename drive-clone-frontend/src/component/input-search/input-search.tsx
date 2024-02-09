import { ChangeEvent, Dispatch, ReactElement, SetStateAction } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { debounce } from '../../utils/main/utils.ts';

interface InputSearchProperties {
  searchValue: string;
  searchSetter: Dispatch<SetStateAction<string>>;
}

export function InputSearch({ searchValue, searchSetter }: InputSearchProperties): ReactElement {
  /**
   * Handle search change
   * @param event
   */
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    searchSetter(value || '');
    const debouncedSearch = debounce(() => searchSetter(value || ''), 300);
    debouncedSearch();
    // debouncedRequest();
  };

  /**
   * Clear search bar
   */
  const clearSearchBar = () => {
    searchSetter('');
  };
  return (
      <div className='mb-7 flex items-center justify-center space-x-2'>
        <svg
          className='text-gray-500 -mr-10 z-10'
          width='20'
          height='20'
          viewBox='0 0 15 15'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z'
            fill='currentColor'
            fillRule='evenodd'
            clipRule='evenodd'
          ></path>
        </svg>

        <div className='inline-block'>
          <input
            autoComplete='on'
            value={searchValue}
            placeholder='Search'
            type='text'
            name='form-field-name'
            className='input input-bordered w-full max-w-xs pl-9'
            onChange={(event) => handleSearchChange(event)}
          />
        </div>
        {searchValue ? (
          <button style={{ marginLeft: '-24px' }} className='z-10' onClick={clearSearchBar}>
            <Cross1Icon className='w-5 h-5 text-red-500' />
          </button>
        ) : undefined}
      </div>
  );
}
