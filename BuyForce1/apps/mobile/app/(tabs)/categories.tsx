// apps/mobile/app/tabs/categories.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';

// סוג נתון עבור קטגוריה
type Category = {
  id: string;
  name: string;
  image: string; // URL או מיקום תמונה מקומית
};

const CategoriesScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  // כאן אפשר להתחבר ל-API של BuyForce או להשתמש בדאטה דמה
  useEffect(() => {
    const fetchCategories = async () => {
      // דוגמה של נתונים סטטיים
      const data: Category[] = [
        { id: '1', name: 'אלקטרוניקה', image: 'https://via.placeholder.com/150' },
        { id: '2', name: 'ביגוד', image: 'https://via.placeholder.com/150' },
        { id: '3', name: 'ספרים', image: 'https://via.placeholder.com/150' },
        { id: '4', name: 'קוסמטיקה', image: 'https://via.placeholder.com/150' },
      ];
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.card} onPress={() => console.log('Selected:', item.name)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>קטגוריות</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    width: 120,
    height: 150,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 40,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CategoriesScreen;
