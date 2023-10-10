import { TextField } from '@mui/material';
import styles from './search-input.module.scss';

/* eslint-disable-next-line */
export interface SearchInputProps {
  sx: React.CSSProperties;
}

export function SearchInput(props: SearchInputProps) {
  return (
    <div className={styles['container']} style={props.sx}>
      <TextField id="standard-basic" label="Search" variant="standard" />
    </div>
  );
}

export default SearchInput;
