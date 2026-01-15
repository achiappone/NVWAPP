
// app/%28pages%29/launch.tsx

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { observer } from "mobx-react-lite";
import { getSnapshot } from "mobx-state-tree";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useStore } from "../../store/StoreProvider";

const isWeb = Platform.OS === "web";

const Launch = observer(() => {
  
  const store = useStore();
  const router = useRouter();
  const project = store.activeProject;
  const [renameProjectId, setRenameProjectId] = useState<string | null>(null);
  const [projectNameDraft, setProjectNameDraft] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const exportAllProjects = async () => {
  try {
    const snapshot = getSnapshot(store);

    const json = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        appVersion: "v1.0",
        projects: snapshot.projects,
      },
      null,
      2
    );

    // 🌐 WEB: download JSON
    if (Platform.OS === "web") {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "nvwapp-projects.json";
      a.click();

      URL.revokeObjectURL(url);
      return;
    }

    // 📱 NATIVE: filesystem + share
    const baseDir =
      (FileSystem as any).documentDirectory ??
      (FileSystem as any).cacheDirectory ??
      "";

    const fileUri = baseDir + "nvwapp-projects.json";

    await FileSystem.writeAsStringAsync(fileUri, json, {
      encoding: "utf8",
    });

    await Sharing.shareAsync(fileUri);
  } catch (err) {
    console.error("Export failed", err);
  }
};


  const importProjects = async () => {
  try {
    // 🌐 WEB
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        const text = await file.text();
        const parsed = JSON.parse(text);

        if (!parsed.projects) {
          throw new Error("Invalid project file");
        }

        store.replaceAllProjects(parsed.projects);
      };

      input.click();
      return;
    }

    // 📱 NATIVE
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    const text = await fetch(file.uri).then((r) => r.text());
    const parsed = JSON.parse(text);

    if (!parsed.projects) {
      throw new Error("Invalid project file");
    }

    store.replaceAllProjects(parsed.projects);
  } catch (err) {
    console.error("Import failed", err);
  }
};



  return (
    <View style={styles.container}>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={ styles.scrollContent }
      >
      <Text style={styles.title}>Launch</Text>


      {/* Active Project */}
      {project && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Start Here:</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/calculator")}
          >
            <Text style={styles.primaryButtonText}>Calculator</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/(pages)/home")}
          >
            <Text style={styles.primaryButtonText}>System Builder</Text>
          </TouchableOpacity>
        </View>
      )}

      </ScrollView>
      </View>
    );
});

export default Launch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 15,
    paddingTop: 30,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#262525ff",
    borderRadius: 15,
    padding: 16,
  },
  cardLabel: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 6,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: "#ff7a00",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 50,
    alignItems: "center",
    marginBottom: 20,
  },
  primaryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    minWidth: 50,
    textAlign: "center",
  },
  secondaryButton: {
    borderColor: "#ff7a00",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 50,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#ff7a00",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 10,
},
  projectNameContainer: {
    flex: 1,
    paddingVertical: 6,
  },
  projectActions: {
    marginLeft: 12,
  },
  projectName: {
    color: "#fff",
    fontSize: 16,
  },
  renameOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  renameModal: {
    backgroundColor: "#4b4a4aff",
    padding: 20,
    borderRadius: 10,
    width: "85%",
  },
  renameTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  renameInput: {
    backgroundColor: "#4b4a4aff",
    color: "#fff",
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
  },
  deleteButton: {
    borderColor: "rgba(255, 0, 0, 1)",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#ff4d4d",
    fontWeight: "bold",
    fontSize: 14,
  },
  deleteConfirmButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  deleteConfirmButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  reviewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ff7a00",
    marginLeft: 10,
    justifyContent: "center",
  },
  reviewButtonText: {
    color: "#ff7a00",
    fontSize: 14,
    fontWeight: "600",
  },
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#222",
    borderBottomWidth: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 20,
    marginRight: isWeb ? 16 : 0,
  },


});