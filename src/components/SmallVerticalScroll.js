const { ScrollView } = require("react-native")

const SmallVerticalScroll = (props) => {
    const { width, height } = useWindowDimensions()

    return (
        <ScrollView>
            {props.data.map((el, i) => {
                return (
                    
                )
            })}
        </ScrollView>
    )
}