import { Card, Divider } from '@rneui/themed'
import { useEffect, useState } from 'react'
import { Text, View, useWindowDimensions, ScrollView, Button, StyleSheet, TouchableHighlight } from 'react-native'
import SQLite from 'react-native-sqlite-storage'

const db = SQLite.openDatabase(
    {
        name: "TaDB",
        location: "default"
    },
    () => {},
    error => {console.log(error)}
)

const AccountScreen = ({navigation}) => {
    const [accounts, setAccounts] = useState([])
    const { width, height } = useWindowDimensions()

    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `
                    CREATE TABLE IF NOT EXISTS
                    account
                    (ID INTEGER PRIMARY KEY AUTOINCREMENT, address TEXT, name TEXT, private_key TEXT)
                `,
                [],
                console.log("database created")
            )
        })
    }

    const getAccount = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `
                    SELECT *
                    FROM account
                `,
            [],
            (tx, result) => {
                setAccounts(result.rows.raw().map(row => {return [row.id, row.address, row.name, row.private_key]}))
                console.log("accounts =")
                console.log(accounts)
            }
            )
        })
    }

    const createAccount = () => {
        navigation.navigate("CreateAccount")
    }

    const importAccount = () => {
        navigation.navigate("ImportAccount")
    }

    useEffect(() => {
        createTable()
        getAccount()
    }, [navigation])

    return (
        <View style={styles({width, height}).container}>
            <Text style={styles(width, height).title}>PILIH AKUN</Text>
            <View style={styles(width, height).list}>
                <ScrollView>
                    {accounts.map((account, index) => {
                        return (
                            <TouchableHighlight key={index} onPress={() => navigation.navigate("Login", {address: account[1], name: account[2]})}>
                                <Card>
                                    <Card.Title>{account[2]}</Card.Title>
                                    <Text>{account[1]}</Text>
                                </Card>
                            </TouchableHighlight>
                        )
                    })}
                </ScrollView>
            </View>
            <View style={styles(width, height).button}>
                <Button
                    title='BUAT AKUN'
                    onPress={() => createAccount()}
                />
            </View>
            <Divider/>
            <View style={styles(width, height).button}>
                <Button
                    title='IMPORT AKUN'
                    onPress={() => importAccount()}
                />
            </View>
        </View>
    )
} 

export default AccountScreen;

const styles = (props) => StyleSheet.create({
    container: {
        alignContent: "center",
        alignItems: "center",
        flex: 1
    },
    title: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold"
    },
    list: {
        width: "80%",
        height: "80%",
        alignContent: "center"
    },
    button: {
        width: "30%",
        borderRadius: 5,
        paddingTop: "5%"
    }
})