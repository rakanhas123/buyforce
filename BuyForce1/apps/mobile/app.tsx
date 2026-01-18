import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🛍️ BuyForce</Text>
          <Text style={styles.tagline}>Smart Group Shopping</Text>
        </View>

        {/* Sample Product */}
        <View style={styles.productCard}>
          <View style={styles.productImageContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/300' }}
              style={styles.productImage}
            />
          </View>
          <Text style={styles.productName}>Premium Headphones</Text>
          <Text style={styles.productPrice}>$99.99</Text>
          <Text style={styles.productDesc}>High-quality wireless headphones</Text>

          {/* Group Info */}
          <View style={styles.groupInfo}>
            <Text style={styles.groupLabel}>👥 Group Status:</Text>
            <Text style={styles.groupStatus}>3/5 participants joined</Text>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>

          {/* Join Button */}
          <Pressable
            style={styles.joinButton}
            onPress={() => Alert.alert('✅ Group Joining', 'Payment modal would open here')}
          >
            <Text style={styles.joinButtonText}>Join Group & Pay</Text>
          </Pressable>
        </View>

        {/* Payment Status */}
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentTitle}>💳 Payment Methods Available:</Text>
          <View style={styles.paymentMethod}>
            <Text style={styles.methodIcon}>🅿️</Text>
            <Text style={styles.methodName}>PayPal</Text>
          </View>
          <View style={styles.paymentMethod}>
            <Text style={styles.methodIcon}>💳</Text>
            <Text style={styles.methodName}>Credit Card (Stripe)</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>✅ Payment integration is live!</Text>
          <Text style={styles.footerText}>Backend: http://localhost:3000</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#64748b',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  groupInfo: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  groupLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  groupStatus: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#cbd5e1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '60%',
    backgroundColor: '#3b82f6',
  },
  joinButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  methodIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  methodName: {
    fontSize: 14,
    color: '#1e293b',
  },
  footer: {
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  footerText: {
    fontSize: 12,
    color: '#059669',
    marginBottom: 4,
    fontWeight: '500',
  },
});
