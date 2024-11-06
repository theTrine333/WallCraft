/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/Specific` | `/TopTabs` | `/TopTabs/anime` | `/TopTabs/black` | `/TopTabs/cars` | `/TopTabs/dark` | `/Viewer` | `/_sitemap` | `/mainScreen` | `/search` | `/seeAll`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
