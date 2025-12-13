import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Table,
  Alert,
  Stack,
  Text,
  ActionIcon,
  Loader,
  Group,
} from '@mantine/core';
import {
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import {
  fetchTopUsers,
  fetchUserWorkflows,
  deleteUser,
  UserWithStats,
  UserWorkflow,
} from '../../clients/backoffice-client';

const UserManagement = observer(() => {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [userWorkflows, setUserWorkflows] = useState<
    Record<number, UserWorkflow[]>
  >({});
  const [loadingWorkflows, setLoadingWorkflows] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTopUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (userId: number) => {
    // If already expanded, collapse
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }

    // Expand and load workflows if not cached
    setExpandedUserId(userId);

    if (!userWorkflows[userId]) {
      setLoadingWorkflows(userId);
      try {
        const workflows = await fetchUserWorkflows(userId);
        setUserWorkflows((prev) => ({ ...prev, [userId]: workflows }));
      } catch (err: any) {
        setError(err.message || 'Failed to load workflows');
      } finally {
        setLoadingWorkflows(null);
      }
    }
  };

  const handleDelete = async (userId: number, userEmail: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete user "${userEmail}"?\n\n` +
        `This will permanently delete:\n` +
        `- The user's Supabase authentication account\n` +
        `- All local database records\n` +
        `- All workflows and workflow runs\n\n` +
        `This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingUserId(userId);
    setError(null);
    setSuccessMessage(null);

    try {
      await deleteUser(userId);
      setSuccessMessage(`User "${userEmail}" deleted successfully`);
      // Reload users list
      await loadUsers();
      setExpandedUserId(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setDeletingUserId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container size='lg' py='xl'>
        <Loader />
      </Container>
    );
  }

  return (
    <Container size='lg' py='xl'>
      <Title order={1} mb='lg'>
        User Management
      </Title>

      <Stack gap='md'>
        {error && (
          <Alert
            color='red'
            icon={<IconX size={16} />}
            onClose={() => setError(null)}
            withCloseButton
          >
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert
            color='green'
            icon={<IconCheck size={16} />}
            onClose={() => setSuccessMessage(null)}
            withCloseButton
          >
            {successMessage}
          </Alert>
        )}

        <Text c='dimmed' size='sm'>
          Top 10 users sorted by number of workflows (approved only)
        </Text>

        <Table striped withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '30px' }}></Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Workflows</Table.Th>
              <Table.Th>Total Runs</Table.Th>
              <Table.Th>Last Activity</Table.Th>
              <Table.Th style={{ width: '80px' }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <>
                <Table.Tr
                  key={user.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleExpand(user.id)}
                >
                  <Table.Td>
                    <ActionIcon variant='subtle' size='sm'>
                      {expandedUserId === user.id ? (
                        <IconChevronDown size={16} />
                      ) : (
                        <IconChevronRight size={16} />
                      )}
                    </ActionIcon>
                  </Table.Td>
                  <Table.Td>{user.fullName || 'N/A'}</Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>
                    <Text ta={'center'}>{user.workflowCount}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text ta={'center'}>{user.totalRuns}</Text>
                  </Table.Td>
                  <Table.Td>{formatDate(user.lastActivity)}</Table.Td>
                  <Table.Td onClick={(e) => e.stopPropagation()} ta={'center'}>
                    <ActionIcon
                      color='red.6'
                      variant='subtle'
                      onClick={() => handleDelete(user.id, user.email)}
                      loading={deletingUserId === user.id}
                      disabled={deletingUserId !== null}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>

                {expandedUserId === user.id && (
                  <Table.Tr>
                    <Table.Td
                      colSpan={7}
                      style={{ backgroundColor: 'var(--mantine-color-gray-9)' }}
                    >
                      {loadingWorkflows === user.id ? (
                        <Group justify='center' py='md'>
                          <Loader size='sm' />
                        </Group>
                      ) : userWorkflows[user.id]?.length > 0 ? (
                        <Stack gap='xs' py='sm' px='md'>
                          <Text fw={500} size='sm'>
                            Workflows ({userWorkflows[user.id].length})
                          </Text>
                          <Table striped withTableBorder>
                            <Table.Thead>
                              <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>ID</Table.Th>
                                <Table.Th>Runs</Table.Th>
                                <Table.Th>Last Run</Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              {userWorkflows[user.id].map((workflow) => (
                                <Table.Tr key={workflow.id}>
                                  <Table.Td>{workflow.name}</Table.Td>
                                  <Table.Td>{workflow.id}</Table.Td>
                                  <Table.Td>{workflow.runs}</Table.Td>
                                  <Table.Td>
                                    {formatDate(workflow.lastRun)}
                                  </Table.Td>
                                </Table.Tr>
                              ))}
                            </Table.Tbody>
                          </Table>
                        </Stack>
                      ) : (
                        <Text c='dimmed' size='sm' py='md' ta='center'>
                          No approved workflows
                        </Text>
                      )}
                    </Table.Td>
                  </Table.Tr>
                )}
              </>
            ))}
          </Table.Tbody>
        </Table>

        {users.length === 0 && (
          <Text c='dimmed' ta='center' py='xl'>
            No users found
          </Text>
        )}
      </Stack>
    </Container>
  );
});

export default UserManagement;
