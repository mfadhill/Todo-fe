import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

const AlertComponent = () => {
    return (
        <AlertNotificationRoot>
            <View style={styles.container}>
                {/* Dialog Box */}
                <Button
                    title={'Show Dialog Box'}
                    onPress={() =>
                        Dialog.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: 'Success',
                            textBody: 'Register Success',
                            button: 'close',
                        })
                    }
                />

                {/* Toast Notification */}
                <Button
                    title={'Show Toast Notification'}
                    onPress={() =>
                        Toast.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: 'Success',
                            textBody: 'Congrats! This is a toast notification success.',
                        })
                    }
                />
            </View>
        </AlertNotificationRoot>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AlertComponent;
