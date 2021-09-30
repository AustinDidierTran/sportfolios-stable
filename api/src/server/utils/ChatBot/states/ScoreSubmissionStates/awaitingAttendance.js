import State from '../state.js';
import { BASIC_CHATBOT_STATES, TABS_ENUM } from '../../../../../../../common/enums/index.js';
import i18n from '../../../../../i18n.config.js';
import response from '../../response.js';
import { MESSENGER_PAYLOADS } from '../../../enums/index.js';
import { getAttendanceSheet } from '../../../../../db/queries/entity-deprecate.js';
import { CLIENT_BASE_URL } from '../../../../../../../conf.js';
class AwaitingAttendance extends State {
  async handleEvent(webhookEvent) {
    this.sendMessages(
      webhookEvent.sender.id,
      response.genText(i18n.__('back_to_menu')),
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
          response.genButtonTemplate(
            i18n.__(
              "Your team's attendance sheet has not been submitted yet for this game, please complete it on Sportfolios",
            ),
            [
              response.genWebUrlButton(
                i18n.__('Fill the attendance sheet'),
                `${CLIENT_BASE_URL}/${chatbotInfos.eventId}?tab=${TABS_ENUM.SCHEDULE}&gameId=${chatbotInfos.gameId}`,
              ),
              response.genPostbackButton(
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
          response.genText(
            i18n.__(
              'Your team has already submitted an attendance sheet for this game',
            ),
          ),
          response.genText(i18n.__('back_to_menu')),
        ],
        nextState: BASIC_CHATBOT_STATES.HOME,
      };
    }
  }
}

export default AwaitingAttendance;
