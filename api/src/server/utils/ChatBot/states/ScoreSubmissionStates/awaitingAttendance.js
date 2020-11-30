const State = require('../state');
const {
  BASIC_CHATBOT_STATES,
  TABS_ENUM,
} = require('../../../../../../../common/enums');
const i18n = require('../../../../../i18n.config');
const {
  genWebUrlButton,
  genButtonTemplate,
  genPostbackButton,
  genText,
} = require('../../response');
const { MESSENGER_PAYLOADS } = require('../../../enums');

class AwaitingAttendance extends State {
  async handleEvent(webhookEvent) {
    this.sendMessages(
      webhookEvent.sender.id,
      genText(i18n.__('back_to_menu')),
    );
    this.context.changeState(BASIC_CHATBOT_STATES.HOME);
  }

  async getIntroMessages() {
    const chatbotInfos = this.context.chatbotInfos;

    const sheet = await getAttendanceSheet({
      game_id: chatbotInfos.gameId,
      roster_id: chatbotInfos.myRosterId,
    });
    if (sheet.length === 0) {
      return {
        messages: [
          genButtonTemplate(
            i18n.__(
              "Your team's attendance sheet has not been submitted yet for this game, please complete it on Sportfolios",
            ),
            [
              genWebUrlButton(
                i18n.__('Fill the attendance sheet'),
                `https://sportfolios.app/${chatbotInfos.eventId}?tab=${TABS_ENUM.SCHEDULE}&gameId=${chatbotInfos.gameId}`,
              ),
              genPostbackButton(
                i18n.__('Skip'),
                MESSENGER_PAYLOADS.SKIP,
              ),
            ],
          ),
        ],
      };
    } else {
      return {
        messages: [
          genText(
            i18n.__(
              'Your team has already submitted an attendance sheet for this game',
            ),
          ),
          genText(i18n.__('back_to_menu')),
        ],
        nextState: BASIC_CHATBOT_STATES.HOME,
      };
    }
  }
}

module.exports = AwaitingAttendance;
