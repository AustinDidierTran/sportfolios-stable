const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  BASIC_CHATBOT_STATES,
} = require('../../../../../../../common/enums');
const { MESSENGER_QUICK_REPLIES } = require('../../../enums');
const i18n = require('../../../../../i18n.config');
const Response = require('../../response');
const {
  addSpiritSubmission,
} = require('../../../../../db/helpers/entity');
const { ERROR_ENUM } = require('../../../../../../../common/errors');

class AwaitingSpiritSubmissionConfirmation extends State {
  async handleEvent(webhookEvent) {
    let nextState;
    if (this.isYes(webhookEvent)) {
      const chatbotInfos = this.context.chatbotInfos;
      //TODO SAVE Spirit
      try {
        const spirit = {
          submitted_by_roster: chatbotInfos.myRosterId,
          submitted_by_person: chatbotInfos.playerId,
          game_id: chatbotInfos.gameId,
          submitted_for_roster:
            chatbotInfos.opponentTeams[0].rosterId,
          spirit_score: chatbotInfos.opponentTeams[0].spirit.total,
        };
        const res = await addSpiritSubmission(spirit);
        if (!res) {
          this.sendMessages(
            webhookEvent.sender.id,
            Response.genQuickReply(
              i18n.__('spirit_submission.failed'),
              MESSENGER_QUICK_REPLIES.CONFIRMATION,
            ),
          );
          return;
        }
        this.sendMessages(
          webhookEvent.sender.id,
          Response.genText(i18n.__('spirit_submission.confirmed')),
        );
        nextState = BASIC_CHATBOT_STATES.HOME;
      } catch (e) {
        if (e.message == ERROR_ENUM.VALUE_ALREADY_EXISTS) {
          this.sendMessages(webhookEvent.sender.id, [
            Response.genText(
              i18n.__('spirit_submission.already_submitted'),
            ),
            Response.genText(i18n.__('back_to_menu')),
          ]);
          nextState = BASIC_CHATBOT_STATES.HOME;
        } else {
          throw e;
        }
      }
    } else if (this.isNo(webhookEvent)) {
      //TODO Newstate that ask which modification
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SPIRIT_RULES;
    } else if (
      this.isStop(webhookEvent) ||
      this.isStartOver(webhookEvent)
    ) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      this.sendIDontUnderstand(webhookEvent);
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }

  getIntroMessages() {
    const total = Object.values(
      this.context.chatbotInfos.opponentTeams[0].spirit,
    ).reduce((t, value) => t + value, 0);
    this.context.chatbotInfos.opponentTeams[0].spirit.total = total;
    return [
      Response.genQuickReply(
        i18n.__('spirit_submission.confirmation', {
          ...this.context.chatbotInfos.opponentTeams[0].spirit,
          total,
        }),
        MESSENGER_QUICK_REPLIES.CONFIRMATION,
      ),
    ];
  }
}

module.exports = AwaitingSpiritSubmissionConfirmation;
