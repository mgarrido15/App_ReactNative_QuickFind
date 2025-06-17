// app/share.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { InteractionManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ShareRedirect() {
  const router = useRouter();

  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      const params = new URLSearchParams(window.location.search);
      const companyId = params.get("companyId");
      const productId = params.get("productId");

      if (companyId && productId) {
        await AsyncStorage.setItem("sharedCompanyId", companyId);
        await AsyncStorage.setItem("sharedProductId", productId);
      }

      router.replace("/"); // ✅ 重定向到 Login 页
    });
  }, []);

  return null;
}
