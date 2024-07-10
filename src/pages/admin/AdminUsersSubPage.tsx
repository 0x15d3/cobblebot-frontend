// AdminUsersSubPage.tsx

import { useState, useEffect } from 'react';
import { Button, Card, List, Modal, Skeleton, Avatar, Space, Input } from 'antd';
import { listUsers, saveCustomClaims } from '../../firebase/admin';
import { Link } from 'react-router-dom';
import { EyeOutlined, FacebookFilled, GoogleSquareFilled, MailFilled, SaveOutlined, UserOutlined } from '@ant-design/icons';
import AdminHeader from './AdminHeader';

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  providerData: any[];
  customClaims: any[];
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
}

function AdminUsersSubPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditingCustomClaims, setIsEditingCustomClaims] = useState(false);
  const [customClaimsInput, setCustomClaimsInput] = useState<string>('');

  const getUserName = (name: string, email: string) => {
    if (!name) {
      return email;
    }
    if (!email) {
      return name;
    }
    return `${name} (${email})`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers: any = await listUsers();
        setUsers(fetchedUsers.users as User[]);
        setIsLoading(false);
      } catch (error) {
        setError('An unknown error occurred');
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);  

  const handleEditCustomClaims = (user: User) => {
    setSelectedUser(user);
    setCustomClaimsInput(user.customClaims?.join(', ') || '');
    setIsEditingCustomClaims(true);
  };

  const handleSaveCustomClaims = async () => {
    if (selectedUser) {
      try {
        const result = await saveCustomClaims(selectedUser.uid, customClaimsInput.split(',').map(claim => claim.trim()));
        console.log(result);
        setIsEditingCustomClaims(false);
      } catch (error) {
        console.error('Error saving custom claims:', error);
      }
    }
  };

  return (
    <>
      <AdminHeader title={`Kullanıcılar ${isLoading ? '' : `(${users.length})`}`} />
      {isLoading && <Skeleton avatar active />}
      {!isLoading && !error && (
        <Card>
          <List
            dataSource={users}
            renderItem={user => (
              <List.Item
                key={user.uid}
                extra={
                  <>
                    <Link to={`/${user.uid}`} target="_blank">
                      <Button icon={<EyeOutlined />}></Button>
                    </Link>
                    <Button icon={<SaveOutlined />} onClick={() => handleEditCustomClaims(user)}></Button>
                  </>
                }
                actions={[]}
              >
                <List.Item.Meta
                  avatar={user.photoURL ? <Avatar size="large" src={user.photoURL} /> : <Avatar size="large" icon={<UserOutlined />} />}
                  title={getUserName(user.displayName, user.email)}
                  description={(
                    <Space key={user.uid}>
                      UID: {user.uid}
                      {user.providerData && user.providerData.map(({ providerId }: any) => {
                        if (providerId === 'password') {
                          return <MailFilled />;
                        }
                        if (providerId === 'facebook.com') {
                          return <FacebookFilled />;
                        }
                        if (providerId === 'google.com') {
                          return <GoogleSquareFilled />;
                        }
                        return <></>;
                      })}
                      <br />
                      Oluşturma Tarihi: {user.metadata.creationTime}
                      <br />
                      Son Görülme: {user.metadata.lastSignInTime}
                      <br />
                      Roller: {user.customClaims?.join(", ")}
                    </Space>
                  )}
                />
              </List.Item>
            )}
          />
        </Card>
      )}
      {error && (
        <Modal
          title="Error"
          visible={!!error}
          onCancel={() => setError(undefined)}
          footer={[
            <Button key="ok" onClick={() => setError(undefined)}>
              OK
            </Button>,
          ]}
        >
          <p>{error}</p>
        </Modal>
      )}

      <Modal
        title="Custom Claims Ekle/Düzenle"
        visible={isEditingCustomClaims}
        onCancel={() => setIsEditingCustomClaims(false)}
        onOk={handleSaveCustomClaims}
      >
        <p>
        Roller :{' '}
          <Input
            type="text"
            value={customClaimsInput}
            onChange={e => setCustomClaimsInput(e.target.value)}
          />
        </p>
      </Modal>
    </>
  );
}

export default AdminUsersSubPage;
