
// app/%28pages%29/home.tsx

import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useStore } from "../../store/StoreProvider";

const Home = observer(() => {
  
  const store = useStore();
  const router = useRouter();
  const project = store.activeProject;
  const [renameProjectId, setRenameProjectId] = useState<string | null>(null);
  const [projectNameDraft, setProjectNameDraft] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>

      {/* Active Project */}
      {project && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Active Project</Text>
          <Text style={styles.cardTitle}>{project.name}</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/hardware")}
          >
            <Text style={styles.primaryButtonText}>Continue Editing</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* New Project */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => {
          store.createProject("New Project");
          router.push("/hardware");
        }}
      >
        <Text style={styles.secondaryButtonText}>+ New Project</Text>
      </TouchableOpacity>

      {/* Project List */}
      <View style={{ marginTop: 30 }}>
        <Text style={styles.sectionTitle}>Projects (press + hold to rename)</Text>

        {store.projectList.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={styles.projectRow}
            onPress={() => {
              store.setActiveProject(p.id);
              router.push("/hardware");
            }}
            onLongPress={() => {
              setRenameProjectId(p.id)
              setProjectNameDraft(p.name);
            }}
          >
            <Text style={styles.projectName}>{p.name}</Text>
          </TouchableOpacity>
        ))}

        {renameProjectId && (
  <View style={styles.renameOverlay}>
    <View style={styles.renameModal}>
      <Text style={styles.renameTitle}>Rename Project</Text>

      <TextInput
        value={projectNameDraft}
        onChangeText={setProjectNameDraft}
        placeholder="Project name"
        placeholderTextColor="#666"
        style={styles.renameInput}
        autoFocus
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setRenameProjectId(null)}
        >
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            store.renameProject(renameProjectId, projectNameDraft.trim() || "New Project");
            setRenameProjectId(null);
          }}
        >
          <Text style={styles.primaryButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            setConfirmDeleteId(renameProjectId);
          }}
        >
          <Text style={styles.deleteButtonText}>Delete Project</Text>
        </TouchableOpacity>
        
        {/* Delete button modal */}
        {confirmDeleteId && (
          <View style={styles.renameOverlay}>
            <View style={styles.renameModal}>
              <Text style={styles.renameTitle}>Delete Project?</Text>

              <Text style={{ color: "#aaa", marginBottom: 20 }}>
                This action cannot be undone.
              </Text>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => setConfirmDeleteId(null)}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteConfirmButton}
                  onPress={() => {
                    store.deleteProject(confirmDeleteId);
                    setConfirmDeleteId(null);
                    setRenameProjectId(null);
                  }}
                >
                  <Text style={styles.deleteConfirmButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
              )}
          </View>
        </View>
      </View>
      )}
        </View>
      </View>
    );
});

export default Home;

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
  card: {
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
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
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    minWidth: 75,
    textAlign: "center",
  },
  secondaryButton: {
    borderColor: "#ff7a00",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 75,
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
  projectRow: {
    paddingVertical: 12,
    borderBottomColor: "#222",
    borderBottomWidth: 1,
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
    backgroundColor: "#111",
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
    backgroundColor: "#000",
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

});