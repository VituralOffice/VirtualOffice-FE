import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value: number) {
  return `${value}`;
}

export default function DiscreteSlider({width, label, defaultValue, step, shiftStep, min, max, onChange}) {
  return (
    <Box sx={{ width }}>
      <Slider
        aria-label={label}
        defaultValue={defaultValue}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        shiftStep={shiftStep}
        step={step}
        marks
        min={min}
        max={max}
        onChange={onChange}
      />
    </Box>
  );
}