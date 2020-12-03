const i18n = require('../../../../../i18n.config');
const { MESSENGER_QUICK_REPLIES } = require('../../../enums');
const {
  BASIC_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const { genQuickReply, genText } = require('../../response');
const State = require('../state');

class otherTeamSubmittedAScore extends State {
  async handleEvent(webhookEvent) {
    let nextState;
    if (this.isNo(webhookEvent)) {
      this.sendMessages(
        webhookEvent.sender.id,
        genText(i18n.__('ok_back_to_menu')),
      );
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else if (this.isStartOver(webhookEvent)) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      this.sendIDontUnderstand(webhookEvent);
    }
    if (nextState) {
      await this.context.changeState(nextState);
    }
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
    const score = this.formatScore(chatbotInfos.score);
    const submittedBy = chatbotInfos.submittedBy;
    const eventName = chatbotInfos.eventName;
    console.log({ submittedBy, score, eventName });
    return {
      messages: [
        genText(
          i18n.__(
            '{{submittedBy}} submitted the score: {{score}} for your game of the event {{eventName}}',
            { submittedBy, score, eventName },
          ),
        ),
        genQuickReply(
          i18n.__('Do you want to confirm?'),
          MESSENGER_QUICK_REPLIES.CONFIRMATION,
        ),
      ],
    };
  }
}

module.exports = otherTeamSubmittedAScore;
