import { Button, Input, Text } from '@rneui/themed'
import { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import SQLite from 'react-native-sqlite-storage'
const CryptoJS = require("crypto-js")

const db = SQLite.openDatabase(
    {
        name: "TaDB",
        location: "default"
    },
    () => {},
    error => {console.log(error)}
)

const Login = ({navigation, route}) => {
    const [password, setPassword] = useState("")

    const getAccount = () => {
        console.log(route)
        db.transaction((tx) => {
            tx.executeSql(
                `
                    SELECT *
                    FROM account
                    WHERE address=?
                    AND name=?
                `,
                [route.params.address, route.params.name],
                (tx, result) => {
                    console.log(result.rows.raw())
                    try {
                        const decrypted = CryptoJS.AES.decrypt(result.rows.item(0).private_key, password)
                        const originalText = decrypted.toString(CryptoJS.enc.Utf8)
                        if (originalText !=  null && originalText != "") {
                            navigation.navigate("Home", {address: result.rows.item(0).address, name: result.rows.item(0).name})
                        } else {
                            Alert.alert("Gagal", "Passoword Salah", [
                                {
                                    text: "Ok"
                                }
                            ])     
                        }      
                    } catch (error) {
                        console.log(error)
                        Alert.alert("Gagal", "Passoword Salah", [
                            {
                                text: "Ok"
                            }
                        ])    
                    }
                },
                error => console.log(error)
            )
        })
    }   

    return (
        <View style={styles.container}>
            <Text style={styles.title}>LOGIN</Text>
            <Input
                placeholder='password'
                onChangeText={value => setPassword(value)}
                secureTextEntry={true}
            />
            <Button
                title="Login"
                onPress={getAccount}
            />
        </View>
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        alignContent: "center",
        alignItems: "center",
        paddingLeft: "20%",
        paddingRight: "20%",
        paddingTop: "10%"
    },
    title: {
        paddingBottom: "40%",
        fontSize: 16,
        fontWeight: "bold"
    }
})