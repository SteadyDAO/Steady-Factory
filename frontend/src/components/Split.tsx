import { Button, FormControl, MenuItem, Select, TextField } from "@mui/material";

const Split = () => {
  return (
    <div className="SplitContainer">
      <span className="SplitLabel">Split Chyme</span>
      <div className="SplitFormContainer">
        <div className="SplitFormControl">
          <FormControl required fullWidth>
            <TextField
              type="text"
              placeholder="Amount"
            />
          </FormControl>
        </div>
        <div className="SplitFormControl">
          <FormControl required fullWidth>
            <Select value={'default'}>
              <MenuItem selected disabled value="default">Chyme's</MenuItem>
              <MenuItem>CGT</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="SplitFormControl">
          <FormControl required fullWidth>
            <Select value={'default'}>
              <MenuItem selected disabled value="default">Forge Prices</MenuItem>
              <MenuItem>CGT</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="SplitActions">
        <Button color="secondary" variant="contained">Split</Button>
      </div>
    </div>
  );
}

export default Split;
