import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { FetchedReservation } from '../../../types/serverless/twilio-api';
import logger from '../../../utils/logger';

interface SendTemplateMessageResponse {
  success: boolean;
  conversationSid: string;
  message?: string;
}

class SendTemplateMessageService extends ApiService {
  sendTemplateMessage = async (conversationSid: string, identity: string, contentSid: string, contentVariables: string = ''): Promise<SendTemplateMessageResponse> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      ConversationSid: encodeURIComponent(conversationSid),
      Identity: encodeURIComponent(identity),
      ContentSid: encodeURIComponent(contentSid),
      ContentVariables: encodeURIComponent(contentVariables)
    };
    try {
      const response = await this.fetchJsonWithReject<SendTemplateMessageResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/switch-to-whatsapp-call/flex/send-template`,
        {
          method: 'post',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
      return response;
    } catch (error: any) {
      logger.error('[switch-to-whatsapp-call] Error sending template', error);
      // eslint-disable-next-line no-throw-literal
      throw { error };
    }
  };
}

export default new SendTemplateMessageService();
