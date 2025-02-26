import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from "@/src/components/ui/select/index";
	
export const Selection = (props:{placeholder:string, options:string[]}) => {
  return (
    <Select>
        <SelectTrigger variant="outline" size="lg" >
          <SelectInput placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop/>
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {props.options.map(o => <SelectItem key={o} label={o} value={o} />)}
          </SelectContent>
        </SelectPortal>
      </Select>
  );
}