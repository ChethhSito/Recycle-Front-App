import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export const PostCard = ({ post, onPress, onLikePress }) => {
  const isAdmin = post.isAdmin || false;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, isAdmin ? styles.cardAdmin : styles.cardNormal]}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Avatar */}
          <View style={[styles.avatar, isAdmin ? styles.avatarAdmin : styles.avatarNormal]}>
            <Text style={[styles.avatarText, isAdmin && styles.avatarTextAdmin]}>
              {post.authorInitials || post.author?.charAt(0) || 'U'}
            </Text>
          </View>

          {/* Author Info */}
          <View>
            <Text style={[styles.author, isAdmin && styles.authorAdmin]}>
              {post.author}
            </Text>
            <Text style={[styles.time, isAdmin && styles.timeAdmin]}>
              {post.time}
            </Text>
          </View>
        </View>

        {/* Category Badge & Pin */}
        <View style={styles.headerRight}>
          {post.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{post.category}</Text>
            </View>
          )}
          {post.isPinned && (
            <Icon name="pin" size={20} color="#FFCB4D" />
          )}
        </View>
      </View>

      {/* Alert Icon for Admin */}
      {isAdmin && post.isAlert && (
        <View style={styles.alertContainer}>
          <View style={styles.alertIcon}>
            <Text style={styles.alertText}>⚠</Text>
          </View>
        </View>
      )}

      {/* Title */}
      <Text style={[styles.title, isAdmin && styles.titleAdmin]} numberOfLines={2}>
        {post.title}
      </Text>

      {/* Description */}
      <Text style={[styles.description, isAdmin && styles.descriptionAdmin]} numberOfLines={2}>
        {post.description}
      </Text>

      {/* Interactions */}
      <View style={styles.interactions}>
        <View style={styles.interactions}>

          {/* LIKE BUTTON (Icono + Texto juntos) */}
          <TouchableOpacity
            onPress={onLikePress}
            style={styles.interaction} // Usamos el estilo interaction aquí
            activeOpacity={0.6}
          >
            <Icon
              name={post.isLiked ? "heart" : "heart-outline"}
              size={20}
              color={post.isLiked ? "#FF4D4D" : (isAdmin ? '#999' : '#32243B')}
            />
            <Text style={[styles.interactionText, isAdmin && styles.interactionTextAdmin]}>
              {post.likes}
            </Text>
          </TouchableOpacity>

          {/* COMMENTS BUTTON (Solo visual por ahora) */}
          <View style={styles.interaction}>
            <Icon name="message-outline" size={20} color={isAdmin ? '#999' : '#32243B'} />
            <Text style={[styles.interactionText, isAdmin && styles.interactionTextAdmin]}>
              {post.comments}
            </Text>
          </View>

        </View>


      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  cardNormal: {
    backgroundColor: '#018f64',
  },
  cardAdmin: {
    backgroundColor: '#32243B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarNormal: {
    backgroundColor: '#00C7A1',
  },
  avatarAdmin: {
    backgroundColor: '#FFCB4D',
  },
  avatarText: {
    color: '#000000ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  avatarTextAdmin: {
    color: '#000',
  },
  author: {
    fontSize: 18,
    fontFamily: 'InclusiveSans-Regular',
    color: '#000000ff',
  },
  authorAdmin: {
    color: '#FFCB4D',
  },
  time: {
    fontSize: 12,
    color: '#32243B',
    opacity: 0.7,
  },
  timeAdmin: {
    color: '#999',
    opacity: 1,
  },
  categoryBadge: {
    backgroundColor: '#00C7A1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryText: {
    color: '#000000ff',
    fontSize: 16,
    fontFamily: 'InclusiveSans-Regular',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#FFCB4D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    color: '#000000ff',
    fontSize: 16,
    fontFamily: 'InclusiveSans-Regular',
  },
  title: {
    fontSize: 16,
    fontFamily: 'InclusiveSans-Regular',
    color: '#000000ff',
    marginBottom: 8,
  },
  titleAdmin: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#32243B',
    opacity: 0.8,
    marginBottom: 16,
  },
  descriptionAdmin: {
    color: '#D3D3D3',
    opacity: 1,
  },
  interactions: {
    flexDirection: 'row',
  },
  interaction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  interactionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#32243B',
    marginLeft: 4,
  },
  interactionTextAdmin: {
    color: '#FFFFFF',
  },
});