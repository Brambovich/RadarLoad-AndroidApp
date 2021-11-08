
import * as React from 'react';
import { View, Text, Button, TextInput, LogBox, Image, StyleSheet} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import LottieView from 'lottie-react-native';

export default function StartScreen({ navigation, route }) {  

    onSwipeUp = (gestureState) => {
        console.log("you swiped up")
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        
      }

      const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
      };

    return (
        <GestureRecognizer
        onSwipeUp={(state) => onSwipeUp(state)}
        config={config}
        style={{flex:1}}
        >
          <View style={{alignItems: 'center', flex: 1, backgroundColor: '#113054'}}>
            <View style={{alignItems: 'center', flex: 1, backgroundColor: '#113054', width: '100%', justifyContent: 'center'}}>
              <Image resizeMode = 'contain' source={require('../images/logo.png')} style={{marginHorizontal: 30, width: '90%'}} ></Image>
            </View>
            <View style={{alignItems: 'center', flex: 2, backgroundColor: '#113054', width: '100%', paddingHorizontal: 20}}>

              <Text style={{textAlign:'center', fontSize:30, fontWeight: 'bold', color: 'white'}}>Welcome</Text>
              <Text style={{textAlign:'center', fontSize:20, color: 'white'}}>
                Welcome to the Undagrid load sensor app. This app shows the status whether a dolly is loaded, or not, 
                and can be used for demonstration or installation purposes. {"\n\n"}The data shown in this app is not shared 
                with any software or database system. Reach out to Undagrid if you want to learn more about sharing 
                this data with other systems or products.
              </Text>
            </View>
            <View style={{alignItems: 'center', flex: 2, justifyContent:'center', width: '100%'}}>
              <LottieView source={require('../animations/swipe_up.json')} autoPlay loop style={{height: '100%'}} 
              colorFilters={[{
                keypath: "Path 1",
                color: "#FFFFFF"
              },{
                keypath: "Path 2",
                color: "#eeeeee"
              }]}
              />
            </View>
          
          </View>

        </GestureRecognizer>
    );
  }

const styles = StyleSheet.create({
  logo: {
    width: null,
    resizeMode: 'contain',
    height: 100,
    marginHorizontal: '5%',
  }
})