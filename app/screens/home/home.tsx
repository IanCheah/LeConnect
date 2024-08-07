import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firebase from 'firebase/compat/app';
import { EventData, Event } from '@/app/types.d';

const HomeScreen = ({ navigation }) => {
  
  const [eachData, setEachData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Time');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        firebase
          .firestore()
          .collection('events') 
          .where('Time', '>=', new Date())
          .orderBy(selectedFilter, 'asc')
          .onSnapshot(querySnapshot => {
            const eventsFromDatabase = [];

            querySnapshot.forEach(documentSnapshot => {
              eventsFromDatabase.push({
                id: documentSnapshot.id,
                ...documentSnapshot.data(),
              });
            });
            console.log(eventsFromDatabase);
            setEachData(eventsFromDatabase);
        });

      } catch (error: any) {
        Alert.alert('error is' + error.message());
      }
    };

    loadEvents();
  }, [selectedFilter]);

  const toEvent = (item: EventData) => {
    // handles the logic when you press onto each event
    // enter event page: see user created + description
    navigation.navigate('EventPage', {
      Title: item.Title,
      Time: item.Time.toDate().toString().substring(0, 21),
      id: item.id,
      Description: item.Description,
      Creator: item.Creator,
      Participants: item.Participants,
      Location: item.Location,
    });
  };

  const renderEvent = ({item}) => {
    return (
      <Event
        item={item}
        onPress={() => toEvent(item)}
      />
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Sort by:</Text>
        <View style={styles.pickerContainer}>
          <Picker 
            dropdownIconColor={'black'}
            selectedValue={selectedFilter}
            onValueChange={setSelectedFilter}
          >
            <Picker.Item label="Time" value="Time" />
            <Picker.Item label="Title" value="Title" />
            <Picker.Item label="Category" value="Category" />
          </Picker>
        </View>
      </View>
      <FlatList 
        data={eachData}
        renderItem={renderEvent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 15,
    marginTop: 10,
  },
  filterText: {
    fontSize: 16,
  },
  pickerContainer: {
    justifyContent: 'center',
    width: 160,
    height: 10,
  },
});

export default HomeScreen;