import { Space, Timeline } from 'antd';
import DateTime from '../page/DateTime';

export interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
}

interface BotLogsProps {
  logs: LogEntry[];
  reverse?: boolean;
  narrow?: boolean;
}

export default function BotLogs({ logs, reverse = false, narrow = false }: BotLogsProps) {
  return (
    <Timeline reverse={reverse}>
      {logs.map(log => (
        <Timeline.Item key={log.timestamp} color={log.level === 'error' ? 'red' : 'blue'}>
          <Space direction={narrow ? 'vertical' : 'horizontal'}>
            <DateTime time={log.timestamp} />
            {log.message}
          </Space>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
