import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

type Props = {
    message: string;
    onDismiss: () => void;
};

const CustomAlert: React.FC<Props> = ({ message, onDismiss }) => {
    const opacity = new Animated.Value(1);

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
        }).start(() => {
            onDismiss();
        });
    }, [message, onDismiss]);

    return (
        <Animated.View style={[styles.alertContainer, { opacity }]}>
            <Text style={styles.alertText}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    alertContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        padding: 15,
        backgroundColor: '#005bb5',
        borderRadius: 5,
        alignItems: 'center',
        zIndex: 1,
    },
    alertText: {
        color: 'white',
        fontSize: 16,
    },
});

export default CustomAlert;
