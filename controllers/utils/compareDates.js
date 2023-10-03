function compareDates(a, b) {
  const dateA = new Date(a.created_at);
  const dateB = new Date(b.created_at);

  // Compare the dates
  if (dateA < dateB) {
    return 1;
  }
  if (dateA > dateB) {
    return -1;
  }
  return 0;
}

module.exports = compareDates;
