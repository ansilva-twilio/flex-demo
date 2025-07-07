import { getFeatureFlags } from '../../utils/configuration';
import SwitchToWhatsappCallConfig from './types/ServiceConfiguration';

const { enabled = false, contentTemplateSid = ''} = (getFeatureFlags()?.features?.switch_to_whatsapp_call as SwitchToWhatsappCallConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getContentTemplateSid = () => {
  return contentTemplateSid;
}
