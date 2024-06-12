// DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getList } from '@/api/call/getList'; // Ensure the correct import path

const List = () => {
    const [list, setList] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    const getData = async () => {
        try {
            const res = await getList();
            console.log(res?.data);
            setList(res?.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    console.log(list);

    const addList = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            console.log(token);

            if (token) {
                await axios.post('http://192.168.18.111:3000/list', { content: newTodo }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setNewTodo(''); // Clear the input field
                getData(); // Refresh the list
            } else {
                console.log('Please login first');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteTodo = async (id: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                await axios.delete(`http://192.168.18.111:3000/list/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                getData(); // Refresh the list
            } else {
                console.log('Please login first');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const RenderItem = ({ data }) => (
        <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
                <Paragraph>{data.content}</Paragraph>
                <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => deleteTodo(data.id)}
                />
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Title style={styles.title}>To-Do List</Title>

            <View style={styles.inputContainer}>
                <TextInput
                    label="New Task"
                    value={newTodo}
                    onChangeText={setNewTodo}
                    style={styles.input}
                    mode="outlined"
                />
                <Button mode="contained" onPress={addList} style={styles.button}>
                    Add
                </Button>
            </View>

            <FlatList
                data={list}
                renderItem={({ item }) => <RenderItem data={item} />}
                keyExtractor={(item) => item.id.toString()}
                style={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        textAlign: 'center',
        marginVertical: 16,
        fontSize: 28,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        marginRight: 8,
    },
    button: {
        paddingHorizontal: 16,
    },
    list: {
        flex: 1,
    },
    card: {
        marginVertical: 4,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default List;
