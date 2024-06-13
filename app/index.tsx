// LoginScreen.js
import axios from 'axios';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Image } from 'react-native';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';


const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
    });

    const validate = () => {
        let valid = true;
        let newErrors = { username: '', email: '', password: '', confirmPassword: '' };

        if (username.length === 0) {
            newErrors.username = 'Username is required';
            valid = false;
        }

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


    const handleRegister = async () => {
        if (validate()) {
            try {
                // const register = await axios.post('http://localhost:3000/auth/register',
                const register = await axios.post('http://192.168.18.30:3000/auth/register',
                    { username, email, password });
                console.log(register);
                router.push('/login');
            } catch (error) {
                console.log(error);
            }
            console.log('Logging in:', { username, email, password });
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Image source={require('../assets/images/1.jpg')} style={styles.logo} />
                <Title style={styles.title}>Register</Title>

                <View style={styles.inputContainer}>
                    <TextInput
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        style={styles.input}
                        mode="outlined"
                        error={!!errors.username}
                    />
                    <HelperText type="error" visible={!!errors.username}>
                        {errors.username}
                    </HelperText>
                </View>

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
                <Button mode="contained" onPress={handleRegister} style={styles.button}
                >
                    Register
                </Button>
                <Link href="/login" style={styles.button}>
                    <Title> you have account, Login </Title>
                </Link>
            </ScrollView>
        </KeyboardAvoidingView>
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
        width: '100%', // Set width to 50% of the screen
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
        width: '100%',
        alignSelf: 'center', // Align button to the center
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: 'center',
    },
});

export default Register;