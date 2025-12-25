// apps/mobile/app/(tabs)/groups.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

interface Group {
  id: number;
  name: string;
  description: string;
}

const groupsData: Group[] = [
  { id: 1, name: "Group A", description: "This is Group A" },
  { id: 2, name: "Group B", description: "This is Group B" },
  { id: 3, name: "Group C", description: "This is Group C" },
];

const Groups: React.FC = () => {
  const [activeGroupId, setActiveGroupId] = useState<number>(groupsData[0].id);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Groups</Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {groupsData.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={[
              styles.tabButton,
              activeGroupId === group.id && styles.activeTabButton,
            ]}
            onPress={() => setActiveGroupId(group.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeGroupId === group.id && styles.activeTabText,
              ]}
            >
              {group.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Active Tab Content */}
      <View style={styles.contentContainer}>
        {groupsData.map(
          (group) =>
            group.id === activeGroupId && (
              <View key={group.id}>
                <Text style={styles.groupTitle}>{group.name}</Text>
                <Text style={styles.groupDescription}>{group.description}</Text>
              </View>
            )
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0b0b0b",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: "#007bff",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  groupDescription: {
    marginTop: 8,
    fontSize: 16,
    color: "#ccc",
  },
});

export default Groups;
