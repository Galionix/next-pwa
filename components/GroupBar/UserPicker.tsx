import { getUsersListWithIds, user } from '@/utils/fire';
import { useUserStore } from '@/utils/store';
import { UserOutlined } from '@ant-design/icons';
import { AutoComplete, Avatar, Input, Select } from 'antd';
import { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { IUser } from 'types/fireTypes';
import s from './UserPicker.module.scss';

export interface IUserData {
  id: string;
  name: string;
  imageUrl: string;
}

const renderItem = (user: IUser) => ({
  key: user.id,
  value: user.name,
  label: (
    <div
      key={user.id}
      style={{
        display: 'flex',
        // justifyContent: 'space-around',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <img
        className={s.avatar}
        src={user.imageUrl}
        alt=''
        referrerPolicy='no-referrer'
      />
      {user.name}
      {/* <Avatar src={user.imageUrl} referrerPolicy='no-referrer'/> */}
      {/* <span>
        <UserOutlined />
      </span> */}
    </div>
  ),
});

interface IUserPickerProps {
    onUserSelect: (user: IUserData[]) => void;
    selectedUsers: IUserData[];
}

export const UserPicker = ({ onUserSelect ,selectedUsers}: IUserPickerProps) => {
    const [usersList, setUsersList] = useState<IUser[]>();
    const {user} = useUserStore()


  useEffect(() => {
    getUsersListWithIds().then(data => {
      setUsersList(data);
      // setOptions
    })
  }, []);

  if (!usersList) {
    return <Select loading={!usersList} mode='multiple' options={[]} allowClear />;
  }

    const defaultOptions = usersList.map(user => renderItem(user))
        .filter(us => {
             return us.key !== user.id
        })
        ;

  // const onSearch = (searchText: string) => {
  //     console.log('searchText: ', searchText);
  //     return options.filter(o => o.value.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  // };

  return (
    <Select
      loading={!usersList}
      mode='multiple'
      options={defaultOptions}
          allowClear
          style={{ width: '100%' }}
          onSelect={(value, option) => {
              console.log('value: ', value);
              console.log('option: ', option);
              const selectedUser = usersList.filter(user => user.id === option.key);
              console.log('selected User: ', selectedUser);
              if (selectedUser.length > 0 && !selectedUsers.includes(selectedUser[0])) {
                //   setSelectedUsers([...selectedUsers, ...selectedUser]);
                  onUserSelect([...selectedUsers, ...selectedUser])
              }
          }}
          onDeselect={(value, option) => {
              console.log('value: ', value);
              console.log('option: ', option);
              const selectedUser = usersList.filter(user => user.id === option.key);
              console.log('selected User: ', selectedUser);
              if (selectedUser.length > 0) {
                  onUserSelect(selectedUsers.filter(user => user.id !== selectedUser[0].id))
              }
          }}

    />
    // <AutoComplete
    //   allowClear={true}
    //       autoFocus={ true}
    //       defaultOpen={ true}
    //   // popupClassName="certain-category-search-dropdown"
    //   dropdownMatchSelectWidth={500}
    //   style={{ width: 250 }}
    //   options={usersList
    //     .map(user => renderItem(user))
    //     .filter(
    //       o => o.value.toLowerCase().indexOf(searchText.toLowerCase()) !== -1,
    //     )}
    //       onSearch={setSearchText}
    //       onSelect={(value, option) => {
    //           console.log('onSelect: ', value, option);
    //           const user = usersList.find(u => u.id === option.key)
    //           if (user) {
    //               onUserSelect(user)
    //           }
    //       }}

    // >
    //   <Input.Search size='large' placeholder='input here' />
    // </AutoComplete>
  );
};
