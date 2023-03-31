import React from 'react';
import {ScrollView, View} from 'react-native';
import {observer} from 'mobx-react-lite';

import Clipboard from '@react-native-clipboard/clipboard';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {Message} from 'revolt.js';

import {ContextButton, app} from '../../Generic';
import {ReplyMessage} from '../../MessageView';
import {currentTheme, styles} from '../../Theme';
import {Text} from '../common/atoms';

export const MessageMenuSheet = observer(
  ({state, message}: {state: any; message: Message}) => {
    return (
      <>
        <ReplyMessage message={message} style={{margin: 3, width: '100%'}} />
        <ScrollView style={{flex: 1, padding: 3}}>
          <ContextButton
            onPress={() => state.setState({contextMenuMessage: null})}>
            <View style={styles.iconContainer}>
              <AntIcon
                name="closecircle"
                size={16}
                color={currentTheme.foregroundPrimary}
              />
            </View>
            <Text>Close</Text>
          </ContextButton>
          {message?.channel?.havePermission('SendMessage') ? (
            <ContextButton
              onPress={() => {
                let replyingMessages = [...app.getReplyingMessages()];
                if (
                  replyingMessages.filter(m => m.message._id === message._id)
                    .length > 0
                ) {
                  return;
                }
                if (replyingMessages.length >= 5) {
                  return;
                }
                if (app.getEditingMessage()) {
                  return;
                }
                replyingMessages.push({
                  message: message,
                  mentions: false,
                });
                app.setReplyingMessages(replyingMessages);
                state.setState({contextMenuMessage: null});
              }}>
              <View style={styles.iconContainer}>
                <MaterialIcon
                  name="reply"
                  size={20}
                  color={currentTheme.foregroundPrimary}
                />
              </View>
              <Text>Reply</Text>
            </ContextButton>
          ) : null}
          {message.content ? (
            <ContextButton
              onPress={() => {
                Clipboard.setString(message.content!);
              }}>
              <View style={styles.iconContainer}>
                <FA5Icon
                  name="clipboard"
                  size={18}
                  color={currentTheme.foregroundPrimary}
                />
              </View>
              <Text>Copy content</Text>
            </ContextButton>
          ) : null}
          {app.settings.get('ui.showDeveloperFeatures') ? (
            <ContextButton
              onPress={() => {
                Clipboard.setString(message._id);
              }}>
              <View style={styles.iconContainer}>
                <FA5Icon
                  name="clipboard"
                  size={18}
                  color={currentTheme.foregroundPrimary}
                />
              </View>
              <Text>
                Copy ID{' '}
                <Text
                  style={{
                    fontSize: 12,
                    color: currentTheme.foregroundSecondary,
                  }}>
                  ({message?._id})
                </Text>
              </Text>
            </ContextButton>
          ) : null}
          {message?.channel?.havePermission('ManageMessages') ||
          message?.author?.relationship === 'User' ? (
            <ContextButton
              onPress={() => {
                message.delete();
                state.setState({contextMenuMessage: null});
              }}>
              <View style={styles.iconContainer}>
                <FA5Icon
                  name="trash"
                  size={18}
                  color={currentTheme.foregroundPrimary}
                />
              </View>
              <Text>Delete</Text>
            </ContextButton>
          ) : null}
          {message?.author?.relationship === 'User' ? (
            <ContextButton
              onPress={() => {
                app.setMessageBoxInput(message?.content);
                app.setEditingMessage(message);
                app.setReplyingMessages([]);
                state.setState({contextMenuMessage: null});
              }}>
              <View style={styles.iconContainer}>
                <FA5Icon
                  name="edit"
                  size={18}
                  color={currentTheme.foregroundPrimary}
                />
              </View>
              <Text>Edit</Text>
            </ContextButton>
          ) : null}
          {message?.author?.relationship !== 'User' ? (
            <ContextButton
              onPress={() => {
                app.openReportMenu(message, 'Message');
                state.setState({contextMenuMessage: null});
              }}>
              <View style={styles.iconContainer}>
                <FA5Icon
                  name="flag"
                  size={18}
                  color={currentTheme.foregroundPrimary}
                />
              </View>
              <Text>Report Message</Text>
            </ContextButton>
          ) : null}
          <View style={{marginTop: 7}} />
        </ScrollView>
      </>
    );
  },
);
