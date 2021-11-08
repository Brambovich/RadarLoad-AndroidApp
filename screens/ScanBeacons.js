import * as React from 'react';
import { useEffect } from 'react';
import { View, Text, Button, TextInput, SafeAreaView, Image, StyleSheet, FlatList, PermissionsAndroid, TouchableOpacity} from 'react-native';

import { DeviceEventEmitter } from 'react-native'
import Beacons from 'react-native-beacons-manager'
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import moment from 'moment'

const IDENTIFIER = '12ab3456'
const UUID = '01122334-4556-6778-899a-abbccddeeff0';


export default function ScanBeacons({ navigation, route }) {
    const [postText, setPostText] = React.useState('');
    beaconsServiceDidConnect: any = null;
    var currentTime = moment().format('D-M-YY h:mm:ss');
    const [beacon_list, setbeacon_list] = React.useState([])
    //const [beacon_list, setbeacon_list] = React.useState([{uuid: '756e6461-6772-6964-sample', major: 14, minor: 62, loaded: false, time: currentTime}, {uuid: '756e6461-6772-6964-sample2', major: 1563, minor: 2314, loaded: true, time: currentTime}])
    const [identifier] = React.useState(IDENTIFIER);
    const [uuid] = React.useState(UUID);

    startRangingAndMonitoring = async () => {
      const region = {identifier}; // minor and major are null here
      
      try {
        
        await Beacons.startRangingBeaconsInRegion(region);
        await Beacons.startMonitoringForRegion(region); 
      } catch (error) {
        throw error;
      } finally {
        console.log(' --> Beacons monitoring and ranging started successfully');
      }
    };

    stopRangingAndMonitoring = async () => {
      
      const region = { identifier, uuid }; // minor and major are null here
      Beacons.BeaconsEventEmitter.removeAllListeners()
      DeviceEventEmitter.removeAllListeners()
      try {
        await Beacons.stopRangingBeaconsInRegion(region);
        await Beacons.stopMonitoringForRegion(region);      
      } catch (error) {
        throw error;
      } finally{
        console.log(' <-- Beacons monitoring & ranging stopped successfully');
      }

      
    };
  
    checkPermission = async () => {
      permission_data = await PermissionsAndroid.check('android.permission.BLUETOOTH');
      console.log("permission:", permission_data)
      transmissionSupported = await Beacons.checkTransmissionSupported()
      console.log("supported:", transmissionSupported)
    }

    const getLabel = async (receivedUuid) => {
      var value = ""
      try {
        const value = await AsyncStorage.getItem(receivedUuid)
        if(value !== null) {
          return value ? value : receivedUuid
        }
        //   console.log("found label!", value, "for: ", receivedUuid)
        //   tmp_beacon_list = beacon_list
        //   console.log(tmp_beacon_list)
        //   var foundIndex = tmp_beacon_list.findIndex(x => x.uuid == receivedUuid);
        //   var foundBeacon = tmp_beacon_list.find(x => x.uuid == receivedUuid);
        //   foundBeacon.label = value
        //   tmp_beacon_list[foundIndex] = foundBeacon;
        //   console.log(tmp_beacon_list)
        //   setbeacon_list(tmp_beacon_list)
        // }
      } catch(e) {
        // error reading value
      } 

      //return value ? value : receivedUuid
    }

    getAllKeys = async () => {
      let keys = []
      let value = []
      try {
        keys = await AsyncStorage.getAllKeys()
      } catch(e) {
        // read key error
      }
      try {
        value = await AsyncStorage.multiGet(keys)
      } catch(e) {
        // read key error
      }
    
      console.log(keys,"\n", value)
      // example console.log result:
      // ['@MyApp_user', '@MyApp_key']
    }
    
    

    useEffect(() => {
      Beacons.setForegroundScanPeriod(100);
      Beacons.setBackgroundScanPeriod(100);
      Beacons.setBackgroundBetweenScanPeriod(0);
      Beacons.detectCustomBeaconLayout('m:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24')
      //Beacons.detectIBeacons()
      //rcheckPermission()
      console.log(" --> component did mount")
  
      beaconsServiceDidConnect = Beacons.BeaconsEventEmitter.addListener(
        'beaconServiceConnected',
        () => {
          console.log(' --> service connected');
          startRangingAndMonitoring();
        },
      );
      DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
        // console.log('Found beacons!', data) // Result of ranging
        if (data.beacons.length > 0){
          data.beacons.forEach(beacon => {
            //console.log("Beacon discovered!, ", beacon)
            updateBeacons(beacon);
          })
        }
      })
      return function cleanup(){
        console.log(" <-- cleanup the component");
        stopRangingAndMonitoring()
      }
    }, [])

    React.useEffect(() => {
      if (route.params?.label) {
      console.log("Label changed!", route.params.uuid, "label:", route.params.label)
      let updatedBeacons = beacon_list
      updatedBeacons = updatedBeacons.map(beacon => {
        if(beacon.uuid === route.params.uuid){
          beacon.label = route.params.label;
        }
        return beacon   
      })
      setbeacon_list(updatedBeacons)
    }
    }, [route.params?.label]);


    determineLoaded = (major) => {

      if (major > 1000) {
        
        return true
      }
      return false
      
    }
  
    updateBeacons = async (
      {uuid, major, minor} //beacon
      ) => {
      //console.log("update beacon with: ", uuid, major, minor)
      if (uuid.substring(0,18) != '756e6461-6772-6964'){
        return
      }
      //getLabel(uuid)
      let found = false
      let options = { dateStyle: 'short', timeStyle: 'long'};
      
      var currentTime = moment().format('D-M-YY HH:mm:ss');

      let updatedBeacons = beacon_list
      //console.log("updated beacons:",updatedBeacons)
      const loaded = await determineLoaded(major)

      updatedBeacons = updatedBeacons.map(beacon => {
        if(beacon.uuid === uuid){
          beacon.major = major;
          beacon.minor = minor;
          if(beacon.loaded == loaded){
            if (beacon.loadedcount < 5) {
              beacon.loadedcount++
            }
          } else{
            beacon.loadedcount = 0;
          }
          if (beacon.loadedcount == 3){
            beacon.loadedtime = currentTime;
          }
          
          console.log("update", beacon.uuid, "  loadedcount: ", beacon.loadedcount, '  loadedtime: ', beacon.loadedtime)
          beacon.loaded = loaded;
          found = true;
          beacon.time = currentTime;
        }
        return beacon   
      })
      if(found === false){
        newBeacon = {
          uuid: uuid,
          major: major,
          minor: minor,
          loaded: loaded,
          label: await getLabel(uuid),
          time: currentTime,
          loadedcount: 0
        }
        updatedBeacons.push(newBeacon)
        
      }
      //console.log("add the following to beaconlist:", updatedBeacons)

      setbeacon_list(updatedBeacons)
  
    };


    Separator = () => (
      <View style={styles.separator} />
    );
  
    determineLoadedText = (loaded) => {
      if (loaded === true){
        return "LOADED"
      } else {
        return "UNLOADED"
      }
    }

    printLoadedTime = (loadedtime) => {
      substring = loadedtime?.substring(8, loadedtime.length);
      fullString = "Since: ";

      fullString = fullString.concat(substring);
      if (loadedtime !== undefined) {
        return fullString
      } else {
        return ""
      }
      
    }

    sectionview = ({uuid, time, major, minor, loaded, label, loadedtime}) => {

      return(
        <View style={{height: 150, borderColor: 'red', borderWidth: 0}}>
          
          <TouchableOpacity style={{flex: 2, alignContent: 'center', justifyContent: 'center'}} onPress={() => navigation.navigate('UpdateKey', {uuid, major, minor, label})} >
            <Text style={{color: 'white', textAlign: 'center', fontSize: 18, fontWeight: '600',}}>
              {label ? label : uuid}
            </Text>
          </TouchableOpacity>
          <View style={{flex: 4}}>
            <View style={{flex: 1, flexDirection: 'row', borderColor: '#467397', borderWidth: 2, marginVertical: 10, marginHorizontal: 15, borderRadius: 10}}>
              <View style={{flex: 2, borderRightWidth: 2, borderRightColor: '#467397', alignContent: 'center', justifyContent: 'center'}}>

                <Text style={{color: 'white', fontSize: 15, textAlign: 'center'}}>{time?.substring(0, 7) + "\n" + time?.substring(8, time.length)}</Text>
                

              </View>
              <View style={{flex: 4, alignContent: 'center', justifyContent: 'center', flexDirection: 'column'}}>
              <View>
                  <Text style={styles.sectionTitle}>{determineLoadedText(loaded)}</Text>
                </View>
                <View>
                  <Text style={{textAlign: 'center', color: 'lightgrey'}}>{printLoadedTime(loadedtime)}</Text>
                </View>
              </View>
              </View>
          </View>
          <Separator/>

        </View>
      )
      // return (
      //     <View style={{flexDirection: 'row', justifyContent: 'space-evenly', height: 150}} >
      //       <TouchableOpacity style = {styles.sectionContainer} onPress={() => navigation.navigate('UpdateKey', {uuid, major, minor})}>
      //         <Text style={styles.sectionTitle}>{label ? label : uuid}</Text>
      //         <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
      //           <Text style={styles.sectionDescription}>Minor:   {minor}</Text>
      //           <Text style={styles.sectionDescription}>Major:   {major}</Text>
      //         </View>
      //       </TouchableOpacity>
      //       <View style={{width: '10%', alignItems:'center', justifyContent: 'center', marginRight: 15}}>
      //       <Image resizeMode="center" style={{flex: 1}} source={loaded ? require("../images/check.png") : require("../images/cross.png")}></Image>
      //       </View>
      //     </View>
      // );
    }

    EmptyListMessage = () => {
      return (
        <View style={{alignContent: 'center', flex: 1}}>
        <LottieView source={require('../animations/searching.json')} autoPlay loop style={{width: '100%'}}
        />
        </View>
      )
    }

    return(
        <View style={{backgroundColor: '#003257', flex: 1}}>
          <View style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
            <Text style={styles.subtitle}>Load sensors:</Text>
          </View>
          {/* <View>
            <Button title={'Add sample'} onPress={() => updateBeacons({uuid: '756e6461-6772-6964-sample', major: 14, minor: 62})}>hoi</Button>
            <Button title={'Add sample 2'} onPress={() => updateBeacons({uuid: '756e6461-6772-6964-sample2', major: 5420, minor: 2356})}>hoi</Button>
            <Button title={'print saves'} onPress={() => {getAllKeys()}}/>
            <Button title={'Print beaconlist'} onPress={() => console.log(beacon_list)}>hoi</Button>
            <Button title={'remove'} onPress={() => setbeacon_list()} />
          </View> */}
          <Separator></Separator>
          <View style={{flex: 5, alignContent: 'center'}}>
            <FlatList
              data={beacon_list}
              contentContainerStyle={{
                flexGrow: 1,
                }}
                keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => {
                return(sectionview(item))
              }}
              ListEmptyComponent={EmptyListMessage}

            />
          </View>
        </View>
    );
  }


const styles = StyleSheet.create({
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
  },
  sectionContainer: {
    flex: 3,
    borderWidth: 4,
    borderColor: "#111",
    borderRadius: 15,
    backgroundColor: '#034c93',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});