
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, StyleSheet} from 'react-native';
import Button from 'react-native-flat-button'
export default function UpdateKey({ navigation, route }) {  
    const { uuid, major, minor, label} = route.params;
    const [new_label, setLabel] = React.useState('');

    const storeData = async (receivedLabel) => {
      try {
        await AsyncStorage.setItem(uuid, receivedLabel)
        
      } catch (e) {
        // saving error
      } 
      console.log("label put into storage!", uuid,  "  :  ", receivedLabel)      
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#003257'}}>
        <View style={{alignItems: 'center', flex:2, flexDirection: 'row', marginVertical: '10%', borderColor: '#467397', borderWidth: 2, marginVertical: 10, marginHorizontal: 15, borderRadius: 10, justifyContent: 'center'}}>
          <Text style={{fontSize: 30, fontWeight: 'bold', color:'white', textAlign:'center', margin: 15, textAlignVertical:'center'}}>
            {uuid}
          </Text>
        </View>
        <View style={{flex: 2, width:'90%', justifyContent: 'center', flexDirection: 'row', alignContent: 'center'}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
            <Text style={{textAlign:'center', color: 'white', fontSize: 20, fontWeight: 'bold'}}>Label:</Text>

          </View>
          <View style={{flex: 2, justifyContent: 'center'}} >
          <TextInput
            placeholder={label}
            style={{height: '50%', marginVertical: 20, padding: 10, backgroundColor: 'black', color: 'white', textAlign: 'center', fontSize: 15, fontWeight: 'bold', borderRadius: 10}}
            value={new_label}
            onChangeText={setLabel}
          />
          </View>
        </View>
        <View style={{flex: 5, alignContent: 'center', justifyContent: 'flex-end', width: '90%'}}>
          <Button
            containerStyle={styles.buttonContainer}
            type='primary'
              onPress={() => {
                // Pass params back to home screen
                storeData(new_label)
                navigation.navigate('ScanBeacons', { uuid: uuid, label: new_label });
              }}
            >Save
          </Button>
        </View>
        
      </View>
    );
  }

  const styles = StyleSheet.create({
    buttonContainer: {
      width: '80%',
      height: 50,
      marginVertical: 20,
      alignSelf: 'center'
    },
    logo: {
      width: null,
      resizeMode: 'contain',
      height: 100,
      marginHorizontal: '5%',
    },
    separator: {
      marginVertical: 1,
      borderBottomColor: '#032541',
      borderBottomWidth: 2,
      marginHorizontal: 10
    },
    button:{
      borderWidth: 4,
      borderColor: "#111",
      borderRadius: 15,
      backgroundColor: '#034c93',
      padding: 20,
    },
    subtitle:{
      color: '#f27b27',
      textAlign: 'left',
      fontSize: 35,
      marginHorizontal: '10%',
      fontWeight: 'bold',
      textAlign: 'center'
    }
  })