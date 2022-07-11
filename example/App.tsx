import React, {useState} from 'react';
import {Button, SafeAreaView, StyleSheet} from 'react-native';
import AwesomeCamera from 'react-native-awesome-camera';

const App = () => {
  const {container} = styles;
  const [isOpen, setIsOpen] = useState(false);

  const getData = (data: any) => {
    console.log({data});
  };

  return (
    <SafeAreaView style={container}>
      {(!isOpen && (
        <Button
          title="button"
          onPress={() => {
            setIsOpen(true);
          }}
        />
      )) || <AwesomeCamera setIsOpen={setIsOpen} getData={getData} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
