import { Layout, Spin } from 'antd';
import { CSSProperties } from 'react';

const style: CSSProperties = {
  display: 'table-cell',
  width: '100vw',
  height: '100vh',
  textAlign: 'center',
  verticalAlign: 'middle',
};

function FullPageLoading() {
  return (
    <Layout style={style} data-testid="full-page-loading">
      <Layout.Content>
        <Spin size="large" />
      </Layout.Content>
    </Layout>
  );
}

export default FullPageLoading;
