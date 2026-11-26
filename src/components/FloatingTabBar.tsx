import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/theme";

type TabBarIconFn = (p: {
  focused: boolean;
  color: string;
  size: number;
}) => React.ReactNode;

type FloatingTabBarProps = {
  state: { index: number; routes: { key: string }[] };
  descriptors: Record<string, { options: { tabBarIcon?: TabBarIconFn } }>;
  emitter: {
    emit: (event: {
      type: "tabPress";
      target: string;
      canPreventDefault: boolean;
    }) => { defaultPrevented: boolean };
  };
  navigateToTab: (routeKey: string) => void;
};

export default function FloatingTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
}: FloatingTabBarProps) {
  return (
    <View style={styles.bar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;

        const onPress = () => {
          const event = emitter.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.item}
            onPress={onPress}
          >
            {options.tabBarIcon?.({
              focused,
              color: focused ? colors.background : colors.textMuted,
              size: 36,
            })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    bottom: 16,
    left: 24,
    right: 24,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  item: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
