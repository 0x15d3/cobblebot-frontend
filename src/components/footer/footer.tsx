import { CSSProperties } from 'react';
import { Divider, Layout, Space, Typography } from 'antd';

const style: CSSProperties = {
  textAlign: 'center',
  width: '100%',
}

function Footer() {
  const year = new Date().getFullYear();

  const links = [
    { title: 'GitHub', url: 'https://github.com/0x15d3' },
    { title: 'Discord', url: 'https://discord.gg/b2Eb9wPRxq' },
  ];

  return (
    <Layout.Footer style={style}>
      <Space size="large">
        <span>&copy; {year} CobbleBot.</span>
        <Space split={<Divider type="vertical" />}>
          {links.map(link => (
            <Typography.Link key={link.title} href={link.url} target="_blank">{link.title}</Typography.Link>
          ))}
        </Space>
      </Space>
    </Layout.Footer>
  );
}

export default Footer;
