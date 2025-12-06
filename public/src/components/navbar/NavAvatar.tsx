import { Avatar, Flex, Skeleton, Text } from '@mantine/core';
import userStore from '../../stores/userStore';
import { supabase } from 'public/src/lib/supabase';
import { observer } from 'mobx-react-lite';

const NavAvatar = observer(() => {
  const user = userStore.user;
  if (userStore.isLoadingUser) {
    return (
      <Flex gap={'xs'} align={'center'}>
        <Skeleton circle animate height={32} width={32} />
        <Flex direction={'column'} gap={'xs'}>
          <Skeleton height={8} width={100} />
          <Skeleton height={8} width={100} />
        </Flex>
      </Flex>
    );
  }
  return (
    <Flex justify={'center'} align={'end'} gap={'xs'}>
      <Avatar
        src={user?.avatarUrl}
        alt={user?.fullName}
        name={user?.fullName}
        size={'md'}
      />
      <Flex direction={'column'}>
        <Text size='sm'>{user?.fullName}</Text>
        <Text
          size='xs'
          c={'dimmed'}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            supabase.auth.signOut();
            userStore.clearUser();
          }}
        >
          {userStore.user?.id ? 'Sign out' : ''}
        </Text>
      </Flex>
    </Flex>
  );
});

export default NavAvatar;
