const ejs = require('ejs');
const i18n = require('../../i18n.config');

module.exports = async function AddedToRoster(infos) {
  const { name, teamName, eventId } = infos;
  const buttonLink = `https://sportfolios.app/${eventId}?tab=roster`;
  const text = i18n.__('emails.added_to_roster_text', {
    name,
    teamName,
  });
  const buttonText = i18n.__('email.added_to_roster_button');
  const subject = i18n.__('emails.added_to_roster_subject');
  try {
    const html = await ejs.renderFile(
      __dirname + '/templates/textAndButton.ejs',
      { buttonLink, text, buttonText },
    );
    return { html, subject };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};
