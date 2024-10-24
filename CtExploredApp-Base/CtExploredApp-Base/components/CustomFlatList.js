import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet, FlatList, StatusBar, Platform } from 'react-native';

const CustomFlatList = ({ title, data, navigation, navigateTo }) => {
    const handleItemPress = (item) => {   
        console.log("status bar" + StatusBar.currentHeight);
        console.log("platform " + Platform.OS)

        console.log(item);
        console.log(navigateTo);
        navigation.navigate(navigateTo, { item }); 
    };


    const screenWidth = Dimensions.get('window').width;
    const numColumns = screenWidth > 600 ? 2 : 1;

    return (
        <View style={styles.flatListContainer}>
            <FlatList
                data={data}
                ListHeaderComponent={<Text style={styles.mainTitle}>{title}</Text>}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleItemPress(item)}>
                        <View style={styles.card}>
                            <Image source={{ uri: item.imageUrl }} style={styles.image} />
                            <Text style={styles.title}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    flatListContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#fcfcfc",
    },
    card: {
        margin: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 325,
        height: 200,
        margin: 10,
        resizeMode: 'cover',
        borderRadius: 6
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    mainTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 20
    }
});

export default CustomFlatList;
