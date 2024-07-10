import {AnsiUp} from 'ansi_up';
import { CSSProperties } from 'react';

interface AnsiTextProps {
  text: string;
}

const style: CSSProperties = {
  color: 'white',
};

function AnsiText({ text }: AnsiTextProps) {
  const ansi_up = new AnsiUp();

  return (
    <span style={style} dangerouslySetInnerHTML={{
      __html: ansi_up.ansi_to_html(text),
    }} />
  );
}

export default AnsiText;
