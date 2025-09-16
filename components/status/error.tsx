import React from 'react'
import { StyleSheet, Image, View, Text } from 'react-native'

const Error = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/dantsu-flame-umamusume.png')}
        style={styles.image}
      />
      <Text style={[styles.title, {color: 'white'}]}>Lỗi rồi!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    alignItems: 'center', // căn giữa theo trục ngang
    justifyContent: 'flex-start', // giữ từ trên xuống
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    paddingTop: 20,
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    fontWeight: '700',
  },
})

export default Error
