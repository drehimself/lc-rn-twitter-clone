import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import axiosConfig from '../helpers/axiosConfig';
import { format } from 'date-fns';
import { Modalize } from 'react-native-modalize';
import { AuthContext } from '../context/AuthProvider';

export default function TweetScreen({ route, navigation }) {
  const [tweet, setTweet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const modalizeRef = useRef(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getTweet();
  }, []);

  function getTweet() {
    axiosConfig
      .get(`/tweets/${route.params.tweetId}`)
      .then(response => {
        setTweet(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  }

  function deleteTweet() {
    axiosConfig.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${user.token}`;

    axiosConfig
      .delete(`/tweets/${route.params.tweetId}`)
      .then(response => {
        Alert.alert('Tweet was deleted.');
        navigation.navigate('Home1', {
          tweetDeleted: true,
        });
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  function showAlert() {
    Alert.alert('Delete this tweet?', null, [
      {
        text: 'Cancel',
        onPress: () => modalizeRef.current?.close(),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => deleteTweet(),
        style: 'default',
      },
    ]);
  }

  function gotoProfile(userId) {
    navigation.navigate('Profile Screen', {
      userId: userId,
    });
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 8 }} size="large" color="gray" />
      ) : (
        <>
          <View style={styles.profileContainer}>
            <TouchableOpacity
              style={styles.flexRow}
              onPress={() => gotoProfile(tweet.user.id)}
            >
              <Image
                style={styles.avatar}
                source={{
                  uri: tweet.user.avatar,
                }}
              />
              <View>
                <Text style={styles.tweetName}>{tweet.user.name}</Text>
                <Text style={styles.tweetHandle}>@{tweet.user.username}</Text>
              </View>
            </TouchableOpacity>
            {user.id === tweet.user.id && (
              <TouchableOpacity onPress={() => modalizeRef.current?.open()}>
                <Entypo name="dots-three-vertical" size={24} color="gray" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.tweetContentContainer}>
            <Text style={styles.tweetContent}>{tweet.body}</Text>
            <View style={styles.tweetTimestampContainer}>
              <Text style={styles.tweetTimestampText}>
                {format(new Date(tweet.created_at), 'h:mm a')}
              </Text>
              <Text style={styles.tweetTimestampText}>&middot;</Text>
              <Text style={styles.tweetTimestampText}>
                {format(new Date(tweet.created_at), 'd MMM.yy')}
              </Text>
              <Text style={styles.tweetTimestampText}>&middot;</Text>
              <Text style={[styles.tweetTimestampText, styles.linkColor]}>
                Twitter for iPhone
              </Text>
            </View>
          </View>

          <View style={styles.tweetEngagement}>
            <View style={styles.flexRow}>
              <Text style={styles.tweetEngagementNumber}>628</Text>
              <Text style={styles.tweetEngagementLabel}>Retweets</Text>
            </View>
            <View style={[styles.flexRow, styles.ml4]}>
              <Text style={styles.tweetEngagementNumber}>38</Text>
              <Text style={styles.tweetEngagementLabel}>Quote Tweets</Text>
            </View>
            <View style={[styles.flexRow, styles.ml4]}>
              <Text style={styles.tweetEngagementNumber}>2,934</Text>
              <Text style={styles.tweetEngagementLabel}>Likes</Text>
            </View>
          </View>

          <View style={[styles.tweetEngagement, styles.spaceAround]}>
            <TouchableOpacity>
              <EvilIcons name="comment" size={32} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity>
              <EvilIcons name="retweet" size={32} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity>
              <EvilIcons name="heart" size={32} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity>
              <EvilIcons
                name={Platform.OS === 'ios' ? 'share-apple' : 'share-google'}
                size={32}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <Modalize ref={modalizeRef} snapPoint={200}>
            <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
              <TouchableOpacity style={styles.menuButton}>
                <AntDesign name="pushpino" size={24} color="#222" />
                <Text style={styles.menuButtonText}>Pin Tweet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={showAlert}
                style={[styles.menuButton, styles.mt6]}
              >
                <AntDesign name="delete" size={24} color="#222" />
                <Text style={styles.menuButtonText}>Delete Tweet</Text>
              </TouchableOpacity>
            </View>
          </Modalize>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 8,
    borderRadius: 25,
  },
  tweetName: {
    fontWeight: 'bold',
    color: '#222222',
  },
  tweetHandle: {
    color: 'gray',
    marginTop: 4,
  },
  tweetContentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tweetContent: {
    fontSize: 20,
    lineHeight: 30,
  },
  tweetEngagement: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tweetEngagementNumber: {
    fontWeight: 'bold',
  },
  tweetEngagementLabel: {
    color: 'gray',
    marginLeft: 6,
  },
  tweetTimestampContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  tweetTimestampText: {
    color: 'gray',
    marginRight: 6,
  },
  linkColor: {
    color: '#1d9bf1',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  ml4: {
    marginLeft: 16,
  },
  mt6: {
    marginTop: 32,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 20,
    color: '#222',
    marginLeft: 12,
  },
});
