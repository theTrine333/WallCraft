import { ReactNode } from "react";

export interface ImageType {
  Image_url: string;
  Image: string;
}

export interface ImageTagsProps {
  Title: string;
  Url: string;
  Image1: string;
  Image2: string;
  Image3: string;
}

export interface settingsBtnProps {
  LeftIcon?: ReactNode;
  RightIcon?: ReactNode;
  Heading: string;
  SubHeading?: string;
  Action?: any;
}

export type dropDownItem = {
  label: string;
  value: any;
};

export type dropdownProps = {
  values: dropDownItem[];
  setValue: (val: dropDownItem["value"]) => void;
  defaultValue?: dropDownItem["value"];
  LeftIcon?: React.ReactNode;
  labelFieldText?: "label";
  valueFieldText?: "value";
  placeHolderText?: string;
  maxHeight?: number;
};
