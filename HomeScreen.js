//HomeScreen.js
import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { auth, db } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot, } from 'firebase/firestore';

export default function HomeScreen() {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);

    const tasksRef = collection(db, "tasks");

    //Ler em tempo real
    useEffect(() => {
        const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
            const list = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTasks(list)
        });

        return () => unsubscribe();
    }, []);

    //Criar
    const addTask = async () => {
        if (task.trim()) {
            await addDoc(tasksRef, {
                text: task,
                createdAt: new Date(),
                user: auth.currentUser?.uid,
            });
            setTask("");
        }
    };

    // Atualizar
    const updateTask = async (id, newText) => {
        const taskDoc = doc(db, "tasks", id);
        await updateDoc(taskDoc, { text: newText});
    };

    //Deletar
    const deleteTask = async (id) => {
        const taskDoc = doc(db, "tasks", id);
        await deleteDoc(taskDoc);
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Minhas Tarefas</Text>

            <TextInput
                placeholder='Nova tarefa'
                value={task}
                onChangeText={setTask}
                style={{
                    borderWidth: 1,
                    marginVertical: 10,
                    padding: 8,
                }}
            />
            <Button title='Adicionar' onPress={addTask} />

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={ ({ item }) => (
                    <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginVertical: 5,
                    }}
                    >
                        <Text>{item.text}</Text>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            <Button title="Editar" onPress={ () => updateTask(item.id, "Novo texto")} />
                            <Button title="Excluir" onPress={ () => deleteTask(item.id)} />
                        </View>
                    </View>
                )}
            />
        </View>
    );
}