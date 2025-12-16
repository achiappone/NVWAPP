//app>preview.tsx

// app/preview.tsx
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useStore } from "../../store/StoreProvider";
import { buildConfigExport } from "../../utils/buildConfigExport";


const Preview = observer(() => {
  const rootStore = useStore();

  const exportData = buildConfigExport(rootStore);
  const [editModalVisible, setEditModalVisible] = useState(false);


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Preview</Text>

      <View style={styles.jsonContainer}>
        <Text style={styles.jsonText}>
          {JSON.stringify(exportData, null, 2)}
        </Text>
      </View>
    </ScrollView>

    
  );
});

export default Preview;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    marginBottom: 20,
  },
  jsonContainer: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 12,
  },
  jsonText: {
    color: "#0f0",
    fontFamily: "Courier",
    fontSize: 12,
  },
});
