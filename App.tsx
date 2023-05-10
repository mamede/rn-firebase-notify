import { useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import notifee, { AndroidImportance, EventType, TimestampTrigger, TriggerType } from '@notifee/react-native';

export default function App() {

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch(type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification');
          break;
        case EventType.ACTION_PRESS:
          console.log('User pressed an action', detail.notification);
          break;
        case EventType.DELIVERED:
          console.log('Notification delivered to device');
          break;
      }
    });
  }, [])

  useEffect(() => {
    return notifee.onBackgroundEvent( async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('User pressed notification', detail.notification);
      }

    });
  }, [])

  async function createChannelId() {
    const channelId = await notifee.createChannel({
      id: 'android-default',
      name: 'Default Android Channel',
      vibration: true,
      importance: AndroidImportance.HIGH,
    });

    return channelId;
  }

  async function displayNotification() {
    await notifee.requestPermission();
    const channelId = await createChannelId();

    // Display a notification
    await notifee.displayNotification({
      id: '2',
      title: 'Notification Title with <strong>HTML</strong> support 🚀',
      body: 'Main body content of the notification <span style="color: red;">with HTML support 😍</span>',
      android: { channelId },
    });
  }

  async function updateNotification() {
    await notifee.requestPermission();
    const channelId = await createChannelId();

    // Display a notification
    await notifee.displayNotification({
      id: '2',
      title: '<strong>HTML</strong> support 🚀',
      body: 'notification <span style="color: red;">with HTML support 😍</span>',
      android: { channelId },
    });
  }

  async function cancelNotification() {
    // Também serve para deletar notificação agendada passando o id
    await notifee.cancelNotification('2');
  }

  async function scheduleNotification() {
    const date = new Date(Date.now() + 10000);

    date.setMinutes(date.getMinutes() + 1);

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    }

    const channelId = await createChannelId();

    await notifee.createTriggerNotification({
      title: 'Scheduled Notification',
      body: 'This notification was scheduled',
      android: { 
        channelId,
        importance: AndroidImportance.HIGH,
      },
    }, trigger);
  }

  function listScheduledNotifications() {
    notifee.getTriggerNotificationIds().then(ids => console.log(ids));
  }

  return (
    <View style={styles.container}>
      <Text>Local Notifications</Text>

      <View style={styles.top}>
        <Button title="Enviar Notificação" onPress={displayNotification} />
      </View>

      <View style={styles.top}>
        <Button title="Atulizar Notificação" onPress={updateNotification} />
      </View>

      <View style={styles.top}>
        <Button title="Cancelar Notificação" onPress={cancelNotification} />
      </View>

      <View style={styles.top}>
        <Button title="Agendar Notificação" onPress={scheduleNotification} />
      </View>

      <View style={styles.top}>
        <Button title="Listar Notificações Agendadas" onPress={listScheduledNotifications} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    marginTop: 10,
  }
});
