import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  Button,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {LoginManager} from 'react-native-fbsdk-next';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

GoogleSignin.configure({
  androidClientId:
    'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
});

const App = props => {
  const Stack = createNativeStackNavigator();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    getCurrentUserInfo();
  }, []);

  const getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      console.log(userInfo);
      setIsLoggedIn(true);
      setUserInfo(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // EL USUARIO AUN NO HA INICIADO SESIÓN
      } else {
        // ALGUN OTRO ERROR
      }
    }
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo.user);
      setIsLoggedIn(true);
      setUserInfo(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setIsLoggedIn(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        <GoogleSigninButton
          style={{width: 192, height: 48}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
      ) : (
        <>
          <Image style={styles.image} source={require('./perfil.png')} />
          <Text style={styles.text}>
            Email: {userInfo ? userInfo.user.email : ''}
          </Text>
          <Text style={styles.text}>
            Name: {userInfo ? userInfo.user.name : ''}
          </Text>
          <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
            <Text style={styles.signOutBtnText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={{marginTop: 40}}>
        <Text>Facebook Login</Text>
        <Button
          title={'Login with Facebook'}
          onPress={() => {
            LoginManager.logInWithPermissions(['public_profile', 'email']).then(
              function (result) {
                if (result.isCancelled) {
                  alert('Login Cancelled' + JSON.stringify(result));
                } else {
                  alert(
                    'Login success with permissions: ' +
                      result.grantedPermissions.toString(),
                  );
                  alert('Login Success ' + result.toString());
                }
              },
              function (error) {
                alert('Login failed with error: ' + error);
              },
            );
          }}
        />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
  },
  boxLogin: {
    width: 125,
    height: 45,
    borderWidth: 1,
    borderColor: '#2F9ABA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  iconGoogle: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  signOutBtn: {
    width: 130,
    marginTop: 20,
    backgroundColor: '#556688',
    borderWidth: 1,
    borderColor: '#556688',
    padding: 10,
    borderRadius: 10,
  },
  signOutBtnText: {
    color: '#fff',
    textAlign: 'center',
  },
});
