async function handleSpiritCommunication(messengerId, event) {
  const score = Number(event.message.text);
}
async function handleSpiritEquity(messengerId, event) {
  const score = Number(event.message.text);
}
async function handleSpiritRules(messengerId, event) {
  const score = Number(event.message.text);
}
async function handleSpiritFoul(messengerId, event) {
  const score = Number(event.message.text);
}
async function handleSpiritSelfControl(messengerId, event) {
  const score = Number(event.message.text);
}
async function handleSpiritNoPayload(messengerId, score) {
  //getStatus
  //check if it is a sprit status
  //yes: save spirit and change status
  //no : send unsuportedmessageresponse
}
async function handleScoreSubmission(
  messengerId,
  myScore,
  opponentScore,
) {}
async function handleConfirmationNoPayload(
  messengerId,
  isConfirming,
) {
  //check if is in a awaitng confirmation state
  //if yes jump to next state else
}
async function handleSpiritConfirmation(messengerId, score) {}
async function handleScoreConfirmation(messengerId, score) {}

module.exports = {
  handleSpiritCommunication,
  handleSpiritEquity,
  handleSpiritRules,
  handleSpiritFoul,
  handleSpiritSelfControl,
  handleSpiritNoPayload,
  handleScoreSubmission,
  handleConfirmationNoPayload,
  handleSpiritConfirmation,
  handleScoreConfirmation,
};
