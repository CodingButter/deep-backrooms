import { db } from '../db';
import { Agent } from './types';

export async function getAgents(): Promise<Agent[]> {
  return await db.Agent.findMany();
}