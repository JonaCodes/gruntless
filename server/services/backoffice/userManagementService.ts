import { fn, col, QueryTypes } from 'sequelize';
import { sequelize } from '../../models/index';
import User from '../../models/user';
import Workflow from '../../models/workflow';
import WorkflowRun from '../../models/workflow_run';
import { WORKFLOW_VERSION_STATUS } from '@shared/consts/workflows';
import { supabase } from '../../utils/general';

interface UserWithStats {
  id: number;
  email: string;
  fullName: string | null;
  workflowCount: number;
  totalRuns: number;
  lastActivity: Date | null;
}

interface UserWorkflowWithStats {
  id: number;
  name: string;
  runs: number;
  lastRun: Date | null;
}

export const getTopUsersWithStats = async (): Promise<UserWithStats[]> => {
  const users = (await sequelize.query(
    `
    SELECT
      u.id,
      u.email,
      u.full_name AS "fullName",
      COUNT(DISTINCT w.id) AS "workflowCount",
      COUNT(wr.id) AS "totalRuns",
      MAX(wr.created_at) AS "lastActivity"
    FROM users u
    LEFT JOIN workflows w ON w.user_id = u.id AND w.status = 'approved'
    LEFT JOIN workflow_runs wr ON wr.workflow_id = w.id
    GROUP BY u.id, u.email, u.full_name
    ORDER BY "workflowCount" DESC
    LIMIT 10
    `,
    { type: QueryTypes.SELECT }
  )) as Array<{
    id: number;
    email: string;
    fullName: string | null;
    workflowCount: string; // PostgreSQL COUNT returns bigint as string
    totalRuns: string;
    lastActivity: Date | null;
  }>;

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    workflowCount: parseInt(u.workflowCount || '0'),
    totalRuns: parseInt(u.totalRuns || '0'),
    lastActivity: u.lastActivity,
  }));
};

export const getUserWorkflowsWithRunStats = async (
  userId: number
): Promise<UserWorkflowWithStats[]> => {
  const workflows = await Workflow.findAll({
    where: {
      userId,
      status: WORKFLOW_VERSION_STATUS.APPROVED,
    },
    attributes: [
      'id',
      'name',
      [fn('COUNT', col('runs.id')), 'runs'],
      [fn('MAX', col('runs.created_at')), 'lastRun'],
    ],
    include: [
      {
        model: WorkflowRun,
        as: 'runs',
        attributes: [],
        required: false,
      },
    ],
    group: ['Workflow.id'],
    order: [['name', 'ASC']],
    raw: true,
  }) as unknown as Array<{
    id: number;
    name: string;
    runs: string;
    lastRun: string | null;
  }>;

  return workflows.map((w) => ({
    id: w.id,
    name: w.name,
    runs: parseInt(w.runs || '0'),
    lastRun: w.lastRun ? new Date(w.lastRun) : null,
  }));
};

export const deleteUserCompletely = async (
  userId: number
): Promise<void> => {
  // 1. Find user with supabaseId
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const supabaseId = user.supabaseId;

  // 2. Delete from Supabase Auth (using admin client)
  const { error: supabaseError } = await supabase.auth.admin.deleteUser(
    supabaseId
  );

  if (supabaseError) {
    throw new Error(`Failed to delete Supabase user: ${supabaseError.message}`);
  }

  // 3. Delete from local DB (CASCADE will handle related records)
  // This will cascade to: Workflows -> WorkflowRuns, WorkflowMessages, etc.
  await user.destroy();
};
