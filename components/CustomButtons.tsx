import ThemedStyles from "@/constants/Styles";
import { settingsBtnProps } from "@/constants/types";
import React from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import { ThemedText } from "./ThemedText";

const SettingBtn = ({
  LeftIcon,
  RightIcon,
  Heading,
  SubHeading,
  Action,
  HeadingStyle,
  SubHeadingStyle,
}: settingsBtnProps) => {
  const theme = useColorScheme() ?? "light";
  const styles = ThemedStyles(theme);
  return Action && Action ? (
    <TouchableOpacity
      style={[styles.settingsBtn, { justifyContent: "space-between" }]}
      onPress={Action}
    >
      {/* Right buttons */}
      {RightIcon && RightIcon}
      {/* Heading and subheading */}
      <View style={{ alignItems: "flex-start" }}>
        <ThemedText
          style={[
            {
              fontSize: 18,
              // color: Colors.constants.pink,
              fontWeight: "700",
            },
            { ...HeadingStyle },
          ]}
        >
          {Heading}
        </ThemedText>
        {SubHeading && (
          <ThemedText
            style={[{ fontSize: 10, opacity: 0.5 }, { ...SubHeadingStyle }]}
          >
            {SubHeading}
          </ThemedText>
        )}
      </View>
      {/* Left icons */}
      {LeftIcon && LeftIcon}
    </TouchableOpacity>
  ) : (
    <View style={[styles.settingsBtn, { justifyContent: "space-between" }]}>
      {/* Right buttons */}
      {RightIcon && RightIcon}
      {/* Heading and subheading */}
      <View style={{ alignItems: "flex-start" }}>
        <ThemedText
          style={[
            {
              fontSize: 18,
              // color: Colors.constants.pink,
              fontWeight: "700",
            },
            { ...HeadingStyle },
          ]}
        >
          {Heading}
        </ThemedText>
        {SubHeading && (
          <ThemedText
            style={[{ fontSize: 10, opacity: 0.5 }, { ...SubHeadingStyle }]}
          >
            {SubHeading}
          </ThemedText>
        )}
      </View>
      {/* Left icons */}
      {LeftIcon && LeftIcon}
    </View>
  );
};

export default SettingBtn;
