// DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert, Modal } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, IconButton, Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getList } from '@/api/call/getList'; // Ensure the correct import path
import { getName } from '@/api/call/getUser';

const List = () => {
    const [list, setList] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editTodo, setEditTodo] = useState(null);
    const [username, setUsername] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editContent, setEditContent] = useState('');

    const getData = async () => {
        try {
            const res = await getList();
            console.log(res?.data);
            setList(res?.data.map(item => ({ ...item, checked: false }))); // Initialize checked state
        } catch (error) {
            console.log(error);
        }
    }

    const getUsers = async () => {
        try {
            const res = await getName();
            console.log(res?.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const data = await axios.get('http://192.168.18.111:3000/auth/detail', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setUsername(data.data.username);
                console.log(data.data);
            } else {
                console.log('Please login first');
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getData();
        getUser();
    }, []);

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
                setNewTodo(''); // Clear input after adding
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
                getData();
            } else {
                console.log('Please login first');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateList = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                await axios.patch(`http://192.168.18.111:3000/list/${editTodo.id}`, { content: editContent }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log(editTodo);
                setModalVisible(false);
                setEditTodo(null);
                setEditContent('');
                getData(); // Refresh the list
            } else {
                console.log('Please login first');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const openEditModal = (item) => {
        setEditTodo(item);
        setEditContent(item.content);
        setModalVisible(true);
    }

    const toggleCheckbox = async (id: string, status: boolean) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                await axios.patch(`http://192.168.18.111:3000/list/${id}`, { status: !status }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                getData();
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

                <Paragraph style={data.status ? styles.checkedText : null}>{data.content}</Paragraph>
                <View style={styles.cardActions}>
                    <Checkbox
                        status={data.status ? 'checked' : 'unchecked'}
                        onPress={() => toggleCheckbox(data.id, data.status)}
                    />
                    <IconButton
                        icon="pencil"
                        size={20}
                        onPress={() => openEditModal(data)}
                    />
                    <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => deleteTodo(data.id)}
                    />
                </View>
            </Card.Content>
        </Card>
    );

    // console.log(username);

    return (
        <View style={styles.container}>
            <Title style={styles.title}>To-Do List</Title>

            <Title>Hello, {username}</Title>
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
                keyExtractor={(_, index) => index.toString()}
                style={styles.list}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <TextInput
                            label="Edit Task"
                            value={editContent}
                            onChangeText={setEditContent}
                            style={styles.input}
                            mode="outlined"
                        />
                        <View style={styles.buttonContainer}>
                            <Button mode="contained" onPress={updateList} style={styles.button}>
                                Update
                            </Button>
                            <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.button}>
                                Cancel
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    checkbox: {

    },
    buttonContainer: {
        marginTop: 16,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between',
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
        height: 40,
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
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    checkedText: {
        textDecorationLine: 'line-through',
    },
});

export default List;
