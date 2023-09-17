const { Text } = require("@rneui/base")
const { Input, Button } = require("@rneui/themed")
const { useState } = require("react")
const { View, TextInput, Alert } = require("react-native")
const CryptoJS = require("crypto-js")
import SQLite from 'react-native-sqlite-storage'

const db = SQLite.openDatabase(
    {
        name: "TaDB",
        location: "default"
    },
    () => {},
    error => {console.log(error)}
)

const ImportAccount = ({navigation, route}) => {
    const [mnemonic, setMnemonic] = useState("")
    const [password, setPassword] = useState("")
    const [nama, setNama] = useState("")
    
    const importAccount = async () => {
        try {
            const response = await fetch("http://10.44.9.49:8020/import-account", {
                method: "POST",
                body: JSON.stringify({
                    mnemonic,
                })
            })
            const body = await response.json()
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

            Alert.alert("Berhasil", "Import Akun Berhasil", [
                {
                    text: "Login",
                    onPress: () => {
                        navigation.replace("AccountList")
                    }
                }
            ])
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View>
            <Text>IMPORT AKUN</Text>
            <TextInput
                placeholder="masukkan passphrase 12 kata anda"
                editable
                multiline
                onChangeText={value => setMnemonic(value)}
            />
            <Input
                placeholder='nama'
                onChangeText={value => setNama(value)}
            />
            <Input
                placeholder='password'
                onChangeText={value => setPassword(value)}
            />
            <Button
                title="IMPORT"
                onPress={() => importAccount()}
            />
        </View>
    )
}

export default ImportAccount;