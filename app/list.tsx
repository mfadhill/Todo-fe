// DashboardScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, IconButton } from 'react-native-paper';

const List = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    const addTodo = () => {
        if (newTodo.length === 0) {
            Alert.alert('Error', 'Please enter a task');
            return;
        }

        setTodos([...todos, { id: Math.random().toString(), task: newTodo }]);
        setNewTodo('');
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
                <Paragraph>{item.task}</Paragraph>
                <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => deleteTodo(item.id)}
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
                <Button mode="contained" onPress={addTodo} style={styles.button}>
                    Add
                </Button>
            </View>

            <FlatList
                data={todos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
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
