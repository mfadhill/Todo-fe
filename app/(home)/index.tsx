import React from "react";
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Card, Title, Button } from "react-native-paper";
import axios from "axios";
import { AntDesign } from '@expo/vector-icons';
import { Link } from "expo-router";

interface Item {
    id: number;
    slug: string;
    url: string;
    title: string;
    content: string;
    image: string;
    thumbnail: string;
    status: string;
    category: string;
    publishedAt: string;
    updatedAt: string;
    userId: number;
}

const Home = () => {
    const [data, setData] = React.useState([]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get("https://fakestoreapi.com/products");
            console.log(response.data);

            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        fetchPosts();
    }, []);

    const numColumns = 4;

    const RenderItem = ({ item }: { item: Item }) => {
        return (
            <View style={{
                flex: 1,
                position: "relative",
                margin: 5,
            }} key={item.id}>
                <Link
                    href={{
                        pathname: '/detail/[id]',
                        params: { id: item.id },
                    }}>
                    <Card style={{
                        flex: 1,
                        aspectRatio: 1,
                    }}>
                        <Card.Cover source={{ uri: item.image }} style={{
                            marginBottom: 5,
                        }} />
                        <Card.Content>
                            <Title style={{
                                fontSize: 18,
                                marginBottom: 5,
                            }}>{item.title}</Title>
                        </Card.Content>
                    </Card>
                </Link>
            </View>
        );
    };

    // const handleDetailPress = (item) => {
    //     // Handle navigation to detail screen here
    // };

    return (
        <View style={styles.container}>
            <Text style={{
                fontSize: 24,
                textAlign: "center",
                marginVertical: 10,
            }}>Products</Text>
            <Text style={{ fontSize: 24, textAlign: "center", marginVertical: 10 }}>Products</Text>
            <FlatList
                data={data}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => <RenderItem item={item} />}
                numColumns={numColumns}
            // contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
};

// const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    // header: {
    //     fontSize: 24,
    //     textAlign: "center",
    //     marginVertical: 10,
    // },
    // flatListContent: {
    //     alignItems: "center",
    // },
    // item: {
    //     flex: 1,
    //     position: "relative",
    //     margin: 5,
    // },
    // card: {
    //     flex: 1,
    //     aspectRatio: 1, // Menetapkan rasio aspek untuk menjaga ukuran kartu tetap sama
    // },
    // image: {
    //     height: 200,
    //     resizeMode: "cover",
    // },
    // title: {
    //     fontSize: 18,
    //     marginBottom: 5,
    // },
});

export default Home;
