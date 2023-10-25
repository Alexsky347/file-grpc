import styles from './select-c.module.scss';
import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export interface SelectCProps {
  onChangeSelect: (event: SelectChangeEvent) => void;
}

export function SelectC(props: SelectCProps) {
  const [selectValue, setSelectValue] = useState('name-ASC');

  const handleChange = (event: SelectChangeEvent) => {
    setSelectValue(event.target.value);
    props.onChangeSelect(event);
  };

  return (
    <div className={styles['container']}>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="select-sort-label">Sort</InputLabel>
        <Select
          labelId="select-label-id-sort-by"
          id="select-sort-by"
          value={selectValue}
          onChange={handleChange}
          autoWidth
          label="SortBy"
        >
          <MenuItem value={'name-ASC'}>Name ASC</MenuItem>
          <MenuItem value={'createdDate-ASC'}>Date ASC</MenuItem>
          <MenuItem value={'name-DESC'}>Name DESC</MenuItem>
          <MenuItem value={'createdDate-DESC'}>Date DESC</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default SelectC;
