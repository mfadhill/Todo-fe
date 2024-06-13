import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Modal, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Card, Paragraph, IconButton, Checkbox, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getList } from '@/api/call/getList'; // Ensure the correct import path
import { getName } from '@/api/call/getUser';
import { router } from 'expo-router';

const List = () => {
    const [list, setList] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editTodo, setEditTodo] = useState(null);
    const [username, setUsername] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    // const [showUpdate, setUpdate] = useState(false);

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

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token'); // Clear the token
            router.replace('login'); // Navigate to login screen
        } catch (error) {
            console.log(error);
        }
    }

    const RenderItem = ({ data }) => (
        <Card style={styles.card} >
            <Card.Content style={styles.cardContent}>
                <Paragraph style={data.status ? styles.checkedText : null}>{data.content}</Paragraph>
                <View style={styles.cardActions}>
                    <Checkbox
                        theme={{ colors: { primary: '#0000FF' } }}
                        status={data.status ? 'checked' : 'unchecked'}
                        onPress={() => toggleCheckbox(data.id, data.status)}
                        color="#0000FF"
                        uncheckedColor="black"
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

    return (
        <View style={styles.container}>
            <Title style={styles.title}>To-Do List</Title>
            <View style={styles.header}>
                <Title>Hello, {username}</Title>
                <Button mode="contained" onPress={() => setLogoutModalVisible(true)} style={styles.logoutButton}>
                    Logout
                </Button>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    label="New Task"
                    value={newTodo}
                    onChangeText={setNewTodo}
                    style={styles.input}
                    mode="outlined"
                />
                <Button mode="contained" disabled={!newTodo} onPress={addList} style={styles.button} buttonColor="#DC143C">
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
                <KeyboardAvoidingView
                    behavior={Platform.OS === "android" ? "padding" : "height"}
                    style={styles.modalOverlay}
                    keyboardVerticalOffset={100}
                >
                    <View style={styles.modalView}>
                        <TextInput
                            label="Edit Task"
                            value={editContent}
                            onChangeText={setEditContent}
                            style={{ height: 40, width: '100%' }}
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
                </KeyboardAvoidingView>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={logoutModalVisible}
                onRequestClose={() => {
                    setLogoutModalVisible(!logoutModalVisible);
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "android" ? "padding" : "height"}
                    style={styles.modalOverlay}
                    keyboardVerticalOffset={100}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Are you sure you want to logout?</Text>
                        <View style={styles.buttonContainer}>
                            <Button mode="contained" onPress={logout} style={styles.button}>
                                Yes
                            </Button>
                            <Button mode="outlined" onPress={() => setLogoutModalVisible(false)} style={styles.button}>
                                No
                            </Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
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
        marginTop: 40,
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
        width: '100%',
        // height: 40,
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
    modalText: {
        fontSize: 18,
        marginBottom: 16,
    },
    logoutButton: {
        marginTop: 20,
        width: 'auto',
    },
});

export default List;
