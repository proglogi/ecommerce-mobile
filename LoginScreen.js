// LoginScreen.js
import React, { useState } from "react";
import { TextInput, Button, View, Text } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate('Home');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <View>
            <Text>Login</Text>
            {error ? <Text>{error}</Text> : null}
            <TextInput
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Senha"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Entrar" onPress={handleLogin}/>
        </View>
    );
}