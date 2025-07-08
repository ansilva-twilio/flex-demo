const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [
  { key: 'ConversationSid', purpose: 'sid of the conversation' },
  { key: 'Identity', purpose: 'sender identity' },
  { key: 'ContentSid', purpose: 'sid of the Content Template' }
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const client = context.getTwilioClient();
  const { Identity, ConversationSid, ContentSid, ContentVariables } = event;

  if (!Identity || !ContentSid || !ConversationSid) {
    return callback(null, {
      success: false,
      message: 'Missing required parameters: ConversationSid, Identity and ContentSid are required.'
    });
  }

  try {
    const messageParams = {
      contentSid: ContentSid,
      contentVariables: ContentVariables,
      identity: Identity
    };

    if (ContentVariables) {
      try {
        messageParams.contentVariables = typeof ContentVariables === 'string'
          ? JSON.parse(ContentVariables)
          : ContentVariables;
      } catch (err) {
        return callback(null, {
          success: false,
          message: 'ContentVariables must be valid JSON.'
        });
      }
    }

    await client.conversations.v1.conversations(ConversationSid)
      .messages
      .create(messageParams);

    response.setStatusCode(200);
    response.setBody(extractStandardResponse({
      success: true,
      message: 'Content message sent successfully.',
      conversationSid: ConversationSid
    }));

    return callback(null, response);
  } catch (error) {
    response.setStatusCode(500);
    response.setBody(extractStandardResponse({
      success: false,
      message: error.message,
      conversationSid: ConversationSid
    }));

    return callback(error, response);
  }
});
