// HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "./firebaseConfig"; // <- atual caminho
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "dashboardCards"),
      where("ownerId", "==", user.uid)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCards(list);
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao ler cards:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={{ color: "#666" }}>Nenhum card por enquanto.</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => {}}>
      <Text style={styles.title}>{item.title || "Sem título"}</Text>
      {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meu Painel</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f3f5" },
  header: {
    height: 80,
    backgroundColor: "#fff",
    paddingTop: 36,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e53935",
  },
  logoutText: { color: "#e53935", fontWeight: "600" },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: { fontSize: 16, fontWeight: "600" },
  subtitle: { fontSize: 13, color: "#666", marginTop: 6 },
  empty: {
    alignItems: "center",
    marginTop: 40,
  },
});
