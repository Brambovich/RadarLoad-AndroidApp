
import * as React from 'react';
import { View, Text, TextInput, Image, StyleSheet} from 'react-native';
import Button from 'react-native-flat-button'

export default function HomeScreen({ navigation, route }) {  
    return (
      <View style={{alignItems: 'center', flex: 1, backgroundColor: '#003257'}}>
        <View style={{alignItems: 'center', flex: 1, width: '100%', justifyContent: 'center'}}>
          <Image resizeMode = 'contain' source={require('../images/logo.png')} style={{marginHorizontal: 30, width: '90%'}} ></Image>
        </View>
        <View style={{alignItems: 'center', flex: 3, width: '100%', paddingHorizontal: 20}}>
          <Text style={{textAlign:'center', fontSize:30, fontWeight: 'bold', color: 'white'}}>Install & Scan</Text>
          <Text style={{textAlign:'center', fontSize:20, color: 'white'}}>
          It’s easy to start with the load sensors: 
          {"\n\n"}Step 1: {"\n"}Install the sensor, with the blank side facing up to the sky.
          {"\n\n"}Step 2: {"\n"}Turn on the Bluetooth function of your phone. Press the Scan button on the bottom of the screen. Your phone will start scanning for the installed nearby sensor.
          {"\n\n"}Step 3: {"\n"}Hold your hand or an object around 5 – 10 cm above the installed sensor. After a few seconds the status of the sensor will change in your screen.
          </Text>
        </View>

        <View style={{alignItems: 'center', flex: 1, justifyContent:'center', width: '100%'}}>
          <Button
            type="primary"
            onPress={() => navigation.navigate('ScanBeacons')}
            containerStyle={styles.buttonContainer}
          >
          Start scanning for sensors
          </Button>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
      
    },
    buttonContainer: {
      width: '80%',
      height: 50,
      marginVertical: 5,
    },
    content:{
      fontSize: 22
    }
  })