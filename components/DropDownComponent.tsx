import ThemedStyles, { width } from "@/constants/Styles";
import { dropDownItem, dropdownProps } from "@/constants/types";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";

const DropdownComponent = ({
  values,
  setValue,
  defaultValue,
  LeftIcon,
  labelFieldText = "label",
  placeHolderText = "Select an option",
  maxHeight = 180,
  valueFieldText = "value",
}: dropdownProps) => {
  const styles = ThemedStyles();

  // Store the full item instead of just value
  const [selectedItem, setSelectedItem] = useState<dropDownItem | null>(null);

  // Update selected item whenever defaultValue changes
  useEffect(() => {
    const matched =
      values.find((item) => item[valueFieldText] === defaultValue) || null;
    setSelectedItem(matched);
  }, [defaultValue, values]);

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={values}
      maxHeight={maxHeight}
      labelField={labelFieldText}
      valueField={valueFieldText}
      placeholder={placeHolderText}
      value={selectedItem}
      closeModalWhenSelectedItem
      onChange={(item: dropDownItem) => {
        setSelectedItem(item);
        setValue(item.value);
      }}
      containerStyle={{ flex: 1, width: width * 0.3 }}
      renderLeftIcon={() => <>{LeftIcon}</>}
    />
  );
};

export default DropdownComponent;
