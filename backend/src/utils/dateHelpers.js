/**
 * Returns today's date at midnight (00:00:00.000)
 * in the server's local timezone.
 *
 * Used for:
 * - Rule 1: Active visit determination
 * - Rule 3: visitDate cannot be earlier than today
 */
export const startOfToday = () => {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

/**
 * Returns true if the given date is today.
 */
export const isSameDateAsToday = (date) => {
  const inputDate = new Date(date);
  const today = new Date();

  return (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate()
  );
};

/**
 * Converts "HH:mm" into total minutes.
 *
 * Example:
 * "09:30" -> 570
 * "14:45" -> 885
 */
export const timeStringToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

/**
 * Returns the current time in minutes since midnight.
 *
 * Example:
 * 09:30 -> 570
 */
export const currentMinutesOfDay = () => {
  const now = new Date();

  return now.getHours() * 60 + now.getMinutes();
};
