import { pgTable, text, timestamp, boolean, integer, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  crmv: text('crmv').notNull(),
  state: text('state').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  passwordHash: text('password_hash'),
  role: text('role').notNull().default('veterinarian'), // 'admin' or 'veterinarian'
  status: text('status').notNull().default('PENDENTE'), // 'PENDENTE', 'ATIVO', 'BLOQUEADO'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  approvedAt: timestamp('approved_at'),
  lastLogin: timestamp('last_login'),
  currentSessionId: text('current_session_id'),
});

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  veterinarianId: uuid('veterinarian_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const pets = pgTable('pets', {
  id: uuid('id').primaryKey().defaultRandom(),
  veterinarianId: uuid('veterinarian_id').references(() => users.id).notNull(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  name: text('name').notNull(),
  species: text('species').notNull(), // Cão, Gato
  sex: text('sex').notNull(),
  reproductiveStatus: text('reproductive_status').notNull(),
  weight: text('weight'),
  breed: text('breed'),
  birthDate: text('birth_date'),
  microchip: text('microchip'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const consultations = pgTable('consultations', {
  id: uuid('id').primaryKey().defaultRandom(),
  veterinarianId: uuid('veterinarian_id').references(() => users.id).notNull(),
  petId: uuid('pet_id').references(() => pets.id).notNull(),
  anamnesis: text('anamnesis'),
  physicalExam: text('physical_exam'),
  aiAnalysis: text('ai_analysis'),
  finalDiagnosis: text('final_diagnosis'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), // Soft delete
});

export const exams = pgTable('exams', {
  id: uuid('id').primaryKey().defaultRandom(),
  veterinarianId: uuid('veterinarian_id').references(() => users.id).notNull(),
  consultationId: uuid('consultation_id').references(() => consultations.id).notNull(),
  filename: text('filename').notNull(),
  fileType: text('file_type').notNull(),
  storagePath: text('storage_path').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

export const prescriptions = pgTable('prescriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  veterinarianId: uuid('veterinarian_id').references(() => users.id).notNull(),
  consultationId: uuid('consultation_id').references(() => consultations.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  action: text('action').notNull(),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
