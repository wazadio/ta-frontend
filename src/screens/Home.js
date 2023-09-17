import { Button } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

const Home = ({navigation, route}) => {
    const { width, height } = useWindowDimensions()
    const [balance, setBalance] = useState()

    const getBalance = async () => {
        const response = await fetch("http://10.44.9.49:8020/balance", {
            method: "GET",
            headers: {
                "address": route.params.address
            }
        })

        const body = await response.json()
        console.log(body)
        setBalance(body.balance)
    }

    useEffect(() => {
        getBalance()
    }, [])

    return (
        <View style={styles.container}>
            <Text>{route.params.name}</Text>
            <Text>{route.params.address}</Text>
            <Text>ETH: {balance}</Text>

            <Button
                title="Minta Tanda Tangan"
            />
            <Button
                title="Beri Tanda Tangan"
            />
            <Button
                title="Validasi Tanda Tangan"
            />
            <Button
                title="Faucet"
            />
        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        padding: "5%",
        alignItems: "center"
    }
})