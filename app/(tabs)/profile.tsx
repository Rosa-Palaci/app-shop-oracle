import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/stores/useAuthStore";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace("/welcome");
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Mi Perfil</Text>

      {/* SECCIÓN DE OPCIONES */}
      <View style={styles.section}>
        {/* ✅ MIS COMPRAS → HISTORIAL */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/settings/history")}
        >
          <IconSymbol name="bag.fill" size={26} color="#EA0040" />
          <Text style={styles.optionText}>Mis compras</Text>
        </TouchableOpacity>

        {/* Configuración (por ahora sin navegación) */}
        <TouchableOpacity style={styles.option}>
          <IconSymbol name="gearshape.fill" size={26} color="#EA0040" />
          <Text style={styles.optionText}>Configuración</Text>
        </TouchableOpacity>

        {/* Cerrar sesión */}
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <IconSymbol
            name="arrow.backward.circle.fill"
            size={26}
            color="#ea003ec7"
          />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#EA0040",
    marginBottom: 30,
  },
  section: {
    marginTop: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  optionText: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "500",
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#ea003ec7",
  },
});
