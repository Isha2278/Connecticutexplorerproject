import React, { useState, useContext } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../src/Style';
import User from '../src/User';
import { AuthContext } from '../lib/AuthContext';


export default function Header() {
    const { user } = useContext(AuthContext);

    const [showUserModal, setShowUserModal] = useState(false);
    
    const openUserModal = () => {
        setShowUserModal(true);
    };

    const closeModal = () => {
        setShowUserModal(false);
    };

    return (
        <>
            <View style={styles.CTExploredHeader}>
                <View style={styles.centerView}>
                    <Image source={require('../assets/CTExploredHorizonatal.png')} style={styles.headerImage} />
                </View>
                {user && (
                <TouchableOpacity onPress={openUserModal} style={styles.userButton}>
                    <FontAwesome name="user" size={28} color="gray" />
                </TouchableOpacity>
                )}
            </View>
            <User isVisible={showUserModal} closeModal={closeModal} />
        </>
    );
};

