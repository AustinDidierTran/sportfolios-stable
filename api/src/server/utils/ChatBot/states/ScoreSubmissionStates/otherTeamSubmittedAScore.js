const i18n = require('../../../../../i18n.config');
const { MESSENGER_QUICK_REPLIES } = require('../../../enums');
const {
  BASIC_CHATBOT_STATES,
  SCORE_SUBMISSION_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const { genQuickReply, genText } = require('../../response');
const State = require('../state');

class otherTeamSubmittedAScore extends State {
  async handleEvent(webhookEvent) {
    /*let nextState;
    const chatbotInfos = this.context.chatbotInfos;
    if (this.isYes(webhookEvent)) {
      try {
        const res = await acceptScoreSuggestion({
          id: chatbotInfos.suggestionId,
          submitted_by_roster: chatbotInfos.myRosterId,
          submitted_by_person: chatbotInfos.playerId,
        });
        if (!res) {
          throw 'error';
        }
        nextState =
          SCORE_SUBMISSION_CHATBOT_STATES.SPIRIT_SUBMISSION_REQUEST_SENT;
        delete chatbotInfos.suggestionId;
        delete chatbotInfos.submittedBy;
      } catch (e) {
        this.sendMessages(
          webhookEvent.sender.id,
          genText(
            i18n.__('An error happened, do you want to try again?'),
          ),
        );
      }
    } else if (this.isNo(webhookEvent)) {
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
    }*/
  }

  formatScore(scoreObj) {
    return Object.entries(scoreObj).reduce((acc, curr) => {
      const [name, score] = curr;
      return `${acc}${name}: ${score} `;
    }, '\n');
  }

  async getIntroMessages() {
    const chatbotInfos = this.context.chatbotInfos;
    //const score = this.formatScore(chatbotInfos.score);
    const submittedBy = chatbotInfos.submittedBy;
    const eventName = chatbotInfos.eventName;

    return {
      messages: [
        genText(
          i18n.__(
            '{{submittedBy}} submitted the following score for your game of the event {{eventName}}',
            { submittedBy, eventName },
          ),
        ),
      ],
      nextState:
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION_CONFIRMATION,
    };
  }
}

module.exports = otherTeamSubmittedAScore;
