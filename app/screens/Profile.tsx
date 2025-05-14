import { View, Text, SafeAreaView, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { styles } from "../styles";
import { User } from "../models/User";

export const Profile = () => {
  const route = useRoute();
  const { user } = route.params as { user: User };

  return (
    <SafeAreaView style={styles.container_Profile}>
      <Image
        source={{ uri: user.avatar || "https://via.placeholder.com/100" }}
        style={styles.imageStyle}
      />
      <Text style={styles.title_Profile}>{user.name}</Text>
      <Text style={styles.text_Profile}>{user.email}</Text>
    </SafeAreaView>
    
  );
};