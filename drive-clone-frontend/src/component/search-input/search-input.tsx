import { TextField } from '@mui/material';
import styles from './search-input.module.scss';
import { useState } from 'react';

export interface SearchInputProps {
  sx: React.CSSProperties;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchInput(props: SearchInputProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value); 
    props.onChange(event);
  };
  
  return (
    <div className={styles['container']} style={props.sx}>
      <TextField id="standard-basic" 
      label="Search" 
      variant="standard" 
      value={searchValue}
      onChange={handleChange}/>
    </div>
  );
}

export default SearchInput;
