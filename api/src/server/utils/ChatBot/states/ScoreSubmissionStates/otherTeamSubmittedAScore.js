const i18n = require('../../../../../i18n.config');
const { MESSENGER_QUICK_REPLIES } = require('../../../enums');
const { genQuickReply, genText } = require('../../response');
const State = require('../state');

class otherTeamSubmittedAScore extends State {
  async handleEvent(webhookEvent) {
    throw new Error('You need to implement the method handleEvent');
  }

  formatScore(scoreObj) {
    return (
      Object.entries(scoreObj).reduce((acc, curr) => {
        const [name, score] = curr;
        return `${acc}${name}: ${score} `;
      }, '\n') + '\n'
    );
  }

  async getIntroMessages() {
    const chatbotInfos = this.context.chatbotInfos;
    const score = formatScore(chatbotInfos.score);
    const submittedBy = chatbotInfos.submittedBy;
    const eventName = chatbotInfos.eventName;
    return {
      messages: [
        genText(
          i18n.__(
            '%s submitted the score: %s for your game of the event %s',
            submittedBy,
            score,
            eventName,
          ),
        ),
        genQuickReply(
          i18n.__('do you want to confirm?'),
          MESSENGER_QUICK_REPLIES.CONFIRMATION,
        ),
      ],
    };
  }
}

module.exports = otherTeamSubmittedAScore;
