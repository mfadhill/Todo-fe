import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
}

export default function Detail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = React.useState<Product>({} as Product);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        fetchProduct();
    }, []);

    return (
        <View style={styles.container}>
            <Image source={{ uri: data.image }} style={styles.image} />
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.price}>${data.price}</Text>
                <Text style={styles.description}>{data.description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row', // Display items horizontally
        backgroundColor: '#fff',
        padding: 20,
    },
    image: {
        width: '35%', // Occupy half of the horizontal space
        height: 300,
        resizeMode: 'cover',
        marginBottom: 20,
    },
    detailsContainer: {
        width: '50%', // Occupy the other half of the horizontal space
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    price: {
        fontSize: 20,
        color: 'green',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
    },
});
