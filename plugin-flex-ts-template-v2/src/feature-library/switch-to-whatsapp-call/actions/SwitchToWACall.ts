import { Manager, Notifications, TaskHelper } from '@twilio/flex-ui';
import { SwitchToWAVoiceNotification } from '../flex-hooks/notifications';
import * as settings from '../config';
import SendTemplateMessageService from '../utils/SendTemplateMessageService';

export const switchToWAVoice = async (payload: any) => {

  if (!TaskHelper.isCBMTask(payload.task)) {
    return Notifications.showNotification(SwitchToWAVoiceNotification.SwitchError);
  }

  try { 
    console.log('Switch to WA Call Action was invoked.');
    const manager = Manager.getInstance();
    const identity = manager.user.identity;

    const response = await SendTemplateMessageService.sendTemplateMessage(payload.task.attributes.conversationSid, identity, settings.getContentTemplateSid());
    console.log('Switch to WA Call Action Response: ', response);
    
    return Notifications.showNotification(SwitchToWAVoiceNotification.SwitchSuccess);
  } catch (error) {
    let message = (error as any)?.message;
    console.error(message);    
    return Notifications.showNotification(SwitchToWAVoiceNotification.SwitchError);
  }
};
