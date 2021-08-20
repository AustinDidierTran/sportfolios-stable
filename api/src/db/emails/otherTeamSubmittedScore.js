import ejs from 'ejs';
import i18n from '../../i18n.config.js';

export default async function otherTeamSubmittedScore(infos) {
  const {
    eventName,
    locale,
    buttonLink,
    otherTeamName,
    otherTeamScore,
    myTeamName,
    myTeamScore,
  } = infos;

  const text = i18n.__(
    { phrase: 'emails.other_team_submitted_score', locale },
    otherTeamName,
    otherTeamName,
    otherTeamScore,
    myTeamName,
    myTeamScore,
    eventName,
  );
  const buttonText = i18n.__({
    phrase: 'emails.access',
    locale,
  });
  const subject = i18n.__({
    phrase: 'emails.other_team_score_submission_request_subject',
    locale,
  });
  const html = await ejs.renderFile(
    __dirname + '/templates/textAndButton.ejs',
    {
      buttonLink,
      text,
      buttonText
    },
  );
  return { html, subject };
};
