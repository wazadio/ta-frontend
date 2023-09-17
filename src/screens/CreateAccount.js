import { Button, Input, Text } from '@rneui/themed'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
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

const CreateAccount = ({navigation, route}) => {
    const [nama, setNama] = useState("")
    const [password, setPassword] = useState("")
    const [created, setCreated] = useState(false)
    const [mnemonic, setMnemonic] = useState("")

    const createAccount = async () => {
        try {
            const response = await fetch("http://10.44.9.49:8020/create-account", {
                method: "POST",
                body: JSON.stringify({})
            })
            const body = await response.json()
            console.log(body)
            console.log(nama)
            console.log(password)
            setMnemonic(body.mnemonic)

            const encrypted = CryptoJS.AES.encrypt(body.private_key, password).toString()
            // console.log(typeof encrypted)
            // const decrypted = CryptoJS.AES.decrypt(encrypted, password+"1")
            // const originalText = decrypted.toString(CryptoJS.enc.Utf8);
            // console.log(originalText)

            await db.transaction(async (tx) => {
                await tx.executeSql(
                    `
                        INSERT INTO account (address, name, private_key)
                        VALUES (?, ?, ?)
                    `,
                    [body.address, nama, encrypted],
                    () => console.log("new account created"),
                    error => console.log(error)
                )
            })

            setCreated(true)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>BUAT AKUN</Text>
            {
                created ? 
                <>
                    <Text style={styles.textArea}>{mnemonic}</Text>
                    <Text>Simpanlah passphrase diatas dengan aman</Text>
                    <Button
                        title="MASUK"
                        onPress={() => navigation.replace("AccountList")}
                        style={styles.buttonLogin}
                    />
                </>
                : <>
                    <Input
                        placeholder='nama'
                        onChangeText={value => setNama(value)}
                    />
                    <Input
                        placeholder='password'
                        onChangeText={value => setPassword(value)}
                    />
                    <Button
                        title="SUBMIT"
                        onPress={() => createAccount()}
                    />
                </>
            }
        </View>
    )
}

export default CreateAccount;

const styles = StyleSheet.create({
    container: {
        alignContent: "center",
        alignItems: "center",
        padding: "5%"
    },
    textArea: {
        width: "80%",
        height: "40%",
        backgroundColor: "grey",
    },
    title: {
        paddingBottom: "10%"
    },
    buttonLogin: {
        position: "absolute",
    }
})