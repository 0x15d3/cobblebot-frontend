import { Timestamp } from 'firebase/firestore';

interface DateTimeProps {
  time: string | Date | any | undefined;
  dateOnly?: boolean
}

function DateTime({ time, dateOnly = false }: DateTimeProps) {
  if (!time) {
    return <time>N/A</time>;
  }

  let date;
  if (time.toDate) {
    date = time.toDate();
  } else if (time.hasOwnProperty.call('_seconds')) {
    const fireTimestamp = new Timestamp(time._seconds, time._nanoseconds);
    date = fireTimestamp.toDate();
  } else {
    date = new Date(time);
  }

  const result = dateOnly ? date.toLocaleDateString() : date.toLocaleString();
  return <time dateTime={date.toString()}>{result}</time>
}

export default DateTime;
