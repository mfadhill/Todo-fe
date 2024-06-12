// LoginScreen.js
import axios from 'axios';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const validate = () => {
        let valid = true;
        let newErrors = { email: '', password: '' };

        if (email.length === 0) {
            newErrors.email = 'Email is required';
            valid = false;
        }

        if (password.length === 5) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleLogin = async () => {
        if (validate()) {
            try {
                const login = await axios.post('http://localhost:3000/auth/login', { email, password });
                console.log(login);
                router.push('/list');
            } catch (error) {
                console.log(error);
            }
            console.log('Logging in:', { email, password });
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Title style={styles.title}>Login</Title>

                <View style={styles.inputContainer}>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        mode="outlined"
                        keyboardType="email-address"
                        error={!!errors.email}
                    />
                    <HelperText type="error" visible={!!errors.email}>
                        {errors.email}
                    </HelperText>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        mode="outlined"
                        secureTextEntry
                        error={!!errors.password}
                    />
                    <HelperText type="error" visible={!!errors.password}>
                        {errors.password}
                    </HelperText>
                </View>

                <Button mode="contained" onPress={handleLogin} style={styles.button}
                >
                    Login
                </Button>
            </ScrollView>
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        alignItems: 'center', // Align items to the center
    },
    input: {
        width: '50%', // Set width to 50% of the screen
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
        alignSelf: 'center', // Align button to the center
    },
});

export default Login;
