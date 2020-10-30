const State = require('../state');
const {
  SCORE_SUBMISSION_CHATBOT_STATES,
  BASIC_CHATBOT_STATES,
  MESSENGER_MESSAGES_FR,
  MESSENGER_PAYLOADS,
} = require('../../../../../../../common/enums');

class AwaitingScoreSubmissionConfirmation extends State {
  handleEvent(webhookEvent) {
    let nextState;
    if (this.isYes(webhookEvent)) {
      //TODO SAVE SCORE
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.SPIRIT_SUBMISSION_REQUEST_SENT;
    } else if (this.isNo(webhookEvent)) {
      nextState =
        SCORE_SUBMISSION_CHATBOT_STATES.AWAITING_SCORE_SUBMISSION;
    } else if (
      this.isStop(webhookEvent) ||
      this.isStartOver(webhookEvent)
    ) {
      nextState = BASIC_CHATBOT_STATES.HOME;
    } else {
      this.sendMessages(webhookEvent.sender.id, [
        MESSENGER_MESSAGES_FR.I_DONT_UNDERSTAND,
        this.getIntroMessages(),
      ]);
    }
    if (nextState) {
      this.context.changeState(nextState);
    }
  }

  getIntroMessages() {
    //TODO personalise if victory or defeat
    //return MESSENGER_MESSAGES_FR.SCORE_SUBMISSION_VICTORY;
    return {
      text: `Vous avez remporté votre partie contre A20 par le pointage de ${this.context.chatbotInfos.myScore} à ${this.context.chatbotInfos.opponentScore}, est-ce bien le cas? Veuillez répondre oui pour confirmer, non pour ressoumettre votre pointage`,
      quick_replies: [
        {
          content_type: 'text',
          title: 'Oui',
          payload: MESSENGER_PAYLOADS.YES,
        },
        {
          content_type: 'text',
          title: 'Non',
          payload: MESSENGER_PAYLOADS.NO,
        },
      ],
    };
  }
}

module.exports = AwaitingScoreSubmissionConfirmation;
