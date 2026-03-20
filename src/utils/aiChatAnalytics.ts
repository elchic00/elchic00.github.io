/**
 * AI Chat Analytics - Google Analytics 4 tracking for AI chat interactions
 * 
 * Tracks chat engagement without capturing PII (no message content)
 * Only metadata: message length categories, action types, counts
 */

import { trackEvent } from './analytics';

// Message length categories for privacy-preserving analytics
const getMessageLengthCategory = (length: number): 'short' | 'medium' | 'long' => {
  if (length <= 50) return 'short';
  if (length <= 150) return 'medium';
  return 'long';
};

// Response time buckets for performance tracking
const getResponseTimeBucket = (ms: number): string => {
  if (ms < 1000) return '<1s';
  if (ms < 3000) return '1-3s';
  if (ms < 5000) return '3-5s';
  if (ms < 10000) return '5-10s';
  return '>10s';
};

/**
 * Track when user opens the AI chat
 * @param isFirstTime - Whether this is the user's first time opening chat this session
 * @param messageCount - Number of messages in history (0 for new users)
 */
export const trackChatOpened = (isFirstTime: boolean, messageCount: number): void => {
  trackEvent('ai_chat_opened', {
    event_category: 'ai_chat',
    event_label: isFirstTime ? 'first_open' : 'return_user',
    value: messageCount,
  });
};

/**
 * Track when user sends a message
 * @param messageLength - Character count of the message
 * @param messageNumber - Which message this is in the conversation (1-indexed)
 */
export const trackMessageSent = (messageLength: number, messageNumber: number): void => {
  const lengthCategory = getMessageLengthCategory(messageLength);
  
  trackEvent('ai_chat_message_sent', {
    event_category: 'ai_chat',
    event_label: lengthCategory,
    value: messageNumber,
    custom_parameter_1: lengthCategory,
  });
};

/**
 * Track when AI response is received
 * @param success - Whether the response was successful
 * @param responseTimeMs - Time taken to receive response
 * @param hasActions - Whether the response includes action buttons
 */
export const trackResponseReceived = (
  success: boolean,
  responseTimeMs: number,
  hasActions: boolean
): void => {
  const timeBucket = getResponseTimeBucket(responseTimeMs);
  
  trackEvent('ai_chat_response_received', {
    event_category: 'ai_chat',
    event_label: success ? 'success' : 'error',
    value: Math.round(responseTimeMs),
    custom_parameter_1: timeBucket,
    custom_parameter_2: hasActions ? 'with_actions' : 'text_only',
  });
};

/**
 * Track when user clicks a suggested question
 * @param questionIndex - Index of the clicked suggestion (0-based)
 * @param totalSuggestions - Total number of suggestions shown
 */
export const trackSuggestionClicked = (questionIndex: number, totalSuggestions: number): void => {
  trackEvent('ai_chat_suggestion_clicked', {
    event_category: 'ai_chat',
    event_label: `suggestion_${questionIndex + 1}_of_${totalSuggestions}`,
    value: questionIndex + 1,
  });
};

/**
 * Track when user clicks a quick action button
 * @param actionType - The action identifier (e.g., 'view_projects', 'contact_form')
 */
export const trackQuickActionClicked = (actionType: string): void => {
  trackEvent('ai_chat_quick_action', {
    event_category: 'ai_chat',
    event_label: actionType,
    value: 1,
  });
};

/**
 * Track when AI triggers an action (via action buttons in response)
 * @param actionType - The action identifier
 */
export const trackActionTriggered = (actionType: string): void => {
  trackEvent('ai_chat_action_triggered', {
    event_category: 'ai_chat',
    event_label: actionType,
    value: 1,
  });
};

/**
 * Track API errors
 * @param errorType - Type of error (e.g., 'network', 'timeout', 'api_error')
 */
export const trackChatError = (errorType: string): void => {
  trackEvent('ai_chat_error', {
    event_category: 'ai_chat',
    event_label: errorType,
    value: 1,
  });
};

/**
 * Track when user clears the chat history
 * @param messageCount - Number of messages before clearing
 */
export const trackChatCleared = (messageCount: number): void => {
  trackEvent('ai_chat_cleared', {
    event_category: 'ai_chat',
    event_label: 'user_cleared',
    value: messageCount,
  });
};

/**
 * Track chat session metrics when chat is closed
 * @param messagesExchanged - Total messages in conversation
 * @param sessionDurationMs - How long chat was open
 * @param userMessagesCount - Number of messages sent by user
 */
export const trackChatSessionEnd = (
  messagesExchanged: number,
  sessionDurationMs: number,
  userMessagesCount: number
): void => {
  const durationMinutes = Math.round(sessionDurationMs / 60000 * 10) / 10; // 1 decimal place
  
  trackEvent('ai_chat_session_end', {
    event_category: 'ai_chat',
    event_label: userMessagesCount > 0 ? 'engaged' : 'bounced',
    value: messagesExchanged,
    custom_parameter_1: `${durationMinutes}min`,
    custom_parameter_2: userMessagesCount,
  });
};
