import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { AuthContext } from '../lib/AuthContext';

const User = ({ isVisible, closeModal }) => {
    const { user, instaToken, signOut } = useContext(AuthContext);

    console.log(user);

    // Function to render the icon based on the provider
    const renderIcon = () => {
        switch (user.app_metadata.providers.join(', ')) {
            case 'google':
                return <FontAwesome5 name="google" size={24} color="gray" />;
            case 'facebook':
                return <FontAwesome5 name="facebook" size={24} color="gray" />;
            case 'apple':
                return <FontAwesome5 name="apple" size={24} color="gray" />;
            default:
                <FontAwesome name="user" size={24} color="gray" />
        }
    };



    return (
        <Modal
            isVisible={isVisible}
            swipeDirection={['down']}
            onSwipeComplete={closeModal}
            onBackdropPress={closeModal}
            style={styles.modal}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
                {user && (

                    <View style={styles.content}>
                        <Text style={styles.title}>User Account</Text>
                        <Image source={{ uri: user.user_metadata.avatar_url }} style={styles.profileImage} />
                        <Text style={styles.text}>Name: {user.user_metadata.full_name}</Text>
                        <Text style={styles.text}>Email: {user.email}</Text>
                        <Text style={styles.text}>Authenticated with: {renderIcon()} {user.provider}</Text>
                        <Text style={styles.text}>Instagram Linked: {instaToken ? 'Yes' : 'No'}</Text>
                        <TouchableOpacity style={styles.logoutButton} onPress={() => { signOut(); closeModal(); }}>
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>

                    </View>
                )}

            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        marginTop: 80,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 16,
        color: 'blue',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        padding: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    logoutButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default User;
