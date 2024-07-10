import React from 'react';
import { Space } from 'antd';
import { CSSProperties } from 'react';
import { isMobile } from 'react-device-detect';

const style: CSSProperties = {
  width: '100%',
};

function CardContainer({ children }: React.PropsWithChildren<any>) {
  return (
    <Space direction="vertical" align="center" style={style}>
      <Space direction="horizontal" align="start"  size={isMobile ? 'small' : 'large'} wrap>
        {children}
      </Space>
    </Space>
  );
}

export default CardContainer;
